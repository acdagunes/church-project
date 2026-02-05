import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { galleryAPI, contentAPI } from '../utils/api';
import mamaoImg from '../assets/mamao.jpeg';
import buildVideo from '../assets/church-build-video.mp4';
import './Home.css';

const Home = () => {
    const { t, language } = useLanguage();
    const [recentImages, setRecentImages] = useState([]);
    const [pageContent, setPageContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [galleryResponse, contentResponse] = await Promise.all([
                galleryAPI.getAll({ limit: 3 }),
                contentAPI.getAll()
            ]);

            setRecentImages(galleryResponse.data);

            const contentMap = {};
            contentResponse.data.forEach(item => {
                contentMap[item.key] = item.value;
            });
            setPageContent(contentMap);
        } catch (error) {
            console.error('Failed to load home data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="hero-title fade-in">
                        {pageContent[`hero_title_${language}`] || t('ყოვლადწმინდა ღმრთისმშობლის ხარების მშენებარე ტაძარი', 'Church of the Annunciation of the Blessed Virgin Mary')}
                    </h1>
                    <p className="hero-subtitle fade-in">
                        {pageContent[`hero_subtitle_${language}`] || t(
                            'მშვიდობის, სულიერებისა და ტრადიციის კერა',
                            'A haven of peace, spirituality, and tradition'
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
                            <img src={mamaoImg} alt="დეკანოზი თომა ცეცხლაძე" className="rector-photo" />
                        </div>
                        <div className="about-content slide-in-right">
                            <h2 className="section-title">
                                {t('ჩვენი მისია', 'Our Mission')}
                            </h2>
                            <div className="decorative-divider"></div>
                            <div className="rector-info">
                                <span className="rector-name">{t('დეკანოზი თომა ცეცხლაძე', 'Archpriest Thoma Tsetskhladze')}</span>
                                <span className="rector-role">{t('წინამძღვარი', 'Rector')}</span>
                            </div>
                            <p>
                                {pageContent[`mission_text_${language}`] || t(
                                    'ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის მშენებლობა არის სულიერი აღორძინების სიმბოლო. წინამძღვრის, დეკანოზ თომა ცეცხლაძის ლოცვა-კურთხევით, ჩვენი მიზანია შევქმნათ წმინდა სივრცე, სადაც მორწმუნეთა გულები ერთიანდება ლოცვასა და მადლიერებაში.',
                                    'The construction of the Annunciation Cathedral is a symbol of spiritual rebirth. Under the blessing of our rector, Archpriest Thoma Tsetskhladze, our goal is to create a sacred space where the hearts of believers unite in prayer and gratitude.'
                                )}
                            </p>
                            <Link to="/about" className="btn btn-outline">
                                {t('ვრცლად', 'Read More')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Foundation Video Section */}
            <section className="foundation-video">
                <video autoPlay loop muted playsInline className="video-background">
                    <source src={buildVideo} type="video/mp4" />
                </video>
                <div className="video-overlay"></div>
                <div className="container foundation-content">
                    <div className="content-box fade-in">
                        <h2 className="section-title light">{t('ჩვენი დასაწყისი', 'Our Beginning')}</h2>
                        <p className="foundation-text">
                            {t(
                                'მშენებლობის პირველი დღეები — საძირკვლის ჩაყრა და მომავლის იმედი. აქ დაიწყო ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის ისტორია.',
                                'The first days of construction — laying the foundation and hope for the future. This is where the history of the Annunciation Cathedral began.'
                            )}
                        </p>
                    </div>
                </div>
            </section>


            {/* Construction Progress */}
            <section className="section section-dark">
                <div className="container">
                    <h2 className="section-title">{t('მშენებლობის პროგრესი', 'Construction Progress')}</h2>
                    <div className="progress-stats">
                        <div className="stat-card">
                            <div className="stat-number">{pageContent['construction_progress'] || 75}%</div>
                            <div className="stat-label">{t('დასრულებული', 'Completed')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{pageContent['completion_year'] || '2024'}</div>
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
                                        <img src={`${import.meta.env.VITE_API_URL || ''}${item.imageUrl}`} alt={item.title} />
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
