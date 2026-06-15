import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../config/supabase'

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [logoSettings, setLogoSettings] = useState({
    footer_logo: '',
    header_logo_text: 'Badr Belabbes'
  })

  useEffect(() => {
    fetchLogoSettings()
  }, [])

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['footer_logo', 'header_logo_text'])
      if (error) throw error
      if (data) {
        const map = {}
        data.forEach(item => { map[item.key] = item.value })
        setLogoSettings(prev => ({ ...prev, ...map }))
      }
    } catch (err) {
      console.error('Error fetching logo settings in footer:', err)
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    setNewsletterEmail('')
  }

  return (
    <>
      {/* Start Footer Area  */}
      <footer className="footer-area footer-style-one-wrapper bg-color-footer bg_images tmp-section-gap">
        <div className="container">
          <div className="footer-main footer-style-one">
            <div className="row g-5">
              <div className="col-lg-5 col-md-6">
                <div className="single-footer-wrapper border-right mr--20">
                  <div className="logo">
                    <Link to="/">
                      {logoSettings.footer_logo ? (
                        <img src={logoSettings.footer_logo} alt={logoSettings.header_logo_text} style={{ maxHeight: '45px', objectFit: 'contain' }} />
                      ) : (
                        <span className="logo-text" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                          {logoSettings.header_logo_text}
                        </span>
                      )}
                    </Link>
                  </div>
                  <p className="description"><span>Construisons</span> Ensemble le Digital</p>
                  <form className="newsletter-form-1 mt--40" onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      placeholder="Votre Email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <span className="form-icon"><i className="fa-regular fa-envelope"></i></span>
                  </form>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-footer-wrapper quick-link-wrap">
                  <h5 className="ft-title">Liens Rapides</h5>
                  <ul className="ft-link tmp-link-animation">
                    <li>
                      <Link to="/about">À propos</Link>
                    </li>
                    <li>
                      <Link to="/services">Services</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contactez-moi</Link>
                    </li>
                    <li>
                      <Link to="/blog">Articles de Blog</Link>
                    </li>
                    <li>
                      <a href="#">Projets</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-wrapper contact-wrap">
                  <h5 className="ft-title">Contact</h5>
                  <ul className="ft-link tmp-link-animation">
                    <li><span className="ft-icon"><i className="fa-solid fa-envelope"></i></span><a href="mailto:badr.belabbes.pro@gmail.com">badr.belabbes.pro@gmail.com</a></li>
                    <li><span className="ft-icon"><i className="fa-solid fa-location-dot"></i></span>Rabat, Maroc</li>
                    <li><span className="ft-icon"><i className="fa-solid fa-phone"></i></span><a href="tel:+212603411160">+212 603 411 160</a></li>
                  </ul>
                  <div className="social-link footer">
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright-area-one">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-wrapper">
                <p className="copy-right-para tmp-link-animation"> © Belabbes Badr {new Date().getFullYear()} | Tous droits réservés
                </p>
                <ul className="tmp-link-animation">
                  <li><a href="#">Conditions d'utilisation</a></li>
                  <li><a href="#">Politique de confidentialité</a></li>
                  <li><Link to="/contact">Contactez-nous</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Footer Area  */}
    </>
  )
}

export default Footer
