import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { parishAPI } from '../utils/api';
import './ParishSpace.css';

const ParishSpace = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [presence, setPresence] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        type: 'confession',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        notes: ''
    });
    const [busySlots, setBusySlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const chatEndRef = useRef(null);
    const prevMessagesLength = useRef(0);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Polling for demo simplicity
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Only scroll if new messages were added
        if (messages.length > prevMessagesLength.current) {
            const isFirstLoad = prevMessagesLength.current === 0;

            // Check if user is near bottom before scrolling
            const container = chatEndRef.current?.parentElement;
            if (container) {
                const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

                if (isFirstLoad || isNearBottom) {
                    scrollToBottom();
                }
            }
            prevMessagesLength.current = messages.length;
        }
    }, [messages]);

    const fetchData = async () => {
        try {
            const [msgRes, presRes] = await Promise.all([
                parishAPI.getCommunalChat(),
                parishAPI.getPresence()
            ]);
            setMessages(msgRes.data);
            setPresence(presRes.data.isAtChurch);

            if (user) {
                const bookingsRes = await parishAPI.getMyBookings();
                setMyBookings(bookingsRes.data);
            }

            loadBusySlots(bookingData.date);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadBusySlots = async (date) => {
        try {
            const res = await parishAPI.getBusySlots(date);
            setBusySlots(res.data);
        } catch (err) {
            console.error('Error loading busy slots:', err);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${bookingData.date}T${bookingData.time}`);
            await parishAPI.bookService({
                type: bookingData.type,
                dateTime,
                notes: bookingData.notes
            });
            alert(t('დაჯავშნა წარმატებით შესრულდა! მამაო განიხილავს თქვენს მოთხოვნას.', 'Booking successful! Father will review your request.'));
            fetchData();
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('დაჯავშნა ვერ მოხერხდა', 'Booking failed');
            const errorDetails = err.response?.data?.details ? `\n\nDetails: ${err.response.data.details}` : '';
            alert(`${errorMessage}${errorDetails}`);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await parishAPI.sendMessage({ content: newMessage });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Send error:', err);
        }
    };

    const togglePresence = async () => {
        try {
            const res = await parishAPI.togglePresence();
            setPresence(res.data.isAtChurch);
        } catch (err) {
            console.error('Presence toggle error:', err);
        }
    };

    if (loading) return <div className="loading">{t('იკრიბება...', 'Gathering...')}</div>;

    return (
        <div className="parish-space">
            <div className="parish-container fade-in">
                {/* Header with Presence Indicator */}
                <div className="parish-header">
                    <div className="parish-info">
                        <h1>{t('სამრევლო სივრცე', 'Parish Space')}</h1>
                        <p>{user ? `${t('კეთილი იყოს თქვენი მობრძანება, ', 'Welcome, ')} ${user?.fullName || user?.username}` : t('ინფორმაცია და განრიგი სტუმრებისთვის', 'Information and schedule for guests')}</p>
                    </div>
                    <div className={`presence-indicator ${presence ? 'at-church' : 'away'}`}>
                        <div className="status-dot"></div>
                        <span>
                            {presence
                                ? t('მამაო ტაძარშია', 'Father is at the church')
                                : t('მამაო ამჟამად არ არის ტაძარში', 'Father is away currently')}
                        </span>
                        {user?.role === 'rector' && (
                            <button className="btn-presence" onClick={togglePresence}>
                                {presence ? t('გასვლა', 'Check-out') : t('დაჩექინება', 'Check-in')}
                            </button>
                        )}
                    </div>
                </div>

                <div className="parish-main">
                    {/* Navigation Sidebar */}
                    <aside className="parish-nav">
                        <button
                            className={activeTab === 'chat' ? 'active' : ''}
                            onClick={() => setActiveTab('chat')}
                        >
                            💬 {t('საუბარი', 'Communal Chat')}
                        </button>
                        <button
                            className={activeTab === 'booking' ? 'active' : ''}
                            onClick={() => setActiveTab('booking')}
                        >
                            📅 {t('დაჯავშნა', 'Booking')}
                        </button>
                        <button
                            className={activeTab === 'info' ? 'active' : ''}
                            onClick={() => setActiveTab('info')}
                        >
                            📜 {t('ინფორმაცია', 'Information')}
                        </button>
                    </aside>

                    {/* Content Area */}
                    <div className="parish-content">
                        {activeTab === 'chat' && (
                            !user ? (
                                <div className="auth-prompt small">
                                    <div className="auth-icon">💬</div>
                                    <h3>{t('საუბარი ხელმისაწვდომია მხოლოდ წევრებისთვის', 'Chat is only available for members')}</h3>
                                    <p>{t('შემოუერთდით ჩვენს სამწყსოს საუბარში მონაწილეობის მისაღებად.', 'Join our flock to participate in the conversation.')}</p>
                                    <div className="auth-actions">
                                        <button className="btn btn-primary" onClick={() => navigate('/login')}>
                                            {t('შესვლა', 'Login')}
                                        </button>
                                        <button className="btn btn-outline" onClick={() => navigate('/register')}>
                                            {t('რეგისტრაცია', 'Register')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="chat-section">
                                    <div className="messages-container">
                                        {messages.map((msg) => (
                                            <div key={msg._id} className={`message ${msg.sender?._id === user?.id ? 'own' : ''}`}>
                                                <div className="message-header">
                                                    <span className="sender-name">{msg.sender?.fullName}</span>
                                                    <span className="message-time">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="message-body">{msg.content}</div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <form className="message-form" onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            placeholder={t('ჩაწერეთ შეტყობინება...', 'Type a message...')}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button type="submit">➤</button>
                                    </form>
                                </div>
                            )
                        )}

                        {activeTab === 'booking' && (
                            <div className="booking-section">
                                <div className="booking-container">
                                    {user && (
                                        <div className="booking-form-card">
                                            <h3>{t('ახალი დაჯავშნა', 'New Booking')}</h3>
                                            <form className="booking-form" onSubmit={handleBookingSubmit}>
                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label>{t('მსახურება', 'Service')}</label>
                                                        <select
                                                            value={bookingData.type}
                                                            onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                                                        >
                                                            <option value="confession">{t('აღსარება', 'Confession')}</option>
                                                            <option value="baptism">{t('ნათლობა', 'Baptism')}</option>
                                                            <option value="wedding">{t('ჯვრისწერა', 'Wedding')}</option>
                                                            <option value="burial">{t('წესის აგება', 'Burial')}</option>
                                                            <option value="other">{t('სხვა', 'Other')}</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{t('თარიღი', 'Date')}</label>
                                                        <input
                                                            type="date"
                                                            value={bookingData.date}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            onChange={(e) => {
                                                                setBookingData({ ...bookingData, date: e.target.value });
                                                                loadBusySlots(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{t('დრო', 'Time')}</label>
                                                        <input
                                                            type="time"
                                                            value={bookingData.time}
                                                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>{t('შენიშვნა', 'Notes')}</label>
                                                    <textarea
                                                        value={bookingData.notes}
                                                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                                        placeholder={t('დამატებითი ინფორმაცია...', 'Additional information...')}
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary w-full">
                                                    {t('დაჯავშნა', 'Book Now')}
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    <div className="availability-card">
                                        <h3>{t('მამაოს განრიგი', "Father's Schedule")}</h3>
                                        <p className="date-display">📅 {bookingData.date}</p>
                                        <div className="busy-slots-list">
                                            {busySlots.length > 0 ? (
                                                busySlots.map((slot, i) => (
                                                    <div key={i} className="busy-slot">
                                                        <span className="slot-time">
                                                            {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                            {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="slot-label">{t('დაკავებულია', 'Busy')}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-slots">
                                                    {t('ამ დღეს ჯერ დაჯავშნები არ არის', 'No bookings for this day yet')}
                                                </div>
                                            )}
                                        </div>
                                        {!user && (
                                            <div className="guest-note info-box">
                                                <p>ℹ️ {t('დაჯავშნისთვის გაიარეთ ავტორიზაცია', 'Login to book a service')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {user && myBookings.length > 0 && (
                                    <div className="my-bookings">
                                        <h3>{t('ჩემი დაჯავშნები', 'My Bookings')}</h3>
                                        <div className="bookings-grid">
                                            {myBookings.map(app => {
                                                const statusInfo = {
                                                    pending: { label: t('მოლოდინში', 'Pending'), icon: '⏳', class: 'status-pending' },
                                                    confirmed: { label: t('დადასტურებულია', 'Confirmed'), icon: '✅', class: 'status-confirmed' },
                                                    cancelled: { label: t('გაუქმებულია', 'Cancelled'), icon: '❌', class: 'status-cancelled' },
                                                    completed: { label: t('დასრულებულია', 'Completed'), icon: '🏁', class: 'status-completed' }
                                                }[app.status] || { label: app.status, icon: '•', class: '' };

                                                return (
                                                    <div key={app._id} className={`booking-card ${statusInfo.class}`}>
                                                        <div className="booking-card-header">
                                                            <div className="booking-type">
                                                                {t(
                                                                    {
                                                                        confession: 'აღსარება',
                                                                        baptism: 'ნათლობა',
                                                                        wedding: 'ჯვრისწერა',
                                                                        burial: 'წესის აგება',
                                                                        liturgy: 'წირვა',
                                                                        other: 'სხვა'
                                                                    }[app.type] || app.type,
                                                                    app.type.charAt(0).toUpperCase() + app.type.slice(1)
                                                                )}
                                                            </div>
                                                            <div className={`status-tag ${app.status}`}>
                                                                {statusInfo.icon} {statusInfo.label}
                                                            </div>
                                                        </div>
                                                        <div className="booking-time">
                                                            📅 {new Date(app.dateTime).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', { day: 'numeric', month: 'long' })}
                                                            <br />
                                                            🕒 {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        {app.notes && <div className="booking-notes">📝 {app.notes}</div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'info' && (
                            <div className="info-section">
                                <h2>{t('წესები და პირობები', 'Rules & Information')}</h2>
                                <p>{t('სამრევლო სივრცე განკუთვნილია მხოლოდ ვერიფიცირებული მრევლის წევრებისთვის.', 'The Parish Space is strictly for verified community members.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParishSpace;
