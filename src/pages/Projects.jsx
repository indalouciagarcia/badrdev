import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import Breadcrumb from '../components/Breadcrumb.jsx'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title="Projets" />
      {/* Breadcrumb Area End */}

      {/* Tpm Latest Portfolio Area Start */}
      <div className="latest-portfolio-area custom-column-grid tmp-section-gap">
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlignment: 'center', color: '#64748b', fontSize: '18px', padding: '3rem 0' }}>
              Aucun projet à afficher pour le moment.
            </div>
          ) : (
            <div className="row">
              {projects.map((project, index) => (
                <div className="col-lg-6 col-sm-6" key={project.id}>
                  <div className={`latest-portfolio-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                    <div className="portfoli-card-img">
                      <div className="img-box v2">
                        <Link className="tmp-scroll-trigger tmp-zoom-in animation-order-1" to={`/projets/${project.id}`}>
                          <img className="w-100" src={project.image_url || '/assets/images/latest-portfolio/portfoli-img-1.jpg'} alt={project.name} style={{ height: '340px', objectFit: 'cover' }} />
                        </Link>
                      </div>
                    </div>
                    <div className="portfolio-card-content-wrap">
                      <div className="content-left">
                        <h3 className="portfolio-card-title">
                          <Link className="link" to={`/projets/${project.id}`}>
                            {project.name}
                          </Link>
                        </h3>
                        <p className="portfoli-card-para">{project.category || 'Développement'}</p>
                      </div>
                      <Link to={`/projets/${project.id}`} className="tmp-arrow-icon-btn">
                        <div className="btn-inner">
                          <i className="tmp-icon fa-solid fa-arrow-up-right"></i>
                          <i className="tmp-icon-bottom fa-solid fa-arrow-up-right"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Tpm Latest Portfolio Area End */}
    </>
  )
}

export default Projects
