import Breadcrumb from '../components/Breadcrumb.jsx'
import QuoteCTA from '../components/QuoteCTA.jsx'

function Contact() {
  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="Contact" />
      {/* Breadcrumb Area End */}

      <div className="contact-area-wrapper tmp-section-gap">
        <div className="container">
          <div className="contact-info-wrap">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="contact-info tmp-scroll-trigger tmponhover tmp-fade-in animation-order-1">
                  <div className="contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <h3 className="title">Address</h3>
                  <p className="para">Dhaka 102, utl 1216, road 45</p>
                  <p className="para">house of street</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="contact-info tmp-scroll-trigger tmponhover tmp-fade-in animation-order-2">
                  <div className="contact-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <h3 className="title">E-mail</h3>
                  <a href="mailto:themespark11@gmail.com">
                    <p className="para">hasan@yourmail.com</p>
                  </a>
                  <a href="mailto:themespark11@gmail.com">
                    <p className="para">themespark11@gmail.com</p>
                  </a>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="contact-info tmp-scroll-trigger tmponhover tmp-fade-in animation-order-3">
                  <div className="contact-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <h3 className="title">Call Me</h3>
                  <p className="para">0000 - 000 - 000 00</p>
                  <p className="para">+1234 - 000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tpm Get In touch start */}
        <section className="get-in-touch-area tmp-section-gapTop">
          <div className="container">
            <div className="contact-get-in-touch-wrap">
              <div className="get-in-touch-wrapper tmponhover">
                <div className="row g-5 align-items-center">
                  <div className="col-lg-5">
                    <div className="section-head text-align-left">
                      <div className="section-sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                        <span className="subtitle">GET IN TOUCH</span>
                      </div>
                      <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">Elevate your brand with Me </h2>
                      <p className="description tmp-scroll-trigger tmp-fade-in animation-order-3">ished fact that a reader will be
                        distrol acted bioiiy desig
                        ished fact that a reader will acted ished fact that a reader will be distrol
                        acted </p>
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
      </div>
    </>
  )
}

export default Contact
