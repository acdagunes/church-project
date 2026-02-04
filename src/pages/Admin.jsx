import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { galleryAPI } from '../utils/api';
import './Admin.css';

const Admin = () => {
    const { user, logout } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
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
        } else {
            loadImages();
        }
    }, [user, navigate]);

    const loadImages = async () => {
        try {
            const response = await galleryAPI.getAll();
            setImages(response.data);
        } catch (error) {
            console.error('Failed to load images:', error);
        } finally {
            setLoading(false);
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

    if (!user) return null;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="container">
                    <h1>{t('ადმინისტრატორის პანელი', 'Admin Panel')}</h1>
                    <p>{t('მოგესალმებით,', 'Welcome,')} {user.username}!</p>
                </div>
            </div>

            <div className="container">
                <div className="admin-content">
                    <div className="upload-section">
                        <h2>{t('ახალი ფოტოს ატვირთვა', 'Upload New Photo')}</h2>

                        <form onSubmit={handleSubmit} className="upload-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('სათაური (ქართული)', 'Title (Georgian)')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('სათაური (ინგლისური)', 'Title (English)')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('აღწერა (ქართული)', 'Description (Georgian)')}</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('აღწერა (ინგლისური)', 'Description (English)')}</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.descriptionEn}
                                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('კატეგორია', 'Category')}</label>
                                <select
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="construction">{t('მშენებლობა', 'Construction')}</option>
                                    <option value="ceremony">{t('ცერემონია', 'Ceremony')}</option>
                                    <option value="interior">{t('ინტერიერი', 'Interior')}</option>
                                    <option value="exterior">{t('ექსტერიერი', 'Exterior')}</option>
                                    <option value="other">{t('სხვა', 'Other')}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('ფოტო', 'Photo')}</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                {uploading ? t('ატვირთვა...', 'Uploading...') : t('ატვირთვა', 'Upload')}
                            </button>
                        </form>
                    </div>

                    <div className="gallery-management">
                        <h2>{t('გალერეის მართვა', 'Gallery Management')}</h2>

                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <div className="admin-gallery-grid">
                                {images.map(item => (
                                    <div key={item._id} className="admin-gallery-item">
                                        <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} />
                                        <div className="admin-item-info">
                                            <h3>{language === 'ka' ? item.title : item.titleEn}</h3>
                                            <p className="item-category">{item.category}</p>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                {t('წაშლა', 'Delete')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
