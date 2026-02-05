import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { parishAPI } from '../utils/api';
import './Register.css';

const Register = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await parishAPI.register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="register-page">
                <div className="register-card success-card fade-in">
                    <div className="success-icon">✨</div>
                    <h2>{t('რეგისტრაცია წარმატებულია!', 'Registration Successful!')}</h2>
                    <p>
                        {t(
                            'თქვენი მოთხოვნა გაგზავნილია. ადმინისტრაციის მიერ ვერიფიკაციის შემდეგ შეძლებთ სამრევლო სივრცეში შესვლას.',
                            'Your request has been sent. You will be able to access the Parish Space once the administration verifies your account.'
                        )}
                    </p>
                    <Link to="/" className="btn btn-primary">{t('მთავარზე დაბრუნება', 'Back to Home')}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="register-card fade-in">
                <div className="register-header">
                    <div className="church-seal">⛪</div>
                    <h1>{t('სამრევლო რეგისტრაცია', 'Parish Registration')}</h1>
                    <p>{t('შემოუერთდით ჩვენს ციფრულ სამწყსოს', 'Join our digital flock')}</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>{t('სრული სახელი', 'Full Name')}</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder={t('სახელი და გვარი', 'Full Name')}
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('მომხმარებელი', 'Username')}</label>
                            <input
                                type="text"
                                name="username"
                                placeholder={t('მომხმარებელი', 'Username')}
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('ტელეფონი', 'Phone')}</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+995..."
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('ელ-ფოსტა', 'Email')}</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('პაროლი', 'Password')}</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? t('მუშავდება...', 'Processing...') : t('რეგისტრაცია', 'Register')}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        {t('უკვე გაქვთ ანგარიში?', 'Already have an account?')}
                        <Link to="/login">{t('შესვლა', 'Login')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
