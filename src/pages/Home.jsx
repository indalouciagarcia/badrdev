import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import Counter from '../components/Counter.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuoteCTA from '../components/QuoteCTA.jsx'

function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  
  // Dynamic states
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [latestBlogPosts, setLatestBlogPosts] = useState([])
  const [skills, setSkills] = useState([])
  const [techLogos, setTechLogos] = useState([])
  const [counters, setCounters] = useState([])
  const [experiences, setExperiences] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [servicesSettings, setServicesSettings] = useState({
    services_subtitle: 'Derniers Services',
    services_title: 'Des Solutions Digitales Sur Mesure',
    services_desc: 'Je conçois et développe des applications web et mobiles innovantes, évolutives et sécurisées pour les entreprises, startups et organisations sportives.',
    services_image: ''
  })

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          profRes,
          projRes,
          blogRes,
          skillRes,
          countRes,
          expRes,
          testRes,
          logosRes,
          settingsRes
        ] = await Promise.all([
          supabase.from('profile').select('*').limit(1).maybeSingle(),
          supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(4),
          supabase.from('blog_posts').select('*, blog_categories(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
          supabase.from('skills').select('*').order('level', { ascending: false }),
          supabase.from('counters').select('*').order('created_at', { ascending: true }),
          supabase.from('experiences').select('*').order('created_at', { ascending: true }),
          supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
          supabase.from('tech_logos').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
          supabase.from('site_settings').select('key, value').in('key', ['services_subtitle', 'services_title', 'services_desc', 'services_image'])
        ])

        if (profRes.data) setProfile(profRes.data)
        if (projRes.data) setProjects(projRes.data)
        if (blogRes.data) setLatestBlogPosts(blogRes.data)
        if (skillRes.data) setSkills(skillRes.data)
        if (countRes.data) setCounters(countRes.data)
        if (expRes.data) setExperiences(expRes.data)
        if (testRes.data) setTestimonials(testRes.data)
        if (logosRes.data && logosRes.data.length > 0) setTechLogos(logosRes.data)
        if (settingsRes.data) {
          const map = {}
          settingsRes.data.forEach(item => { map[item.key] = item.value })
          setServicesSettings(prev => ({ ...prev, ...map }))
        }
      } catch (error) {
        console.error('Error fetching home data:', error)
      }
    }

    fetchHomeData()
  }, [])

  const nextTestimonial = () => setActiveTestimonial((prev) => (prev + 1) % (testimonials.length || 1))
  const prevTestimonial = () => setActiveTestimonial((prev) => (prev - 1 + (testimonials.length || 1)) % (testimonials.length || 1))

  // Filtered arrays
  const frontendSkills = skills.filter(s => s.category === 'Frontend')
  const backendSkills = skills.filter(s => s.category !== 'Frontend') // or explicit Backend/Database
  const serviceCards = experiences.filter(e => e.type === 'service_card')
  const educationCards = experiences.filter(e => e.type === 'education')
  const mySkillItems = experiences.filter(e => e.type === 'expertise')

  return (
    <>
      {/* tmp banner area start */}
      <div className="tmp-banner-one-area">
        <div className="container">
          <div className="banner-one-main-wrapper">
            <div className="row align-items-center">
              <div className="col-lg-6 order-lg-2">
                <div className="banner-right-content">
                  <img className="tmp-scroll-trigger tmp-zoom-in animation-order-1" src={profile?.photo_url || "/assets/images/badr.png"} alt="banner-img" />
                  <h2 className="banner-big-text-1 up-down">{profile?.title?.toUpperCase() || "DÉVELOPPEUR FULL STACK"}</h2>
                  <h2 className="banner-big-text-2 up-down-2">{profile?.title?.toUpperCase() || "DÉVELOPPEUR FULL STACK"}</h2>
                </div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="inner">
                  <span className="sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">Bonjour</span>
                  <h1 className="title tmp-scroll-trigger tmp-fade-in animation-order-2 mt--5">Je suis
                    <br /> {profile?.name || "Badr Belabbes"}, <br />
                    <span className="header-caption">
                      <span className="cd-headline clip is-full-width">
                        <span className="cd-words-wrapper">
                          <b className="is-visible theme-gradient">{profile?.title || "Ingénieur Logiciel."}</b>
                        </span>
                      </span>
                    </span>
                  </h1>
                  <p className="disc tmp-scroll-trigger tmp-fade-in animation-order-3">{profile?.description || "Developpeur Full stackavec 13+ ans d’expérience en développement Full Stack, applications mobiles, plateformes web, conception UI/UX, architecture de bases de données, automatisation de process et développement de produits numériques."}</p>
                  <div className="button-area-banner-one tmp-scroll-trigger tmp-fade-in animation-order-4">
                    <a className="tmp-btn hover-icon-reverse radius-round" href="/projets">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Voir le Portfolio</span>
                        <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                        <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                      </span>
                    </a>
                    {profile?.cv_url && (
                      <a className="tmp-btn btn-transparent hover-icon-reverse radius-round" href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">Télécharger CV</span>
                          <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                          <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tmp banner area end */}

      {/* Tpm Service Area Start */}
      <section className="service-area tmp-section-gap">
        <div className="container">
          <div className="row justify-content-center">
            {serviceCards.map((card, index) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={card.id}>
                <div className={`service-card-v1 tmp-scroll-trigger tmp-fade-in animation-order-${index + 1} tmp-link-animation`}>
                  <div className="service-card-icon">
                    <i className={card.icon || 'fa-light fa-pen-ruler'}></i>
                  </div>
                  <h4 className="service-title"><a href="#">{card.title}</a></h4>
                  <p className="service-para">{card.description || card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Tpm Service Area End */}

      {/* Tpm Counter Area Start */}
      <section className="counter-area">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-6 col-xl-6 col-xxl-6">
              <div className="year-of-expariance-wrapper bg-blur-style-one tmp-scroll-trigger tmp-fade-in animation-order-1">
                <div className="year-expariance-wrap">
                  <h2 className="counter year-number"><Counter count={13} /></h2>
                  <h3 className="year-title">Années <br /> d'expérience</h3>
                </div>
                <p className="year-para">{profile?.description || "Developpeur Full stackSenior passionné, je conçois et développe des applications web et mobiles modernes, performantes et évolutives pour les entreprises et organisations sportives."}</p>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-6 col-xxl-6">
              <div className="counter-area-right-content">
                <div className="row g-5">
                  {counters.map((card, index) => (
                    <div className="col-lg-6 col-sm-6 col-12" key={card.id}>
                      <div className={`counter-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                        <h3 className="counter counter-title"><Counter count={card.count} />+</h3>
                        <p className="counter-para">{card.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tpm Counter Area End */}

      {/* tmp skill area start */}
      <div className="tmp-skill-area tmp-section-gapTop">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="progress-wrapper">
                <div className="content">
                  <h2 className="custom-title mb--30 tmp-scroll-trigger tmp-fade-in animation-order-1">
                    Compétences Frontend <span><img src="/assets/images/custom-line/custom-line.png" alt="custom-line" /></span>
                  </h2>
                  {frontendSkills.map((skill) => (
                    <ProgressBar key={skill.id} name={skill.name} percent={skill.level} duration="0.8s" delay="0.3s" />
                  ))}
                  {frontendSkills.length === 0 && <p style={{ color: '#64748b' }}>Aucune compétence Frontend trouvée.</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="progress-wrapper">
                <div className="content">
                  <h2 className="custom-title mb--30 tmp-scroll-trigger tmp-fade-in animation-order-1">
                    Compétences Backend <span><img src="/assets/images/custom-line/custom-line.png" alt="custom-line" /></span>
                  </h2>
                  {backendSkills.map((skill) => (
                    <ProgressBar key={skill.id} name={skill.name} percent={skill.level} duration="0.8s" delay="0.4s" />
                  ))}
                  {backendSkills.length === 0 && <p style={{ color: '#64748b' }}>Aucune compétence Backend trouvée.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tmp skill area end */}

      {/* Tpm Latest Service Area Start */}
      <section className="latest-service-area tmp-section-gapTop">
        <div className="container">
          <div className="section-head mb--50">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">{servicesSettings.services_subtitle}</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2" dangerouslySetInnerHTML={{ __html: servicesSettings.services_title.replace('\n', '<br/>').replace('\r', '') }} />
            <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">{servicesSettings.services_desc}</p>
          </div>
          <div className="row">
            <div className="col-lg-6">
              {serviceCards.slice(0, 3).map((item, index) => (
                <div className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`} key={item.id}>
                  <h2 className="service-card-num"><span>0{index + 1}.</span>{item.title}</h2>
                  <p className="service-para">{item.subtitle || item.description}</p>
                </div>
              ))}
            </div>
            <div className="col-lg-6">
              <div className="service-card-user-image">
                <img className="tmp-scroll-trigger tmp-zoom-in animation-order-1" src={servicesSettings.services_image || profile?.photo_url || "/assets/images/services/latest-services-user-image-two-white.png"} alt="latest-user-image" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tpm Latest Service Area End */}

      {/* Tpm Education Experience Area Start */}
      <section className="education-experience tmp-section-gapTop">
        <div className="container">
          <div className="section-head mb--50">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Formation & Expérience</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Un Parcours Riche
              <br /> en Expertise
            </h2>
            <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">Plus de 13 ans d’expérience dans la conception et le développement de solutions digitales innovantes pour les entreprises, clubs sportifs et organisations.</p>
          </div>
          <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">Domaines d’Expertise <span><img
            src="/assets/images/custom-line/custom-line.png" alt="custom-line" /></span>
          </h2>
          <div className="row g-5">
            {educationCards.map((card, index) => (
              <div className="col-lg-6 col-sm-6" key={card.id}>
                <div className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                  <h4 className="edu-sub-title">{card.subtitle}</h4>
                  <h2 className="edu-title">{card.title}</h2>
                  <p className="edu-para">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="experiences-wrapper">
            <div className="row">
              <div className="col-lg-6">
                <div className="experiences-wrap-left-content">
                  <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">Expérience Professionnelle <span><img
                    src="/assets/images/custom-line/custom-line.png" alt="custom-line" /></span></h2>

                  <div className="experience-content tmp-scroll-trigger tmp-fade-in animation-order-1">
                    <p className="ex-subtitle">expérience</p>
                    <h2 className="ex-name">Développeur App Web et Mobile</h2>
                    <h3 className="ex-title">Développeur Full Stack & Architecte Logiciel</h3>
                    <p className="ex-para">Conception d’architectures logicielles, développement frontend et backend, architecture de bases de données, développement mobile et intégrations API pour des clients variés.</p>
                  </div>
                  <div className="experience-content tmp-scroll-trigger tmp-fade-in animation-order-2">
                    <p className="ex-subtitle">expérience</p>
                    <h2 className="ex-name">Freelance & Consulting (2012 - Présent)</h2>
                    <h3 className="ex-title">Consultant Technique & Développeur Indépendant</h3>
                    <p className="ex-para">Accompagnement de startups, clubs sportifs et entreprises dans leur transformation digitale — de l’idée au produit fini, en passant par la conception UI/UX et le déploiement.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="experiences-wrap-right-content">
                  <img className="tmp-scroll-trigger tmp-zoom-in animation-order-1" src="/assets/images/badr3.png" alt="expert-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tpm Education Experience Area End */}

      {/* Tpm Our Supported Company Area Start */}
      <div className="our-supported-company-area tmp-section-gapTop">
        <div className="container">
          <div className="row justify-content-center">
            {(techLogos.length > 0
              ? techLogos.filter(l => l.is_active)
              : [1,2,3,4,5,6,7,8].map(n => ({ id: n, name: 'Company', image_url: `/assets/images/our-supported-company/company-logo-${n}.svg` }))
            ).map((logo, idx) => (
              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6" key={logo.id}>
                <div className={`support-company-logo tmp-scroll-trigger tmp-fade-in animation-order-${(idx % 8) + 1}`}>
                  <img src={logo.image_url} alt={logo.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Tpm Our Supported Company Area End */}

      {/* Tpm Latest Portfolio Area Start */}
      <div className="latest-portfolio-area custom-column-grid tmp-section-gapTop">
        <div className="container">
          <div className="section-head mb--60">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Derniers Projets</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Transformer des Idées en
              <br /> Produits Exceptionnels
            </h2>
            <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">Découvrez une sélection de mes projets récents allant des plateformes football aux applications mobiles et systèmes de gestion d’entreprise.</p>
          </div>

          <div className="row">
            {projects.length === 0 ? (
              <div className="col-12 text-center" style={{ color: '#64748b', fontSize: '18px', padding: '2rem 0' }}>
                Aucun projet disponible.
              </div>
            ) : (
              projects.map((project, index) => (
                <div className="col-lg-6 col-sm-6" key={project.id}>
                  <div className={`latest-portfolio-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                    <div className="portfoli-card-img">
                      <div className="img-box v2">
                        <Link className="tmp-scroll-trigger tmp-zoom-in animation-order-1" to={`/projets/${project.id}`}>
                          <img className="w-100" src={project.image_url || '/assets/images/latest-portfolio/portfoli-img-1.jpg'} alt={project.name} style={{ height: '340px', objectFit: 'cover' }} />
                        </Link>
                      </div>
                    </div>
                    <div className="portfolio-card-content-wrap">
                      <div className="content-left">
                        <h3 className="portfolio-card-title">
                          <Link className="link" to={`/projets/${project.id}`}>
                            {project.name}
                          </Link>
                        </h3>
                        <p className="portfoli-card-para">{project.category || 'Développement'}</p>
                      </div>
                      <Link to={`/projets/${project.id}`} className="tmp-arrow-icon-btn">
                        <div className="btn-inner">
                          <i className="tmp-icon fa-solid fa-arrow-up-right"></i>
                          <i className="tmp-icon-bottom fa-solid fa-arrow-up-right"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Tpm Latest Portfolio Area End */}

      {/* Tpm My Skill Area Start */}
      <section className="my-skill tmp-section-gapTop">
        <div className="container">
          <div className="section-head text-align-left mb--50">
            <div className="section-sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Mes Compétences</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Des Expertises Pointues
              <br /> pour Vos Projets</h2>
          </div>
          <div className="services-widget v1">
            {mySkillItems.map((item, index) => (
              <div className={`service-item${index === 0 ? ' current' : ''} tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`} key={item.id}>
                <div className="my-skill-card">
                  <div className="card-icon">
                    <i className={item.icon || 'fa-light fa-code'}></i>
                  </div>
                  <div className="card-title">
                    <h3 className="main-title">{item.title}</h3>
                    <p className="sub-title">{item.subtitle}</p>
                  </div>
                  <p className="card-para">{item.description}</p>
                  <a href="#" className="read-more-btn">En savoir plus <span className="read-more-icon"><i
                    className="fa-solid fa-angle-right"></i></span></a>
                </div>
                <button className="service-link modal-popup"></button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Tpm My Skill Area End */}

      {/* Tpm Testimonial Area Start */}
      {testimonials.length > 0 && (
        <section className="testimonial tmp-section-gapTop">
          <div className="testimonial-wrapper">
            <div className="container">
              <div className="swiper testimonial-swiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide swiper-slide-active">
                    <div className="testimonial-card">
                      <div className="card-content-wrap">
                        <h2 className="text-doc">{testimonials[activeTestimonial]?.text}</h2>
                        <h3 className="card-title">{testimonials[activeTestimonial]?.name}</h3>
                        <p className="card-para">{testimonials[activeTestimonial]?.role}</p>
                        <div className="testimonital-icon">
                          <img src="/assets/images/testimonial/testimonial-icon.svg" alt="testimonial-icon" />
                        </div>
                      </div>
                      <div className="testimonial-card-img">
                        <img className="tmp-scroll-trigger tmp-zoom-in animation-order-1" src={testimonials[activeTestimonial]?.image_url || "/assets/images/testimonial/bg-image-1png.png"} alt="bg-image" style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {testimonials.length > 1 && (
                <div className="testimonial-btn-next-prev">
                  <div className="swiper-button-next" onClick={nextTestimonial}><i className="fa-solid fa-arrow-right"></i></div>
                  <div className="swiper-button-prev" onClick={prevTestimonial}><i className="fa-solid fa-arrow-left"></i></div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {/* Tpm Testimonial Area End */}

      {/* Tpm Get In touch start */}
      <section className="get-in-touch-area tmp-section-gapTop">
        <div className="container">
          <div className="contact-get-in-touch-wrap">
            <div className="get-in-touch-wrapper tmponhover">
              <div className="row g-5 align-items-center">
                <div className="col-lg-5">
                  <div className="section-head text-align-left">
                    <div className="section-sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                      <span className="subtitle">CONTACTEZ-MOI</span>
                    </div>
                    <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Construisons Votre Prochain Produit Digital Ensemble</h2>
                    <p className="description tmp-scroll-trigger tmp-fade-in animation-order-3">Disponible pour des projets freelance, du consulting, des collaborations long terme et des partenariats de développement logiciel. Parlons de votre projet !</p>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="contact-inner" style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>
                    <QuoteCTA />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tpm Get In touch End */}

      {/* Tpm Blog and news Area Start */}
      <section className="blog-and-news-are tmp-section-gap">
        <div className="container">
          <div className="section-head mb--60">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Blog & Actualités</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Insights Techniques &
              <br /> Tendances Digitales</h2>
          </div>
          <div className="row">
            {latestBlogPosts.length === 0 ? (
              <div className="col-12 text-center" style={{ color: '#64748b', fontSize: '18px', padding: '2rem 0' }}>
                Aucun article de blog disponible.
              </div>
            ) : (
              latestBlogPosts.map((post, index) => (
                <div className="col-lg-4 col-md-6 col-sm-6" key={post.id}>
                  <div className={`blog-card tmp-hover-link image-box-hover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                    <div className="img-box">
                      <Link to={`/blog-details/${post.id}`}>
                        <img className="w-100" src={post.image_url || '/assets/images/blog/blog-img-1.jpg'} alt={post.title} style={{ height: '260px', objectFit: 'cover' }} />
                      </Link>
                      <ul className="blog-tags">
                        {post.blog_categories?.name && (
                          <li><span className="tag-icon"><i className="fa-solid fa-tag"></i></span>{post.blog_categories.name}</li>
                        )}
                        <li><span className="tag-icon"><i className="fa-regular fa-user"></i></span>{post.author || 'Badr Belabbes'}</li>
                        <li><span className="tag-icon"><i className="fa-solid fa-calendar-days"></i></span>{new Date(post.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</li>
                      </ul>
                    </div>
                    <div className="blog-content-wrap">
                      <h3 className="blog-title">
                        <Link className="link" to={`/blog-details/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <div className="more-btn tmp-link-animation">
                        <Link to={`/blog-details/${post.id}`} className="read-more-btn">
                          Lire la suite <span className="read-more-icon"><i className="fa-solid fa-angle-right"></i></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {/* Tpm Blog and news Area End */}
    </>
  )
}

export default Home
