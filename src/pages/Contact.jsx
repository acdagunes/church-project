import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, this would send to backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="contact-page">
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title fade-in">{t('კონტაქტი', 'Contact')}</h1>
                    <p className="page-subtitle fade-in">
                        {t('დაგვიკავშირდით ნებისმიერი კითხვისთვის', 'Contact us for any questions')}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info slide-in-left">
                            <h2>{t('საკონტაქტო ინფორმაცია', 'Contact Information')}</h2>

                            <div className="info-item">
                                <div className="info-icon">📧</div>
                                <div>
                                    <h3>{t('ელ. ფოსტა', 'Email')}</h3>
                                    <p>info@stgeorgechurch.ge</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📱</div>
                                <div>
                                    <h3>{t('ტელეფონი', 'Phone')}</h3>
                                    <p>+995 555 123 456</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div>
                                    <h3>{t('მისამართი', 'Address')}</h3>
                                    <p>{t('თბილისი, საქართველო', 'Tbilisi, Georgia')}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">🕐</div>
                                <div>
                                    <h3>{t('სამუშაო საათები', 'Working Hours')}</h3>
                                    <p>{t('ორშაბათი - კვირა', 'Monday - Sunday')}<br />09:00 - 18:00</p>
                                </div>
                            </div>

                            <div className="bank-info">
                                <h3>{t('საბანკო რეკვიზიტები', 'Bank Details')}</h3>
                                <p>
                                    {t('ბანკი:', 'Bank:')} TBC Bank<br />
                                    {t('ანგარიში:', 'Account:')} GE00TB0000000000000000<br />
                                    {t('დანიშნულება:', 'Purpose:')} {t('შემოწირულობა ტაძრის მშენებლობისთვის', 'Donation for church construction')}
                                </p>
                            </div>
                        </div>

                        <div className="contact-form-container slide-in-right">
                            <h2>{t('გაგზავნეთ შეტყობინება', 'Send Message')}</h2>

                            {submitted ? (
                                <div className="success-message">
                                    <div className="success-icon">✓</div>
                                    <p>{t('შეტყობინება წარმატებით გაიგზავნა!', 'Message sent successfully!')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-group">
                                        <label className="form-label">{t('სახელი', 'Name')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('ელ. ფოსტა', 'Email')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('შეტყობინება', 'Message')}</label>
                                        <textarea
                                            name="message"
                                            className="form-textarea"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        {t('გაგზავნა', 'Send')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
