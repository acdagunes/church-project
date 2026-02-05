import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { contentAPI } from '../utils/api';
import aboutImg from '../assets/about-background.jpeg';
import toma1 from '../assets/toma-1.jpeg';
import toma2 from '../assets/toma-2.jpeg';
import './About.css';

const About = () => {
    const { t, language } = useLanguage();
    const [pageContent, setPageContent] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPageContent();
    }, []);

    const loadPageContent = async () => {
        try {
            const response = await contentAPI.getAll();
            const contentMap = {};
            response.data.forEach(item => {
                contentMap[item.key] = item.value;
            });
            setPageContent(contentMap);
        } catch (error) {
            console.error('Failed to load about content:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="about-page">
            <section className="about-hero">
                <img src={aboutImg} alt="წინამძღვარი და მრევლი" className="about-hero-image" />
                <div className="about-hero-overlay"></div>
                <div className="container about-hero-content">
                    <h1 className="page-title fade-in">{t('ჩვენ შესახებ', 'About Us')}</h1>
                    <p className="page-subtitle fade-in">
                        {pageContent[`hero_subtitle_${language}`] || t('ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის ისტორია და მისია', 'History and mission of the Annunciation Cathedral')}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="about-content-grid">
                        <div className="content-block slide-in-left">
                            <h2>{t('ჩვენი ისტორია', 'Our History')}</h2>
                            <p>
                                {pageContent[`about_history_${language}`] || t(
                                    'ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის მშენებლობა დაიწყო 2020 წელს, როდესაც ადგილობრივმა თემმა გადაწყვიტა შექმნას სულიერი სივრცე მომავალი თაობებისთვის. პროექტი წარმოადგენს ქართული არქიტექტურის ტრადიციების შერწყმას თანამედროვე მშენებლობის ტექნოლოგიებთან.',
                                    'The construction of the Annunciation Cathedral began in 2020 when the local community decided to create a spiritual space for future generations. The project represents a fusion of Georgian architectural traditions with modern construction technologies.'
                                )}
                            </p>
                        </div>

                        <div className="content-block slide-in-right">
                            <h2>{t('ჩვენი მისია', 'Our Mission')}</h2>
                            <p>
                                {pageContent[`mission_text_${language}`] || t(
                                    'ჩვენი მისიაა შევქმნათ სულიერი სახლი, სადაც ყველა მორწმუნე შეძლებს ღვთისმსახურებას, ლოცვას და სულიერ განახლებას. ტაძარი იქნება ქართული ტრადიციების, კულტურისა და რწმენის ცოცხალი სიმბოლო.',
                                    'Our mission is to create a spiritual home where all believers can worship, pray, and find spiritual renewal. The church will be a living symbol of Georgian traditions, culture, and faith.'
                                )}
                            </p>
                        </div>

                        <div className="content-block slide-in-left">
                            <h2>{t('არქიტექტურა', 'Architecture')}</h2>
                            <p>
                                {pageContent[`about_architecture_${language}`] || t(
                                    'ტაძარი აშენებულია ტრადიციული ქართული არქიტექტურის სტილში, თანამედროვე ელემენტების ჩართვით. შენობა შეიცავს ცენტრალურ გუმბათს, სამ აფსიდს და მაღალ სამრეკლოს. მშენებლობაში გამოყენებულია ადგილობრივი ქვა და თანამედროვე მასალები.',
                                    'The church is built in traditional Georgian architectural style with modern elements. The building features a central dome, three apses, and a tall bell tower. Local stone and modern materials are used in construction.'
                                )}
                            </p>
                        </div>

                        <div className="content-block slide-in-right">
                            <h2>{t('მრევლი', 'Parish')}</h2>
                            <p>
                                {pageContent[`about_parish_${language}`] || t(
                                    'პროექტი ხორციელდება მრევლისა და სასულიერო სამწყსოს აქტიური მონაწილეობით. ასობით ადამიანი შეიტანს წვლილს როგორც ფინანსურად, ისე ფიზიკური შრომით. ეს არის ჩვენი საერთო მომავლის შექმნის პროცესი.',
                                    'The project is being implemented with active participation of the parish and spiritual flock. Hundreds of people contribute both financially and through physical labor. This is a process of creating our common future.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rector Biography Section */}
            <section className="rector-bio-section section section-light">
                <div className="container">
                    <h2 className="section-title">{t('ტაძრის წინამძღვარი', 'Church Rector')}</h2>
                    <div className="rector-bio-grid">
                        <div className="rector-bio-images slide-in-left">
                            <div className="rector-photo-frame secondary-photo" style={{ cursor: 'pointer' }} onClick={() => setSelectedImage(toma2)}>
                                <img src={toma2} alt="დეკანოზი თომა ცეცხლაძე - მსახურება" />
                            </div>
                            <div className="rector-photo-frame main-photo" style={{ cursor: 'pointer' }} onClick={() => setSelectedImage(toma1)}>
                                <img src={toma1} alt="დეკანოზი თომა ცეცხლაძე" />
                            </div>
                        </div>
                        <div className="rector-bio-content slide-in-right">
                            <h3 className="rector-bio-name">{t('დეკანოზი თომა ცეცხლაძე', 'Archpriest Thoma Tsetskhladze')}</h3>
                            <div className="bio-details">
                                <p>
                                    {t(
                                        'დეკანოზი თომა ცეცხლაძე (ერისკაცობაში თამაზ ცეცხლაძე) არის თბილისის სასულიერო სემინარიის კურსდამთავრებული. მისი სასულიერო მოღვაწეობა მჭიდროდ არის დაკავშირებული ქართულ მართლმადიდებელ ეკლესიასთან და მრევლის სულიერ წინამძღოლობასთან.',
                                        'Archpriest Thoma Tsetskhladze (born Tamaz Tsetskhladze) is a graduate of the Tbilisi Theological Seminary. His spiritual ministry is closely linked to the Georgian Orthodox Church and the spiritual guidance of the parish.'
                                    )}
                                </p>
                                <ul className="bio-timeline">
                                    <li>
                                        <strong>2010 {t('წელი', 'Year')}</strong> - {t('8 აგვისტოს, თიანეთის ყოვლადწმინდა ღვთისმშობლის საკათედრო ტაძარში, თიანეთისა და ფშავ-ხევსურეთის მიტროპოლიტმა თადეოზმა დიაკვნად აკურთხა.', 'On August 8, 2010, in the Tianeti Cathedral of the Blessed Virgin Mary, Metropolitan Thaddeus of Tianeti and Pshav-Khevsureti ordained him as a deacon.')}
                                    </li>
                                    <li>
                                        <strong>2012 {t('წელი', 'Year')}</strong> - {t('25 მარტს, ბოლნისის ყოვლადწმინდა ღვთისმშობლის მიძინების საკათედრო ტაძარში, ბოლნელმა ეპისკოპოსმა ეფრემმა მღვდლად დაასხა ხელი.', 'On March 25, 2012, in the Bolnisi Cathedral of the Dormition of the Blessed Virgin Mary, Bishop Ephrem of Bolnisi ordained him as a priest.')}
                                    </li>
                                    <li>
                                        {t('წლების განმავლობაში მსახურობდა თბილისში, ვაზისუბნის ცხრა ძმა კოლაელ ყრმათა სახელობის ეკლესიაში.', 'For years, he served in Tbilisi, at the Church of the Nine Brothers of Kola in Vazisubani.')}
                                    </li>
                                </ul>
                                <p>
                                    {t(
                                        'დღეს დეკანოზი თომა წინამძღვრობს ყოვლადწმინდა ღმრთისმშობლის ხარების ტაძრის მშენებლობას და სულიერად ხელმძღვანელობს მის სამწყსოს.',
                                        'Today, Archpriest Thoma leads the construction of the Annunciation Cathedral and spiritually guides his flock.'
                                    )}
                                </p>
                                <div className="bio-actions">
                                    <a
                                        href="https://www.youtube.com/watch?v=-9Cb0n8NIKk"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        <span className="btn-icon">▶</span> {t('ნახეთ ვიდეო', 'Watch Video')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="lightbox-overlay fade-in" onClick={() => setSelectedImage(null)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
                        <img src={selectedImage} alt="Enlarged" className="lightbox-img" />
                    </div>
                </div>
            )}

            <section className="section section-dark">
                <div className="container">
                    <h2 className="section-title">{t('ძირითადი ფაქტები', 'Key Facts')}</h2>
                    <div className="facts-grid grid grid-4">
                        <div className="fact-card">
                            <div className="fact-icon">📅</div>
                            <h3>{t('დაწყება', 'Started')}</h3>
                            <p>2020</p>
                        </div>
                        <div className="fact-card">
                            <div className="fact-icon">📐</div>
                            <h3>{t('ფართობი', 'Area')}</h3>
                            <p>850 {t('კვ.მ', 'sq.m')}</p>
                        </div>
                        <div className="fact-card">
                            <div className="fact-icon">👥</div>
                            <h3>{t('ტევადობა', 'Capacity')}</h3>
                            <p>500+</p>
                        </div>
                        <div className="fact-card">
                            <div className="fact-icon">🏗️</div>
                            <h3>{t('პროგრესი', 'Progress')}</h3>
                            <p>{pageContent['construction_progress'] || 75}%</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
