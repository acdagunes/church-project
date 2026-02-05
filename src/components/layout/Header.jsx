import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <img src="/church-icon.svg" alt="logo" className="logo-icon-svg" />
                        <span className="logo-text">{t('ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძარი', 'Annunciation Cathedral')}</span>
                    </Link>

                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        <Link
                            to="/"
                            className={`nav-link ${isActive('/') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('მთავარი', 'Home')}
                        </Link>
                        <Link
                            to="/about"
                            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('ჩვენ შესახებ', 'About')}
                        </Link>
                        <Link
                            to="/gallery"
                            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('გალერეა', 'Gallery')}
                        </Link>
                        <Link
                            to="/contact"
                            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('კონტაქტი', 'Contact')}
                        </Link>
                        <Link
                            to="/parish"
                            className={`nav-link parish-link-btn ${isActive('/parish') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('სამრევლო', 'Parish')}
                        </Link>
                    </nav>

                    <div className="header-actions">
                        <button className="lang-toggle" onClick={toggleLanguage}>
                            {language === 'ka' ? 'EN' : 'ქარ'}
                        </button>
                        {user && (
                            <button className="btn-logout" onClick={logout}>
                                {t('გასვლა', 'Logout')} <span className="btn-icon">🚪</span>
                            </button>
                        )}
                        <button
                            className="menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
