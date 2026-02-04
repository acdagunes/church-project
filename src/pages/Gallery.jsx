import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { galleryAPI } from '../utils/api';
import './Gallery.css';

const Gallery = () => {
    const { t, language } = useLanguage();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: t('ყველა', 'All') },
        { value: 'construction', label: t('მშენებლობა', 'Construction') },
        { value: 'ceremony', label: t('ცერემონია', 'Ceremony') },
        { value: 'interior', label: t('ინტერიერი', 'Interior') },
        { value: 'exterior', label: t('ექსტერიერი', 'Exterior') }
    ];

    useEffect(() => {
        loadGallery();
    }, [selectedCategory]);

    const loadGallery = async () => {
        try {
            setLoading(true);
            const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
            const response = await galleryAPI.getAll(params);
            setImages(response.data);
        } catch (error) {
            console.error('Failed to load gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-page">
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title fade-in">{t('გალერეა', 'Gallery')}</h1>
                    <p className="page-subtitle fade-in">
                        {t('მშენებლობის პროცესის ფოტოები', 'Construction process photos')}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="gallery-filters">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : images.length > 0 ? (
                        <div className="gallery-grid grid grid-3">
                            {images.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="gallery-item fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="gallery-item-image">
                                        <img
                                            src={`http://localhost:5000${item.imageUrl}`}
                                            alt={language === 'ka' ? item.title : item.titleEn}
                                        />
                                        <div className="gallery-item-overlay">
                                            <h3>{language === 'ka' ? item.title : item.titleEn}</h3>
                                            {(item.description || item.descriptionEn) && (
                                                <p>{language === 'ka' ? item.description : item.descriptionEn}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>{t('ფოტოები არ მოიძებნა', 'No photos found')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Gallery;
