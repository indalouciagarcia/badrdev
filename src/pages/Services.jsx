import { useState } from 'react'
import Breadcrumb from '../components/Breadcrumb.jsx'
import services from '../data/services.js'
import './Services.css'

function Services() {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })

  const handleContactChange = (e) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactForm({ name: '', phone: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="Services" />
      {/* Breadcrumb Area End */}

      {/* Latest Service Area Start */}
      <section className="latest-service-area tmp-section-gap">
        <div className="container">
          <div className="section-head mb--50">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Mes Services</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Des Solutions Complètes
              <br /> Pour Vos Projets
            </h2>
            <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">De la conception à la mise en production, j'accompagne entreprises, startups et organisations sportives dans la réalisation de leurs projets digitaux.</p>
          </div>
          <div className="row">
            <div className="col-lg-6 col-sm-6">
              {services.slice(0, 3).map((service, index) => (
                <a href="#" className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`} key={service.num}>
                  <h2 className="service-card-num"><span>{service.num}</span>{service.title}</h2>
                  <p className="service-para">{service.para}</p>
                </a>
              ))}
            </div>
            <div className="col-lg-6 col-sm-6">
              {services.slice(3, 6).map((service, index) => (
                <a href="#" className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 4}`} key={service.num}>
                  <h2 className="service-card-num"><span>{service.num}</span>{service.title}</h2>
                  <p className="service-para">{service.para}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Latest Service Area End */}

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
                  <div className="contact-inner">
                    <div className="contact-form">
                      <div id="form-messages" className="error"></div>
                      <form className="tmp-dynamic-form" id="contact-form" onSubmit={handleContactSubmit}>
                        <div className="contact-form-wrapper row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input className="input-field" name="name" id="contact-name" placeholder="Votre Nom" type="text" value={contactForm.name} onChange={handleContactChange} required />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <input className="input-field" name="phone" id="contact-phone" placeholder="Numéro de Téléphone" type="tel" value={contactForm.phone} onChange={handleContactChange} required />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <input className="input-field" id="contact-email" name="email" placeholder="Votre Email" type="email" value={contactForm.email} onChange={handleContactChange} required />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <input className="input-field" type="text" id="subject" name="subject" placeholder="Sujet" value={contactForm.subject} onChange={handleContactChange} />
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="form-group">
                              <textarea className="input-field" placeholder="Votre Message" name="message" id="contact-message" value={contactForm.message} onChange={handleContactChange} required></textarea>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="tmp-button-here">
                              <button className="tmp-btn hover-icon-reverse radius-round w-100" name="submit" type="submit" id="submit">
                                <span className="icon-reverse-wrapper">
                                  <span className="btn-text">Envoyer le Message</span>
                                  <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                                  <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
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

export default Services
