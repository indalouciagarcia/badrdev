import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import BlogSidebar from '../components/BlogSidebar.jsx'

const blogCards = [
  {
    img: '/assets/images/blog/blog-classic-card-img-1.jpg',
    title: 'Stand out from the crowd with a professional portfolio',
    para: 'Aliquam eros justo, posuere loborti viverra lao ullamcorper posuere viverra .Aliquam eros justo, posuere Aliquam eros justo, posuere loborti viverra laoreet matti ullamcorper',
  },
  {
    img: '/assets/images/blog/blog-classic-card-img-2.jpg',
    title: 'Elevate your brand with a the stunning portfolio',
    para: 'Aliquam eros justo, posuere loborti viverra lao ullamcorper posuere viverra .Aliquam eros justo, posuere Aliquam eros justo, posuere loborti viverra laoreet matti ullamcorper',
  },
  {
    img: '/assets/images/blog/blog-classic-card-img-3.jpg',
    title: 'Elevate your brand with a the stunning portfolio',
    para: 'Aliquam eros justo, posuere loborti viverra lao ullamcorper posuere viverra .Aliquam eros justo, posuere Aliquam eros justo, posuere loborti viverra laoreet matti ullamcorper',
  },
]

function BlogClassic() {
  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="Blog Classic" />
      {/* Breadcrumb Area End */}

      <div className="blog-classic-area-wrapper tmp-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {blogCards.map((card, index) => (
                <div className={`blog-classic-card tmp-scroll-trigger tmponhover tmp-fade-in animation-order-${index + 1}`} key={card.title + index}>
                  <div className="img-box">
                    <Link to="/blog-details">
                      <img className="img-primary hidden-on-mobile" src={card.img} alt="Blog Thumbnail" />
                      <img className="img-secondary" src={card.img} alt="BLog Thumbnail" />
                    </Link>
                  </div>
                  <div className="blog-classic-content">
                    <div className="blog-classic-tag">
                      <ul>
                        <li>
                          <div className="tag-wrap">
                            <i className="fa-solid fa-tag"></i>
                            <h4 className="tag-title">Web design</h4>
                          </div>
                        </li>
                        <li>
                          <div className="tag-wrap">
                            <i className="fa-regular fa-comment"></i>
                            <h4 className="tag-title">Comments (05)</h4>
                          </div>
                        </li>
                        <li>
                          <div className="tag-wrap">
                            <i className="fa-solid fa-calendar-day"></i>
                            <h4 className="tag-title">Comments (05)</h4>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <h2 className="title"><Link to="/blog-details">{card.title}</Link>
                    </h2>
                    <p className="para">{card.para}</p>

                    <div className="tmp-button-here">
                      <Link className="tmp-btn hover-icon-reverse radius-round btn-border btn-md" to="/blog-details">
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">Read More</span>
                          <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                          <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              <div className="tmp-pagination-button">
                <a href="#" className="pagination-btn active">1</a>
                <a href="#" className="pagination-btn">2</a>
                <a href="#" className="pagination-btn">3</a>
              </div>
            </div>
            <div className="col-lg-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogClassic
