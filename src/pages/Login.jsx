import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginMember } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // First try admin login
            const adminResult = await login(credentials.username, credentials.password);

            if (adminResult.success) {
                navigate('/admin');
                return;
            }

            // If not admin, try member login
            const memberResult = await loginMember(credentials.username, credentials.password);

            if (memberResult.success) {
                navigate('/parish');
            } else {
                setError(memberResult.message === 'Invalid credentials'
                    ? t('არასწორი მონაცემები', 'Invalid credentials')
                    : memberResult.message);
            }
        } catch (err) {
            setError(t('შესვლა ვერ მოხერხდა', 'Login failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">{t('შესვლა', 'Login')}</h1>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">{t('მომხმარებელი', 'Username')}</label>
                            <input
                                type="text"
                                className="form-input"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('პაროლი', 'Password')}</label>
                            <input
                                type="password"
                                className="form-input"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? t('შესვლა...', 'Logging in...') : t('შესვლა', 'Login')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
