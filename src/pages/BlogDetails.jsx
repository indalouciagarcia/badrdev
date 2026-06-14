import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import Breadcrumb from '../components/Breadcrumb.jsx'
import BlogSidebar from '../components/BlogSidebar.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* ── Slider des 3 articles récents ── */
function RecentPostsSlider({ currentId }) {
  const [posts, setPosts] = useState([])
  const [active, setActive] = useState(0)
  const intervalRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSliderPosts()
  }, [currentId])

  const fetchSliderPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, image_url, excerpt, created_at, blog_categories(name)')
        .eq('status', 'published')
        .neq('id', currentId || '')
        .order('created_at', { ascending: false })
        .limit(3)
      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (posts.length < 2) return
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % posts.length)
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [posts])

  const goTo = (idx) => {
    setActive(idx)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % posts.length)
    }, 4000)
  }

  const prev = () => goTo((active - 1 + posts.length) % posts.length)
  const next = () => goTo((active + 1) % posts.length)

  if (posts.length === 0) return null

  const post = posts[active]
  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      marginBottom: '3rem',
      height: '380px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    }}>
      {/* Image de fond */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${post.image_url || '/assets/images/blog/details/01.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'all 0.6s ease',
      }} />

      {/* Overlay dégradé */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
      }} />

      {/* Badges "AUTRES ARTICLES" */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 2 }}>
        <span style={{
          background: '#FF014F', color: 'white', padding: '0.4rem 1rem',
          borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Articles récents
        </span>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 2, display: 'flex', gap: '0.5rem' }}>
        {posts.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === active ? '24px' : '8px', height: '8px',
            borderRadius: '50px', border: 'none', cursor: 'pointer',
            background: i === active ? '#FF014F' : 'rgba(255,255,255,0.5)',
            transition: 'all 0.3s ease', padding: 0,
          }} />
        ))}
      </div>

      {/* Contenu */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '2rem 2rem 2rem',
        zIndex: 2,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
          <i className="fa-regular fa-calendar" style={{ marginRight: '0.4rem' }}></i>
          {formatDate(post.created_at)}
          {post.blog_categories?.name && (
            <span style={{ marginLeft: '1rem' }}>
              <i className="fa-solid fa-tag" style={{ marginRight: '0.4rem' }}></i>
              {post.blog_categories.name}
            </span>
          )}
        </p>
        <h2 style={{
          color: 'white', fontSize: '1.75rem', fontWeight: '800',
          margin: '0 0 1rem', lineHeight: '1.3',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', margin: '0 0 1rem', lineHeight: '1.5' }}>
            {post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt}
          </p>
        )}
        <button
          onClick={() => navigate(`/blog/${post.id}`)}
          style={{
            background: '#FF014F', color: 'white', border: 'none',
            borderRadius: '50px', padding: '0.6rem 1.5rem',
            fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#cc003d'}
          onMouseOut={e => e.currentTarget.style.background = '#FF014F'}
        >
          Lire l'article →
        </button>
      </div>

      {/* Flèches nav */}
      {posts.length > 1 && (
        <>
          <button onClick={prev} style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            zIndex: 2, background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,1,79,0.7)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <button onClick={next} style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            zIndex: 2, background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,1,79,0.7)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <ChevronRight size={20} color="white" />
          </button>
        </>
      )}
    </div>
  )
}

/* ── Page principale BlogDetails ── */
function BlogDetails() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    fetchPostAndComments()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const fetchPostAndComments = async () => {
    setLoading(true)
    try {
      const [postRes, commentsRes] = await Promise.all([
        supabase.from('blog_posts').select('*, blog_categories(name)').eq('id', id).single(),
        supabase.from('blog_comments').select('*').eq('post_id', id).order('created_at', { ascending: false })
      ])
      if (postRes.error) throw postRes.error
      setPost(postRes.data)
      setComments(commentsRes.data || [])
    } catch (error) {
      console.error('Error fetching blog details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommentsOnly = async () => {
    try {
      const { data } = await supabase
        .from('blog_comments').select('*').eq('post_id', id)
        .order('created_at', { ascending: false })
      setComments(data || [])
    } catch (err) { console.error(err) }
  }

  const handleCommentChange = (e) =>
    setCommentForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    setSubmittingComment(true)
    try {
      const { error } = await supabase.from('blog_comments').insert([{
        post_id: id, name: commentForm.name,
        email: commentForm.email, message: commentForm.message
      }])
      if (error) throw error
      setCommentForm({ name: '', email: '', message: '' })
      await fetchCommentsOnly()
      alert('Votre commentaire a été publié avec succès !')
    } catch (error) {
      alert('Erreur : ' + error.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <>
        <Breadcrumb title="Chargement..." />
        <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#FF014F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Chargement de l'article...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Breadcrumb title="Article introuvable" />
        <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h2>Article introuvable</h2>
          <p style={{ color: '#64748b' }}>L'article demandé n'existe pas ou a été supprimé.</p>
          <Link to="/blog" className="tmp-btn hover-icon-reverse radius-round" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
            <span className="icon-reverse-wrapper"><span className="btn-text">Retour au blog</span></span>
          </Link>
        </div>
      </>
    )
  }

  const keywordsList = post.keywords
    ? post.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : []

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <Breadcrumb title={post.title} />

      <div className="blog-classic-area-wrapper tmp-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">

              {/* ── Slider Articles Récents ── */}
              <RecentPostsSlider currentId={id} />

              <div className="blog-details-left-area">
                {/* Image principale */}
                <div className="thumbnail-top" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem' }}>
                  <img
                    src={post.image_url || '/assets/images/blog/details/01.png'}
                    alt={post.title}
                    className="w-100"
                    style={{ maxHeight: '450px', objectFit: 'cover' }}
                  />
                </div>

                <div className="blog-details-discription">
                  <div className="blog-classic-tag">
                    <h4 className="title">Par {post.author || 'Badr Belabbes'}</h4>
                    <ul>
                      <li>
                        <div className="tag-wrap">
                          <i className="fa-solid fa-tag"></i>
                          <h4 className="tag-title">{post.blog_categories?.name || 'Non classé'}</h4>
                        </div>
                      </li>
                      <li>
                        <div className="tag-wrap">
                          <i className="fa-solid fa-calendar-day"></i>
                          <h4 className="tag-title">{formatDate(post.created_at)}</h4>
                        </div>
                      </li>
                      <li>
                        <div className="tag-wrap">
                          <i className="fa-solid fa-comment"></i>
                          <h4 className="tag-title">{comments.length} commentaire{comments.length !== 1 ? 's' : ''}</h4>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <h3 className="title split-collab" style={{ fontSize: '32px', fontWeight: '800', margin: '1rem 0' }}>
                    {post.title}
                  </h3>

                  <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#475569', whiteSpace: 'pre-line' }}>
                    {post.content}
                  </div>
                </div>

                {/* Mots-clés & Socials */}
                <div className="blog-details-navigation" style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  {keywordsList.length > 0 && (
                    <div className="navigation-tags">
                      <h3 className="tag-title">Mots-clés :</h3>
                      <ul>
                        {keywordsList.map((tag, idx) => (
                          <li key={idx}>
                            <p className="tag">
                              <span style={{ background: '#fff0f3', color: '#FF014F', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '14px', fontWeight: '600', border: '1px solid #ffd0dc' }}>
                                {tag}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="social-link footer">
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                  </div>
                </div>

                {/* Commentaires */}
                <div className="comment-area-main-wrapper mt--30" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
                  <h3 className="title" style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1.5rem' }}>
                    Commentaires ({comments.length})
                  </h3>
                  {comments.length === 0 ? (
                    <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '18px', marginBottom: '2rem' }}>
                      Soyez le premier à laisser un commentaire !
                    </p>
                  ) : (
                    comments.map((comment, index) => (
                      <div className="single-comment-audience" key={comment.id}
                        style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '1rem' }}>
                        <div className="author-image">
                          <img src={`/assets/images/blog/comments-img-${(index % 2) + 1}.png`} alt="Avatar"
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                        <div className="right-area-commnet" style={{ flex: 1 }}>
                          <div className="top-area-comment" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div className="left">
                              <h6 className="title" style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>{comment.name}</h6>
                              <span style={{ fontSize: '13px', color: '#64748b' }}>
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                          </div>
                          <p className="disc" style={{ margin: 0, fontSize: '16px', color: '#475569', lineHeight: '1.6' }}>
                            {comment.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Formulaire commentaire */}
                <div className="blog-details-form-wrapper tmponhover"
                  style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '20px', border: '1px solid #f1f5f9', marginTop: '2.5rem' }}>
                  <h4 className="title" style={{ fontSize: '22px', fontWeight: '700', marginBottom: '0.25rem' }}>
                    Laisser un commentaire
                  </h4>
                  <span className="subtitle" style={{ color: '#64748b', fontSize: '14px', display: 'block', marginBottom: '1.5rem' }}>
                    Votre adresse e-mail ne sera pas publiée.
                  </span>
                  <form className="blog-details-form" onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '15px', fontWeight: '600' }}>Votre Nom</label>
                        <input type="text" name="name" placeholder="Nom complet" value={commentForm.name} onChange={handleCommentChange} required
                          style={{ padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', background: 'white', fontSize: '16px' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '15px', fontWeight: '600' }}>Votre Email</label>
                        <input type="email" name="email" placeholder="Adresse email" value={commentForm.email} onChange={handleCommentChange} required
                          style={{ padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', background: 'white', fontSize: '16px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '15px', fontWeight: '600' }}>Message</label>
                      <textarea name="message" placeholder="Votre commentaire ici..." value={commentForm.message} onChange={handleCommentChange} required
                        style={{ padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', background: 'white', fontSize: '16px', minHeight: '120px' }}>
                      </textarea>
                    </div>
                    <div className="blog-submit-btn mt--20">
                      <div className="tmp-button-here">
                        <button className="tmp-btn hover-icon-reverse radius-round w-100" type="submit" disabled={submittingComment}
                          style={{ border: 'none', cursor: 'pointer' }}>
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">{submittingComment ? 'Publication...' : 'Publier le commentaire'}</span>
                            <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            </div>

            <div className="col-lg-4">
              <BlogSidebar currentPostId={id} />
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

export default BlogDetails
