import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">
                            {t('წმინდა გიორგის ტაძარი', 'St. George Church')}
                        </h3>
                        <p className="footer-text">
                            {t(
                                'ღვთის სადიდებლად და ქართული სულიერების განმტკიცებისთვის',
                                'For the glory of God and strengthening Georgian spirituality'
                            )}
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-subtitle">{t('კონტაქტი', 'Contact')}</h4>
                        <p className="footer-text">
                            📧 info@stgeorgechurch.ge<br />
                            📱 +995 555 123 456<br />
                            📍 {t('თბილისი, საქართველო', 'Tbilisi, Georgia')}
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-subtitle">{t('სამუშაო საათები', 'Working Hours')}</h4>
                        <p className="footer-text">
                            {t('ორშაბათი - კვირა', 'Monday - Sunday')}<br />
                            09:00 - 18:00
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} {t('წმინდა გიორგის ტაძარი. ყველა უფლება დაცულია.', 'St. George Church. All rights reserved.')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
