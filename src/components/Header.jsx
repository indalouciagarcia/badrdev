import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const [sticky, setSticky] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 150)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('sidemenu-active', sidebarOpen)
  }, [sidebarOpen])

  const toggleSubmenu = (key) => {
    setOpenSubmenu((prev) => (prev === key ? null : key))
  }

  const isActive = (path) => (location.pathname === path ? 'active' : '')
  const isOpenGroup = (paths) => (paths.includes(location.pathname) ? 'menu-item-open' : '')

  return (
    <>
      {/* tpm-header-area start */}
      <header className={`tmp-header-area-start header-one header--sticky header--transparent${sticky ? ' sticky' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-content">
                <div className="logo">
                  <Link to="/" className="logo-text">Badr Belabbes</Link>
                </div>
                <nav className="tmp-mainmenu-nav d-none d-xl-block">
                  <ul className="tmp-mainmenu">
                    <li>
                      <Link to="/" className={isActive('/')}>Accueil</Link>
                    </li>
                    <li>
                      <Link to="/about" className={isActive('/about')}>À propos</Link>
                    </li>
                    <li className={`has-dropdown ${isOpenGroup(['/services'])}`}>
                      <a href="#">Services
                        <i className="fa-regular fa-chevron-down"></i>
                      </a>
                      <ul className="submenu">
                        <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
                        <li><a href="#">Détail Service</a></li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/blog" className={isActive('/blog')}>Blog</Link>
                    </li>
                    <li>
                      <Link to="/projets" className={isActive('/projets')}>Projets</Link>
                    </li>
                    <li>
                      <Link to="/contact" className={isActive('/contact')}>Contact</Link>
                    </li>
                  </ul>
                </nav>
                <div className="tmp-header-right">
                  <div className="social-share-wrapper d-none d-md-block">
                    <div className="social-link">
                      <a href="#"><i className="fa-brands fa-instagram"></i></a>
                      <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                      <a href="#"><i className="fa-brands fa-twitter"></i></a>
                      <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                    </div>
                  </div>
                  <div className="actions-area">
                    <div className="tmp-side-collups-area d-none d-xl-block">
                      <button className="tmp-menu-bars tmp_button_active" onClick={() => setSidebarOpen(true)}>
                        <i className="fa-regular fa-bars-staggered"></i>
                      </button>
                    </div>
                    <div className="tmp-side-collups-area d-block d-xl-none">
                      <button className="tmp-menu-bars humberger_menu_active" onClick={() => setMobileMenuOpen(true)}>
                        <i className="fa-regular fa-bars-staggered"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* tpm-header-area end */}

      {/* Sidebar offcanvas */}
      <div className="d-none d-xl-block">
        <div className={`tmp-sidebar-area tmp_side_bar${sidebarOpen ? ' tmp_side_bar_open' : ''}`}>
          <div className="inner">
            <div className="top-area">
              <Link to="/" className="logo">
                <img className="logo-dark" src="/assets/images/logo/white-logo-reeni.png" alt="Belabbes Badr - Portfolio" />
                <img className="logo-white" src="/assets/images/logo/logo-white.png" alt="Belabbes Badr - Portfolio" />
              </Link>
              <div className="close-icon-area">
                <button className="tmp-round-action-btn close_side_menu_active" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-sharp fa-light fa-xmark"></i>
                </button>
              </div>
            </div>
            <div className="content-wrapper">
              <div className="image-area-feature">
                <Link to="/">
                  <img src="/assets/images/logo/man.png" alt="personal-logo" />
                </Link>
              </div>
              <h5 className="title mt--30">Developpeur Full stackSenior livrant des solutions web & mobiles modernes et performantes.</h5>
              <p className="disc">Je suis un Développeur Full Stack spécialisé en React.js, Node.js, PHP/Laravel et développement mobile. Je crée des solutions digitales créatives, scalables et centrées sur l'utilisateur.
              </p>
              <div className="short-contact-area">
                <div className="single-contact">
                  <i className="fa-solid fa-phone"></i>
                  <div className="information tmp-link-animation">
                    <span>Appeler maintenant</span>
                    <a href="tel:+212603411160" className="number">+212 603 411 160</a>
                  </div>
                </div>

                <div className="single-contact">
                  <i className="fa-solid fa-envelope"></i>
                  <div className="information tmp-link-animation">
                    <span>Nous écrire</span>
                    <a href="mailto:badr.belabbes.pro@gmail.com" className="number">badr.belabbes.pro@gmail.com</a>
                  </div>
                </div>

                <div className="single-contact">
                  <i className="fa-solid fa-location-crosshairs"></i>
                  <div className="information tmp-link-animation">
                    <span>Mon adresse</span>
                    <span className="number">Rabat, Maroc</span>
                  </div>
                </div>
              </div>
              <div className="social-wrapper mt--20">
                <span className="subtitle">Retrouvez-moi</span>
                <div className="social-link">
                  <a href="#"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="#"><i className="fa-brands fa-twitter"></i></a>
                  <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="overlay_close_side_menu close_side_menu_active" href="#" onClick={(e) => { e.preventDefault(); setSidebarOpen(false) }}></a>
      </div>

      {/* Mobile popup menu */}
      <div className="d-block d-xl-none">
        <div
          className={`tmp-popup-mobile-menu${mobileMenuOpen ? ' active' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false) }}
        >
          <div className="inner">
            <div className="header-top">
              <div className="logo">
                <Link to="/" className="logo-area">
                  <img className="logo-dark" src="/assets/images/logo/white-logo-reeni.png" alt="Belabbes Badr - Portfolio" />
                  <img className="logo-white" src="/assets/images/logo/logo-white.png" alt="Belabbes Badr - Portfolio" />
                </Link>
              </div>
              <div className="close-menu">
                <button className="close-button tmp-round-action-btn" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fa-sharp fa-light fa-xmark"></i>
                </button>
              </div>
            </div>
            <ul className="tmp-mainmenu">
              <li>
                <Link to="/" className={isActive('/')} onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
              </li>
              <li>
                <Link to="/about" className={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>À propos</Link>
              </li>
              <li className={`has-dropdown ${isOpenGroup(['/services'])}`}>
                <a href="#" className={openSubmenu === 'services' ? 'open' : ''} onClick={(e) => { e.preventDefault(); toggleSubmenu('services') }}>
                  Services
                  <i className="fa-regular fa-chevron-down"></i>
                </a>
                <ul className={`submenu${openSubmenu === 'services' ? ' active' : ''}`} style={{ display: openSubmenu === 'services' ? 'block' : 'none' }}>
                  <li><Link to="/services" className={isActive('/services')} onClick={() => setMobileMenuOpen(false)}>Services</Link></li>
                  <li><a href="#">Détail Service</a></li>
                </ul>
              </li>
              <li>
                <Link to="/blog" className={isActive('/blog')} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              </li>
              <li>
                <Link to="/projets" className={isActive('/projets')} onClick={() => setMobileMenuOpen(false)}>Projets</Link>
              </li>
              <li>
                <Link to="/contact" className={isActive('/contact')} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              </li>
            </ul>

            <div className="social-wrapper mt--40">
              <span className="subtitle">Retrouvez-moi</span>
              <div className="social-link">
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
