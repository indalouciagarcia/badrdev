import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

function BlogSidebar({ currentPostId = null }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentPosts, setRecentPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  useEffect(() => {
    fetchRecentPosts()
    fetchCategories()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, image_url, created_at, blog_categories(name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4)
      if (error) throw error
      setRecentPosts(data || [])
    } catch (err) {
      console.error('Error fetching recent posts:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id, name, slug')
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoadingSearch(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title')
        .eq('status', 'published')
        .ilike('title', `%${searchQuery.trim()}%`)
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) throw error
      if (data && data.length > 0) {
        navigate(`/blog/${data[0].id}`)
        setSearchQuery('')
      } else {
        alert(`Aucun article trouvé pour "${searchQuery}"`)
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoadingSearch(false)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="tmp-sidebar">

      {/* ── Recherche ── */}
      <div className="signle-side-bar search-area tmponhover">
        <div className="body">
          <form className="search-area" onSubmit={handleSearch} style={{ display: 'flex', gap: 0 }}>
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, fontSize: '15px' }}
            />
            <button type="submit" disabled={loadingSearch} style={{ cursor: 'pointer' }}>
              {loadingSearch
                ? <i className="fa-solid fa-spinner fa-spin"></i>
                : <i className="fa-solid fa-magnifying-glass"></i>
              }
            </button>
          </form>
        </div>
      </div>

      {/* ── Articles récents (dynamiques) ── */}
      <div className="signle-side-bar recent-post-area tmponhover">
        <div className="header">
          <h3 className="title">Articles récents</h3>
        </div>
        <div className="body">
          {recentPosts.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Aucun article publié.</p>
          ) : (
            recentPosts.map((post) => (
              <div
                className="single-post-card tmp-hover-link"
                key={post.id}
                style={{ cursor: 'pointer', marginBottom: '1rem' }}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="single-post-card-img">
                  <img
                    src={post.image_url || '/assets/images/blog/single-post-card-img-1.png'}
                    alt={post.title}
                    style={{ width: '70px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <div className="single-post-right">
                  <div className="single-post-top">
                    <i className="fa-regular fa-calendar"></i>
                    <p className="post-title" style={{ fontSize: '12px', margin: 0 }}>
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                  <h3 className="post-title" style={{ fontSize: '14px', lineHeight: '1.4', margin: '0.25rem 0 0' }}>
                    <span className="link">{post.title}</span>
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Catégories ── */}
      {categories.length > 0 && (
        <div className="signle-side-bar recent-post-area tmponhover">
          <div className="header">
            <h3 className="title">Catégories</h3>
          </div>
          <div className="body">
            {categories.map((cat) => (
              <a
                href={`/blog?category=${cat.slug}`}
                className="single-post"
                key={cat.id}
                style={{ textDecoration: 'none' }}
              >
                <span className="single-post-left">
                  <i className="fa-solid fa-arrow-right"></i>
                  <span className="post-title">{cat.name}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── À propos ── */}
      <div className="signle-side-bar tmponhover">
        <div className="header">
          <h3 className="title">À propos</h3>
        </div>
        <div className="body">
          <div className="about-me-details">
            <div className="about-me-details-head">
              <div className="about-me-img">
                <img src="/assets/images/blog/about-me-user-img.png" alt="Badr Belabbes" />
              </div>
              <div className="about-me-right-content">
                <h3 className="title">Badr Belabbes</h3>
                <p className="para">Développeur Full Stack</p>
                <div className="social-link">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
                  <a href="https://linkedin.com/in/badrbelabbes" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"></i></a>
                  <a href="https://github.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
                </div>
              </div>
            </div>
            <p className="about-me-para">
              Développeur Full Stack passionné avec 13+ ans d'expérience. Je partage mes connaissances sur React, Node.js et le développement web moderne.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default BlogSidebar
