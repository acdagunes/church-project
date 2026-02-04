import { useLanguage } from '../contexts/LanguageContext';
import './About.css';

const About = () => {
    const { t } = useLanguage();

    return (
        <div className="about-page">
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title fade-in">{t('ჩვენ შესახებ', 'About Us')}</h1>
                    <p className="page-subtitle fade-in">
                        {t('წმინდა გიორგის ტაძრის ისტორია და მისია', 'History and mission of St. George Church')}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="about-content-grid">
                        <div className="content-block slide-in-left">
                            <h2>{t('ჩვენი ისტორია', 'Our History')}</h2>
                            <p>
                                {t(
                                    'წმინდა გიორგის ტაძრის მშენებლობა დაიწყო 2020 წელს, როდესაც ადგილობრივმა თემმა გადაწყვიტა შექმნას სულიერი სივრცე მომავალი თაობებისთვის. პროექტი წარმოადგენს ქართული არქიტექტურის ტრადიციების შერწყმას თანამედროვე მშენებლობის ტექნოლოგიებთან.',
                                    'The construction of St. George Church began in 2020 when the local community decided to create a spiritual space for future generations. The project represents a fusion of Georgian architectural traditions with modern construction technologies.'
                                )}
                            </p>
                        </div>

                        <div className="content-block slide-in-right">
                            <h2>{t('ჩვენი მისია', 'Our Mission')}</h2>
                            <p>
                                {t(
                                    'ჩვენი მისიაა შევქმნათ სულიერი სახლი, სადაც ყველა მორწმუნე შეძლებს ღვთისმსახურებას, ლოცვას და სულიერ განახლებას. ტაძარი იქნება ქართული ტრადიციების, კულტურისა და რწმენის ცოცხალი სიმბოლო.',
                                    'Our mission is to create a spiritual home where all believers can worship, pray, and find spiritual renewal. The church will be a living symbol of Georgian traditions, culture, and faith.'
                                )}
                            </p>
                        </div>

                        <div className="content-block slide-in-left">
                            <h2>{t('არქიტექტურა', 'Architecture')}</h2>
                            <p>
                                {t(
                                    'ტაძარი აშენებულია ტრადიციული ქართული არქიტექტურის სტილში, თანამედროვე ელემენტების ჩართვით. შენობა შეიცავს ცენტრალურ გუმბათს, სამ აფსიდს და მაღალ სამრეკლოს. მშენებლობაში გამოყენებულია ადგილობრივი ქვა და თანამედროვე მასალები.',
                                    'The church is built in traditional Georgian architectural style with modern elements. The building features a central dome, three apses, and a tall bell tower. Local stone and modern materials are used in construction.'
                                )}
                            </p>
                        </div>

                        <div className="content-block slide-in-right">
                            <h2>{t('თემი', 'Community')}</h2>
                            <p>
                                {t(
                                    'პროექტი ხორციელდება ადგილობრივი თემის აქტიური მონაწილეობით. ასობით ადამიანი შეიტანს წვლილს როგორც ფინანსურად, ისე ფიზიკური შრომით. ეს არის ჩვენი საერთო მომავლის შექმნის პროცესი.',
                                    'The project is being implemented with active community participation. Hundreds of people contribute both financially and through physical labor. This is a process of creating our common future.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

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
                            <p>75%</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
