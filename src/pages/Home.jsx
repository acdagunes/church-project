import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { galleryAPI } from '../utils/api';
import './Home.css';

const Home = () => {
    const { t } = useLanguage();
    const [recentImages, setRecentImages] = useState([]);

    useEffect(() => {
        loadRecentImages();
    }, []);

    const loadRecentImages = async () => {
        try {
            const response = await galleryAPI.getAll({ limit: 3 });
            setRecentImages(response.data);
        } catch (error) {
            console.error('Failed to load images:', error);
        }
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="hero-title fade-in">
                        {t('წმინდა გიორგის ტაძარი', 'St. George Church')}
                    </h1>
                    <p className="hero-subtitle fade-in">
                        {t(
                            'ღვთის სადიდებლად და ქართული სულიერების განმტკიცებისთვის',
                            'For the glory of God and strengthening Georgian spirituality'
                        )}
                    </p>
                    <div className="hero-buttons fade-in">
                        <Link to="/gallery" className="btn btn-primary">
                            {t('ნახეთ გალერეა', 'View Gallery')}
                        </Link>
                        <Link to="/about" className="btn btn-secondary">
                            {t('გაიგეთ მეტი', 'Learn More')}
                        </Link>
                    </div>
                </div>
                <div className="hero-scroll">
                    <span>↓</span>
                </div>
            </section>

            {/* About Preview */}
            <section className="section">
                <div className="container">
                    <div className="about-preview">
                        <div className="about-image slide-in-left">
                            <div className="image-placeholder">
                                <span className="placeholder-icon">⛪</span>
                            </div>
                        </div>
                        <div className="about-content slide-in-right">
                            <h2 className="section-title">
                                {t('ჩვენი მისია', 'Our Mission')}
                            </h2>
                            <p>
                                {t(
                                    'წმინდა გიორგის ტაძრის მშენებლობა არის ქართული სულიერების და ტრადიციების განახლების სიმბოლო. ჩვენი მიზანია შევქმნათ სულიერი სივრცე, სადაც თაობები შეიკრიბებიან ლოცვისა და ღვთისმსახურებისთვის.',
                                    'The construction of St. George Church is a symbol of renewal of Georgian spirituality and traditions. Our goal is to create a spiritual space where generations will gather for prayer and worship.'
                                )}
                            </p>
                            <Link to="/about" className="btn btn-outline">
                                {t('ვრცლად', 'Read More')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Construction Progress */}
            <section className="section section-dark">
                <div className="container">
                    <h2 className="section-title">{t('მშენებლობის პროგრესი', 'Construction Progress')}</h2>
                    <div className="progress-stats">
                        <div className="stat-card">
                            <div className="stat-number">75%</div>
                            <div className="stat-label">{t('დასრულებული', 'Completed')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">2024</div>
                            <div className="stat-label">{t('დასრულების წელი', 'Completion Year')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">{t('ადამიანი', 'People Capacity')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Gallery */}
            {recentImages.length > 0 && (
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">{t('ბოლო ფოტოები', 'Recent Photos')}</h2>
                        <div className="gallery-preview grid grid-3">
                            {recentImages.map((item, index) => (
                                <div key={item._id} className="gallery-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="gallery-image">
                                        <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} />
                                        <div className="gallery-overlay">
                                            <h3>{item.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-lg">
                            <Link to="/gallery" className="btn btn-primary">
                                {t('ყველა ფოტო', 'All Photos')}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>{t('შეიტანეთ წვლილი', 'Contribute')}</h2>
                        <p>
                            {t(
                                'დაგვეხმარეთ ტაძრის მშენებლობის დასრულებაში',
                                'Help us complete the construction of the church'
                            )}
                        </p>
                        <Link to="/contact" className="btn btn-secondary">
                            {t('დაგვიკავშირდით', 'Contact Us')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
