import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import Breadcrumb from '../components/Breadcrumb.jsx'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Get list of categories dynamically from projects
  const categoriesList = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]

  const filteredProjects = activeTab === 'All'
    ? projects
    : projects.filter(p => p.category === activeTab)

  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="Projets" />
      {/* Breadcrumb Area End */}

      {/* Tpm Latest Portfolio Area Start */}
      <section className="latest-portfolio-area custom-column-grid tmp-section-gap">
        <div className="container">
          <div className="section-head mb--60">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Portfolio</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
              Transformer vos Idées en Produits Digitaux Exceptionnels
            </h2>
            <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
              Découvrez mes derniers projets de développement web, d'applications mobiles et de conception d'interfaces UI/UX.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#FF014F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '18px', padding: '3rem 0' }}>
              Aucun projet à afficher pour le moment.
            </div>
          ) : (
            <div className="latest-portfolio-tabs-area">
              <nav style={{ marginBottom: '3rem' }}>
                <ul className="nav nav-tabs" id="nav-tab" role="tablist" style={{ justifyContent: 'center', border: 'none', gap: '0.5rem' }}>
                  {categoriesList.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`nav-link ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                        type="button"
                        style={{
                          background: activeTab === cat ? '#FF014F' : 'transparent',
                          color: activeTab === cat ? 'white' : '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: '50px',
                          padding: '0.6rem 1.5rem',
                          fontWeight: '600',
                          fontSize: '15px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        {cat === 'All' ? 'Tous' : cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="tab-content bg-blur-style-one">
                <div className="row g-5">
                  {filteredProjects.map((project) => (
                    <div className="col-lg-6 col-md-6" key={project.id}>
                      <div className="latest-portfolio-card-style-two image-box-hover tmp-scroll-trigger tmp-fade-in" style={{ background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="portfoli-card-img">
                          <div className="img-box v2">
                            <Link className="tmp-scroll-trigger tmp-zoom-in" to={`/projets/${project.id}`}>
                              <img
                                className="w-100"
                                src={project.image_url || '/assets/images/latest-portfolio/portfoli-img-1.jpg'}
                                alt={project.name}
                                style={{ height: '340px', objectFit: 'cover' }}
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="portfolio-card-content-wrap" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', gap: '1.5rem' }}>
                          <div className="content-left">
                            <h3 className="portfolio-card-title" style={{ margin: '0 0 0.75rem 0', fontSize: '24px', fontWeight: '800' }}>
                              <Link to={`/projets/${project.id}`} style={{ color: '#1e293b', textDecoration: 'none' }}>
                                {project.name}
                              </Link>
                            </h3>
                            <div className="tag-items">
                              <ul style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap' }}>
                                {project.tags ? (
                                  project.tags.split(',').map((tag, i) => (
                                    <li key={i}>
                                      <span className="tag-item" style={{
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '50px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        border: '1px solid #e2e8f0',
                                        display: 'inline-block'
                                      }}>
                                        {tag.trim()}
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <li>
                                    <span className="tag-item" style={{
                                      background: '#f1f5f9',
                                      color: '#475569',
                                      padding: '0.25rem 0.75rem',
                                      borderRadius: '50px',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      border: '1px solid #e2e8f0',
                                      display: 'inline-block'
                                    }}>
                                      {project.category || 'Général'}
                                    </span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div style={{ marginTop: 'auto' }}>
                            <Link className="tmp-btn hover-icon-reverse radius-round btn-border btn-md" to={`/projets/${project.id}`} style={{ width: 'fit-content' }}>
                              <span className="icon-reverse-wrapper">
                                <span className="btn-text">Voir le projet</span>
                                <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                                <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .latest-portfolio-tabs-area .nav-tabs .nav-link:hover {
          border-color: #FF014F !important;
          color: #FF014F !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

export default Projects
