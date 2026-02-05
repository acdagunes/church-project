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
                            {t('ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძარი', 'Annunciation Cathedral')}
                        </h3>
                        <p className="footer-text">
                            {t(
                                'მშვიდობისა და სულიერების კერა',
                                'A haven of peace and spirituality'
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
                    <p>© {currentYear} {t('ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძარი. ყველა უფლება დაცულია.', 'Annunciation Cathedral. All rights reserved.')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
