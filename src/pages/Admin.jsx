import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { galleryAPI, contentAPI, parishAPI } from '../utils/api';
import './Admin.css';

const Admin = () => {
    const { user, logout } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [images, setImages] = useState([]);
    const [pageContent, setPageContent] = useState({});
    const [pendingMembers, setPendingMembers] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        category: 'construction',
        image: null
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'admin' && user.role !== 'rector') {
            // Security: Redirect non-admins to parish space
            navigate('/parish');
        } else {
            loadInitialData();
        }
    }, [user, navigate]);

    const loadInitialData = async () => {
        setLoading(true);
        await Promise.all([
            loadImages(),
            loadPageContent(),
            loadPendingMembers(),
            loadAllMembers(),
            loadAllAppointments()
        ]);
        setLoading(false);
    };

    const loadPendingMembers = async () => {
        try {
            const response = await parishAPI.getPendingMembers();
            setPendingMembers(response.data);
        } catch (error) {
            console.error('Failed to load pending members:', error);
        }
    };

    const loadAllMembers = async () => {
        try {
            const response = await parishAPI.getAllMembers();
            setAllMembers(response.data);
        } catch (error) {
            console.error('Failed to load all members:', error);
        }
    };

    const loadAllAppointments = async () => {
        try {
            const response = await parishAPI.getAllAppointments();
            setAllAppointments(response.data);
        } catch (error) {
            console.error('Failed to load all appointments:', error);
        }
    };

    const handleMemberStatus = async (id, status) => {
        try {
            await parishAPI.updateMemberStatus(id, status);
            loadPendingMembers();
            alert(status === 'approved' ? t('წევრი დადასტურებულია!', 'Member approved!') : t('სტატუსი განახლებულია', 'Status updated'));
        } catch (error) {
            console.error('Failed to update member status:', error);
            alert(t('განახლება ვერ მოხერხდა', 'Update failed'));
        }
    };

    const loadImages = async () => {
        try {
            const response = await galleryAPI.getAll();
            setImages(response.data);
        } catch (error) {
            console.error('Failed to load images:', error);
        }
    };

    const loadPageContent = async () => {
        try {
            const response = await contentAPI.getAll();
            const contentMap = {};
            response.data.forEach(item => {
                contentMap[item.key] = item.value;
            });
            setPageContent(contentMap);
        } catch (error) {
            console.error('Failed to load page content:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('titleEn', formData.titleEn);
            data.append('description', formData.description);
            data.append('descriptionEn', formData.descriptionEn);
            data.append('category', formData.category);
            data.append('image', formData.image);

            await galleryAPI.create(data);

            setFormData({
                title: '',
                titleEn: '',
                description: '',
                descriptionEn: '',
                category: 'construction',
                image: null
            });

            loadImages();
            alert(t('ფოტო წარმატებით აიტვირთა!', 'Photo uploaded successfully!'));
        } catch (error) {
            console.error('Upload failed:', error);
            alert(t('ატვირთვა ვერ მოხერხდა', 'Upload failed'));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('დარწმუნებული ხართ?', 'Are you sure?'))) return;

        try {
            await galleryAPI.delete(id);
            loadImages();
        } catch (error) {
            console.error('Delete failed:', error);
            alert(t('წაშლა ვერ მოხერხდა', 'Delete failed'));
        }
    };

    const handleContentUpdate = async (key, value) => {
        try {
            await contentAPI.createOrUpdate({ key, value });
            loadPageContent();
            alert(t('შესწორება შენახულია!', 'Update saved!'));
        } catch (error) {
            console.error('Failed to update content:', error);
            alert(t('შენახვა ვერ მოხერხდა', 'Update failed'));
        }
    };

    const [editingMember, setEditingMember] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [resetPasswordId, setResetPasswordId] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    const handleUpdateMember = async (e) => {
        e.preventDefault();
        try {
            await parishAPI.updateMember(editingMember._id, editingMember);
            setEditingMember(null);
            loadAllMembers();
            alert(t('წევრი განახლებულია', 'Member updated'));
        } catch (error) {
            console.error('Update error:', error);
            alert(t('განახლება ვერ მოხერხდა', 'Update failed'));
        }
    };

    const handleDeleteMember = async (id) => {
        if (!window.confirm(t('დარწმუნებული ხართ, რომ გსურთ წევრის წაშლა? ეს წაშლის მის ყველა ჯავშანსაც.', 'Are you sure you want to delete this member? This will also delete all their bookings.'))) return;
        try {
            await parishAPI.deleteMember(id);
            loadAllMembers();
            loadAllAppointments();
            alert(t('წევრი წაიშალა', 'Member deleted'));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await parishAPI.resetMemberPassword(resetPasswordId, newPassword);
            setResetPasswordId(null);
            setNewPassword('');
            alert(t('პაროლი შეცვლილია', 'Password updated'));
        } catch (error) {
            alert(error.response?.data?.message || 'Error');
        }
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        try {
            await parishAPI.updateAppointment(editingAppointment._id, editingAppointment);
            setEditingAppointment(null);
            loadAllAppointments();
            alert(t('ჯავშანი განახლებულია', 'Booking updated'));
        } catch (error) {
            console.error('Reschedule error:', error);
        }
    };

    const handleAppointmentStatus = async (id, status) => {
        try {
            await parishAPI.updateAppointmentStatus(id, status);
            loadAllAppointments();
            alert(t('სტატუსი განახლებულია', 'Status updated'));
        } catch (error) {
            console.error('Failed to update appointment status:', error);
            alert(t('განახლება ვერ მოხერხდა', 'Update failed'));
        }
    };

    if (!user) return null;

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <img src="/church-icon.svg" alt="logo" className="sidebar-logo" />
                    <h2>{t('მართვის პანელი', 'Control Panel')}</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <span className="btn-icon">📊</span> {t('დესკტოპი', 'Dashboard')}
                    </button>
                    <button
                        className={`sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        <span className="btn-icon">🖼️</span> {t('გალერეა', 'Gallery')}
                    </button>
                    <button
                        className={`sidebar-btn ${activeTab === 'content' ? 'active' : ''}`}
                        onClick={() => setActiveTab('content')}
                    >
                        <span className="btn-icon">✍️</span> {t('კონტენტი', 'Content')}
                    </button>
                    <button
                        className={`sidebar-btn ${activeTab === 'rector' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rector')}
                    >
                        <span className="btn-icon">⛪</span> {t('წინამძღვარი', 'Rector')}
                    </button>
                    <button
                        className={`sidebar-btn ${activeTab === 'members' ? 'active' : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        <span className="btn-icon">👥</span> {t('მრევლი', 'Parishioners')}
                        {pendingMembers.length > 0 && <span className="pending-badge">{pendingMembers.length}</span>}
                    </button>
                    <button
                        className={`sidebar-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <span className="btn-icon">📅</span> {t('ჯავშნები', 'Bookings')}
                    </button>
                </nav>
                <button className="sidebar-logout" onClick={logout}>
                    <span className="btn-icon">🚪</span> {t('გასვლა', 'Logout')}
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-main-header">
                    <h1>{t('მოგესალმებით,', 'Welcome,')} {user.username}</h1>
                    <div className="header-stats">
                        <div className="stat-pill">
                            <strong>{images.length}</strong> {t('ფოტო', 'Photos')}
                        </div>
                    </div>
                </header>

                <div className="admin-container">
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-view fade-in">
                            <div className="stats-grid">
                                <div className="stat-card-admin">
                                    <h3>{t('გალერეა', 'Gallery')}</h3>
                                    <div className="stat-value">{images.length}</div>
                                    <p>{t('ატვირთული მედია', 'Uploaded Media')}</p>
                                </div>
                                <div className="stat-card-admin">
                                    <h3>{t('კატეგორიები', 'Categories')}</h3>
                                    <div className="stat-value">5</div>
                                    <p>{t('აქტიური სექციები', 'Active Sections')}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="gallery-management fade-in">
                            <div className="upload-section">
                                <h2>{t('ახალი ფოტოს ატვირთვა', 'Upload New Photo')}</h2>
                                <form onSubmit={handleSubmit} className="upload-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder={t('სათაური (ქარ)', 'Title (KA)')}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder={t('სათაური (ENG)', 'Title (EN)')}
                                                value={formData.titleEn}
                                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <select
                                            className="form-select"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="construction">{t('მშენებლობა', 'Construction')}</option>
                                            <option value="ceremony">{t('ცერემონია', 'Ceremony')}</option>
                                            <option value="interior">{t('ინტერიერი', 'Interior')}</option>
                                            <option value="exterior">{t('ექსტერიერი', 'Exterior')}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="file"
                                            className="form-input"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading ? t('ატვირთვა...', 'Uploading...') : t('დამატება', 'Add Photo')}
                                    </button>
                                </form>
                            </div>

                            <div className="admin-gallery-grid">
                                {images.map(item => (
                                    <div key={item._id} className="admin-gallery-item">
                                        <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`} alt={item.title} />
                                        <div className="admin-item-actions">
                                            <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                                                {t('წაშლა', 'Delete')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="content-management fade-in">
                            <h2>{t('გვერდების მართვა', 'Page Content')}</h2>
                            <div className="content-edit-grid">
                                {/* Hero Section */}
                                <div className="content-card">
                                    <h3>{t('მთავარი (Hero)', 'Home Hero')}</h3>
                                    <div className="form-group">
                                        <label>{t('სათაური (ქარ)', 'Title (KA)')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            defaultValue={pageContent['hero_title_ka'] || 'ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძარი'}
                                            onBlur={(e) => handleContentUpdate('hero_title_ka', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('სათაური (ENG)', 'Title (EN)')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            defaultValue={pageContent['hero_title_en'] || 'Church of the Annunciation of the Blessed Virgin Mary'}
                                            onBlur={(e) => handleContentUpdate('hero_title_en', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('ქვესათაური (ქარ)', 'Subtitle (KA)')}</label>
                                        <textarea
                                            className="form-input"
                                            defaultValue={pageContent['hero_subtitle_ka'] || 'მშვიდობის, სულიერებისა და ტრადიციის კერა'}
                                            onBlur={(e) => handleContentUpdate('hero_subtitle_ka', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('ქვესათაური (ENG)', 'Subtitle (EN)')}</label>
                                        <textarea
                                            className="form-input"
                                            defaultValue={pageContent['hero_subtitle_en'] || 'A haven of peace, spirituality, and tradition'}
                                            onBlur={(e) => handleContentUpdate('hero_subtitle_en', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* About Page Sections */}
                                <div className="content-card">
                                    <h3>{t('ჩვენს შესახებ (გვერდი)', 'About Page Sections')}</h3>
                                    <div className="form-group">
                                        <label>{t('ისტორია (ქარ)', 'History (KA)')}</label>
                                        <textarea
                                            className="form-textarea"
                                            defaultValue={pageContent['about_history_ka'] || 'ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის მშენებლობა დაიწყო 2020 წელს...'}
                                            onBlur={(e) => handleContentUpdate('about_history_ka', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('ისტორია (ENG)', 'History (EN)')}</label>
                                        <textarea
                                            className="form-textarea"
                                            defaultValue={pageContent['about_history_en'] || 'The construction of the Annunciation Cathedral began in 2020...'}
                                            onBlur={(e) => handleContentUpdate('about_history_en', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('არქიტექტურა (ქარ)', 'Architecture (KA)')}</label>
                                        <textarea
                                            className="form-textarea"
                                            defaultValue={pageContent['about_architecture_ka'] || 'ტაძარი აშენებულია ტრადიციული ქართული არქიტექტურის სტილში...'}
                                            onBlur={(e) => handleContentUpdate('about_architecture_ka', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('არქიტექტურა (ENG)', 'Architecture (EN)')}</label>
                                        <textarea
                                            className="form-textarea"
                                            defaultValue={pageContent['about_architecture_en'] || 'The church is built in traditional Georgian architectural style...'}
                                            onBlur={(e) => handleContentUpdate('about_architecture_en', e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Mission Section */}
                                <div className="content-card">
                                    <h3>{t('ჩვენი მისია', 'Our Mission')}</h3>
                                    <div className="form-group">
                                        <label>{t('ტექსტი (ქარ)', 'Text (KA)')}</label>
                                        <textarea
                                            className="form-textarea"
                                            defaultValue={pageContent['mission_text_ka'] || 'ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის მშენებლობა არის სულიერი აღორძინების სიმბოლო...'}
                                            onBlur={(e) => handleContentUpdate('mission_text_ka', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('ტექსტი (ENG)', 'Text (EN)')}</label>
                                        <textarea
                                            className="form-textarea"
                                            defaultValue={pageContent['mission_text_en'] || 'The construction of the Annunciation Cathedral is a symbol of spiritual rebirth...'}
                                            onBlur={(e) => handleContentUpdate('mission_text_en', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="content-card">
                                    <h3>{t('მშენებლობის პროგრესი', 'Construction Progress')}</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>{t('პროგრესი (%)', 'Progress (%)')}</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                defaultValue={pageContent['construction_progress'] || 75}
                                                onBlur={(e) => handleContentUpdate('construction_progress', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('წელი', 'Year')}</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                defaultValue={pageContent['completion_year'] || '2024'}
                                                onBlur={(e) => handleContentUpdate('completion_year', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="members-management fade-in">
                            <div className="section-header-admin">
                                <h2>{t('სამრევლო ბაზა', 'Parish Database')}</h2>
                                <div className="pending-count">
                                    {t('მოლოდინშია:', 'Pending Requests:')} <strong>{pendingMembers.length}</strong>
                                </div>
                            </div>

                            {/* Pending Requests Table */}
                            {pendingMembers.length > 0 && (
                                <div className="admin-card mb-2">
                                    <h3>{t('ახალი მოთხოვნები', 'New Requests')}</h3>
                                    <div className="members-table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('სახელი', 'Name')}</th>
                                                    <th>{t('მომხმარებელი', 'Username')}</th>
                                                    <th>{t('ტელეფონი', 'Phone')}</th>
                                                    <th>{t('მოქმედება', 'Actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingMembers.map(member => (
                                                    <tr key={member._id}>
                                                        <td>{member.fullName}</td>
                                                        <td>{member.username}</td>
                                                        <td>{member.phoneNumber}</td>
                                                        <td className="actions-cell">
                                                            <button
                                                                className="btn-approve"
                                                                onClick={() => handleMemberStatus(member._id, 'approved')}
                                                            >
                                                                ✅ {t('დადასტურება', 'Approve')}
                                                            </button>
                                                            <button
                                                                className="btn-reject"
                                                                onClick={() => handleMemberStatus(member._id, 'blocked')}
                                                            >
                                                                🚫 {t('დაბლოკვა', 'Block')}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Full Database Table */}
                            <div className="admin-card">
                                <h3>{t('ყველა წევრი', 'All Members')}</h3>
                                <div className="members-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>{t('სახელი', 'Name')}</th>
                                                <th>{t('ტელეფონი', 'Phone')}</th>
                                                <th>{t('ელ-ფოსტა', 'Email')}</th>
                                                <th>{t('სტატუსი', 'Status')}</th>
                                                <th>{t('მოქმედება', 'Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fade-in">
                                            {allMembers.map(member => (
                                                <tr key={member._id}>
                                                    <td>{member.fullName}</td>
                                                    <td>{member.phoneNumber}</td>
                                                    <td>{member.email}</td>
                                                    <td>
                                                        <span className={`status-pill ${member.status}`} >
                                                            {t(member.status, member.status)}
                                                        </span>
                                                    </td>
                                                    <td className="actions-cell">
                                                        <button
                                                            className="btn-edit sm"
                                                            title={t('რედაქტირება', 'Edit')}
                                                            onClick={() => setEditingMember(member)}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn-password sm"
                                                            title={t('პაროლის შეცვლა', 'Change Password')}
                                                            onClick={() => setResetPasswordId(member._id)}
                                                        >
                                                            🔑
                                                        </button>
                                                        <button
                                                            className="btn-reject sm"
                                                            title={t('წაშლა', 'Delete')}
                                                            onClick={() => handleDeleteMember(member._id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="bookings-management fade-in">
                            <div className="section-header-admin">
                                <h2>{t('ჯავშნების აღრიცხვა', 'Booking Records')}</h2>
                            </div>

                            <div className="admin-card">
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>{t('მომხმარებელი', 'User')}</th>
                                                <th>{t('მსახურება', 'Service')}</th>
                                                <th>{t('თარიღი / დრო', 'Date / Time')}</th>
                                                <th>{t('სტატუსი', 'Status')}</th>
                                                <th>{t('მოქმედება', 'Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fade-in">
                                            {allAppointments.map(app => (
                                                <tr key={app._id}>
                                                    <td>
                                                        <div className="member-cell">
                                                            <strong>{app.member?.fullName}</strong>
                                                            <span>{app.member?.phoneNumber}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {t(
                                                            {
                                                                confession: 'აღსარება',
                                                                baptism: 'ნათლობა',
                                                                wedding: 'ჯვრისწერა',
                                                                burial: 'წესის აგება',
                                                                liturgy: 'წირვა',
                                                                other: 'სხვა'
                                                            }[app.type] || app.type,
                                                            app.type
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="date-cell">
                                                            {new Date(app.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-pill ${app.status}`}>
                                                            {t(
                                                                {
                                                                    pending: 'მოლოდინში',
                                                                    confirmed: 'დადასტურებულია',
                                                                    cancelled: 'გაუქმებულია',
                                                                    completed: 'დასრულებულია'
                                                                }[app.status] || app.status,
                                                                app.status
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="actions-cell">
                                                        <button
                                                            className="btn-edit sm"
                                                            title={t('შეცვლა', 'Reschedule')}
                                                            onClick={() => setEditingAppointment(app)}
                                                        >
                                                            📅
                                                        </button>
                                                        {app.status === 'pending' && (
                                                            <button
                                                                className="btn-approve sm"
                                                                title={t('დადასტურება', 'Confirm')}
                                                                onClick={() => handleAppointmentStatus(app._id, 'confirmed')}
                                                            >
                                                                ✓
                                                            </button>
                                                        )}
                                                        {app.status !== 'cancelled' && (
                                                            <button
                                                                className="btn-reject sm"
                                                                title={t('გაუქმება', 'Cancel')}
                                                                onClick={() => handleAppointmentStatus(app._id, 'cancelled')}
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODALS */}
                    {editingMember && (
                        <div className="modal-overlay">
                            <div className="modal-content animate-in">
                                <h3>{t('წევრის რედაქტირება', 'Edit Member')}</h3>
                                <form onSubmit={handleUpdateMember} className="admin-form">
                                    <div className="form-group">
                                        <label>{t('სახელი', 'Full Name')}</label>
                                        <input
                                            type="text"
                                            value={editingMember.fullName}
                                            onChange={e => setEditingMember({ ...editingMember, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('ტელეფონი', 'Phone')}</label>
                                        <input
                                            type="text"
                                            value={editingMember.phoneNumber}
                                            onChange={e => setEditingMember({ ...editingMember, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('ელ-ფოსტა', 'Email')}</label>
                                        <input
                                            type="email"
                                            value={editingMember.email}
                                            onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('სტატუსი', 'Status')}</label>
                                        <select
                                            value={editingMember.status}
                                            onChange={e => setEditingMember({ ...editingMember, status: e.target.value })}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="blocked">Blocked</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setEditingMember(null)}>
                                            {t('გაუქმება', 'Cancel')}
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            {t('შენახვა', 'Save')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {resetPasswordId && (
                        <div className="modal-overlay">
                            <div className="modal-content animate-in">
                                <h3>{t('პაროლის შეცვლა', 'Change Password')}</h3>
                                <form onSubmit={handleResetPassword} className="admin-form">
                                    <div className="form-group">
                                        <label>{t('ახალი პაროლი', 'New Password')}</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Min 6 characters"
                                            required
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setResetPasswordId(null)}>
                                            {t('გაუქმება', 'Cancel')}
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            {t('განახლება', 'Update')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {editingAppointment && (
                        <div className="modal-overlay">
                            <div className="modal-content animate-in">
                                <h3>{t('ჯავშნის შეცვლა', 'Reschedule Booking')}</h3>
                                <form onSubmit={handleUpdateAppointment} className="admin-form">
                                    <div className="form-group">
                                        <label>{t('თარიღი და დრო', 'Date & Time')}</label>
                                        <input
                                            type="datetime-local"
                                            value={new Date(new Date(editingAppointment.dateTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                            onChange={e => setEditingAppointment({ ...editingAppointment, dateTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('შენიშვნა', 'Notes')}</label>
                                        <textarea
                                            value={editingAppointment.notes || ''}
                                            onChange={e => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setEditingAppointment(null)}>
                                            {t('გაუქმება', 'Cancel')}
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            {t('შენახვა', 'Save')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
