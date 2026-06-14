import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Counter from '../components/Counter.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuoteCTA from '../components/QuoteCTA.jsx'

function About() {
  // Dynamic states
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [counters, setCounters] = useState([])
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [
          profRes,
          skillRes,
          countRes,
          expRes
        ] = await Promise.all([
          supabase.from('profile').select('*').limit(1).maybeSingle(),
          supabase.from('skills').select('*').order('level', { ascending: false }),
          supabase.from('counters').select('*').order('created_at', { ascending: true }),
          supabase.from('experiences').select('*').order('created_at', { ascending: true })
        ])

        if (profRes.data) setProfile(profRes.data)
        if (skillRes.data) setSkills(skillRes.data)
        if (countRes.data) setCounters(countRes.data)
        if (expRes.data) setExperiences(expRes.data)
      } catch (error) {
        console.error('Error fetching about data:', error)
      }
    }

    fetchAboutData()
  }, [])

  // Filtered arrays
  const frontendSkills = skills.filter(s => s.category === 'Frontend')
  const backendSkills = skills.filter(s => s.category !== 'Frontend')
  const serviceCards = experiences.filter(e => e.type === 'service_card')
  const educationCards = experiences.filter(e => e.type === 'education')

  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="À Propos de Moi" />
      {/* Breadcrumb Area End */}

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

      {/* tmp skill area start */}
      <div className="tmp-skill-area tmp-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="inner">
              <div className="row">
                <div className="col-lg-6">
                  <div className="progress-wrapper">
                    <div className="content">
                      <h2 className="custom-title mb--30 tmp-scroll-trigger tmp-fade-in animation-order-1">
                        Compétences Frontend <span><img src="/assets/images/custom-line/custom-line.png" alt="custom-line" /></span>
                      </h2>
                      {frontendSkills.map((skill) => (
                        <ProgressBar key={skill.id} name={skill.name} percent={skill.level} duration="0.8s" delay="0.3s" />
                      ))}
                      {frontendSkills.length === 0 && <p style={{ color: '#64748b' }}>Aucune compétence Frontend.</p>}
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
                      {backendSkills.length === 0 && <p style={{ color: '#64748b' }}>Aucune compétence Backend.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tmp skill area end */}

      {/* Tpm Counter Area Start */}
      <section className="counter-area tmp-section-gapBottom">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-6 col-xl-6 col-xxl-6">
              <div className="year-of-expariance-wrapper bg-blur-style-one tmp-scroll-trigger tmp-fade-in animation-order-1">
                <div className="year-expariance-wrap">
                  <h2 className="counter year-number"><Counter count={13} />
                  </h2>
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
                        <h3 className="counter counter-title"><Counter count={card.count} />+
                        </h3>
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

      {/* Tpm Education Experience Area Start */}
      <section className="education-experience tmp-section-gapBottom">
        <div className="container">
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
                  <img className="tmp-scroll-trigger tmp-zoom-in animation-order-1" src={profile?.photo_url || "/assets/images/badr1.png"} alt="expert-img" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tpm Education Experience Area End */}

      {/* Tpm Get In touch start */}
      <section className="get-in-touch-area tmp-section-gapBottom">
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
    </>
  )
}

export default About
