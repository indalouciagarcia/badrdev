import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import Breadcrumb from '../components/Breadcrumb.jsx'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="Blog" />
      {/* Breadcrumb Area End */}

      <div className="blog-classic-area-wrapper tmp-section-gap">
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlignment: 'center', color: '#64748b', fontSize: '18px', padding: '3rem 0' }}>
              Aucun article publié pour le moment.
            </div>
          ) : (
            <div className="row">
              {posts.map((post, index) => (
                <div className="col-lg-4 col-md-6 col-sm-6" key={post.id}>
                  <div className={`blog-card tmp-hover-link image-box-hover tmp-scroll-trigger tmp-fade-in animation-order-${(index % 3) + 1}`}>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Blog
