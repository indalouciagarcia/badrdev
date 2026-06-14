import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Breadcrumb from '../components/Breadcrumb.jsx';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (e) => {
    setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          name: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject || `Demande relative au projet : ${project?.name}`,
          message: `Téléphone: ${contactForm.phone}\n\nMessage:\n${contactForm.message}`,
          is_read: false
        }]);

      if (error) throw error;
      alert('Message envoyé avec succès ! Il a été reçu dans votre espace d\'administration.');
      setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message : ' + error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Chargement..." />
        <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Chargement des détails du projet...</p>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Breadcrumb title="Projet introuvable" />
        <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h2>Projet introuvable</h2>
          <p style={{ color: '#64748b' }}>Le projet demandé n'existe pas ou a été supprimé.</p>
          <Link to="/projets" className="tmp-btn hover-icon-reverse radius-round" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
            <span className="icon-reverse-wrapper">
              <span className="btn-text">Retour aux projets</span>
            </span>
          </Link>
        </div>
      </>
    );
  }

  // Parse checklist/features
  const featuresList = project.features 
    ? project.features.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  // Parse gallery/swiper images
  const galleryList = project.gallery_images
    ? project.gallery_images.split(',').map(img => img.trim()).filter(Boolean)
    : [];

  return (
    <>
      {/* Breadcrumb Area Start */}
      <Breadcrumb title={project.name} />
      {/* Breadcrumb Area End */}

      <div className="project-details-area-wrapper tmp-section-gap">
        <div className="container">
          <div className="row">
            {/* Thumbnail */}
            <div className="col-lg-12">
              <div className="project-details-thumnail-wrap" style={{ marginBottom: '2.5rem', borderRadius: '20px', overflow: 'hidden' }}>
                <img 
                  src={project.image_url || '/assets/images/projects-details/thumnail-img.png'} 
                  alt={project.name} 
                  className="w-100" 
                  style={{ maxHeight: '550px', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Left Content Area */}
            <div className="col-lg-8">
              <div className="project-details-content-wrap">
                <h2 className="title" style={{ fontSize: '36px', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>
                  {project.name}
                </h2>
                
                {/* Main Description */}
                <p className="docs" style={{ fontSize: '18px', lineHeight: '1.8', color: '#475569', marginBottom: '1.5rem' }}>
                  {project.description || 'Aucune description fournie.'}
                </p>

                {/* Checklist features */}
                {featuresList.length > 0 && (
                  <div className="check-box-wrap" style={{ margin: '2rem 0' }}>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {featuresList.map((feature, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-circle-check" style={{ fontSize: '20px' }}></i>
                          </span>
                          <h4 className="check-box-item" style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                            {feature}
                          </h4>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section title & sub-description */}
                {project.mini_title && (
                  <>
                    <h2 className="mini-title" style={{ fontSize: '28px', fontWeight: '700', marginTop: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>
                      {project.mini_title}
                    </h2>
                    {project.sub_description && (
                      <p className="docs" style={{ fontSize: '18px', lineHeight: '1.8', color: '#475569', marginBottom: '2.5rem' }}>
                        {project.sub_description}
                      </p>
                    )}
                  </>
                )}

                {/* Swiper Gallery Rendered as a Premium Grid of Details */}
                {galleryList.length > 0 && (
                  <div className="gallery-section" style={{ margin: '2.5rem 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {galleryList.map((imgUrl, idx) => (
                        <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                          <img 
                            src={imgUrl} 
                            alt={`Gallery view ${idx + 1}`} 
                            style={{ width: '100%', height: '260px', objectFit: 'cover' }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Get In Touch contact form */}
              <section className="get-in-touch-area pt--80" style={{ borderTop: '1px solid #e2e8f0', marginTop: '3rem' }}>
                <div className="container p-0">
                  <div className="contact-get-in-touch-wrap">
                    <div className="get-in-touch-wrapper tmponhover" style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <div className="row g-5 align-items-center">
                        <div className="col-lg-12">
                          <div className="contact-inner">
                            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                              Prendre Rendez-vous / Demander un Devis
                            </h3>
                            <div className="contact-form">
                              <form onSubmit={handleContactSubmit}>
                                <div className="contact-form-wrapper row g-3">
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <input 
                                        className="input-field" 
                                        name="name" 
                                        placeholder="Votre Nom" 
                                        type="text" 
                                        value={contactForm.name}
                                        onChange={handleContactChange}
                                        required 
                                        style={{ background: 'white', padding: '1rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '10px', width: '100%', fontSize: '16px' }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <input 
                                        className="input-field" 
                                        name="phone" 
                                        placeholder="Numéro de Téléphone" 
                                        type="tel" 
                                        value={contactForm.phone}
                                        onChange={handleContactChange}
                                        required 
                                        style={{ background: 'white', padding: '1rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '10px', width: '100%', fontSize: '16px' }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <input 
                                        className="input-field" 
                                        name="email" 
                                        placeholder="Votre Email" 
                                        type="email" 
                                        value={contactForm.email}
                                        onChange={handleContactChange}
                                        required 
                                        style={{ background: 'white', padding: '1rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '10px', width: '100%', fontSize: '16px' }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <input 
                                        className="input-field" 
                                        name="subject" 
                                        placeholder="Sujet" 
                                        type="text" 
                                        value={contactForm.subject}
                                        onChange={handleContactChange}
                                        style={{ background: 'white', padding: '1rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '10px', width: '100%', fontSize: '16px' }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-lg-12">
                                    <div className="form-group">
                                      <textarea 
                                        className="input-field" 
                                        name="message" 
                                        placeholder="Votre Message" 
                                        value={contactForm.message}
                                        onChange={handleContactChange}
                                        required
                                        style={{ background: 'white', padding: '1rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '10px', width: '100%', minHeight: '120px', fontSize: '16px' }}
                                      ></textarea>
                                    </div>
                                  </div>

                                  <div className="col-lg-12">
                                    <div className="tmp-button-here">
                                      <button 
                                        type="submit" 
                                        className="tmp-btn hover-icon-reverse radius-round w-100" 
                                        disabled={sending}
                                        style={{ border: 'none', cursor: 'pointer' }}
                                      >
                                        <span className="icon-reverse-wrapper">
                                          <span className="btn-text">
                                            {sending ? 'Envoi en cours...' : 'Envoyer la demande'}
                                          </span>
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
            </div>

            {/* Right Sidebar Area */}
            <div className="col-lg-4">
              <div 
                className="signle-side-bar project-details-area tmponhover" 
                style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '20px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  position: 'sticky',
                  top: '100px'
                }}
              >
                <div className="header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <h3 className="title" style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#0f172a' }}>
                    Infos Projet
                  </h3>
                </div>
                <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="project-details-info" style={{ fontSize: '16px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    Auteur: <strong style={{ color: '#0f172a' }}>{project.client || 'Badr Belabbes'}</strong>
                  </div>
                  <div className="project-details-info" style={{ fontSize: '16px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    Date: <strong style={{ color: '#0f172a' }}>{project.project_date || 'En cours'}</strong>
                  </div>
                  <div className="project-details-info" style={{ fontSize: '16px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    Catégorie: <strong style={{ color: '#0f172a' }}>{project.category || 'Développement'}</strong>
                  </div>
                  {project.tags && (
                    <div className="project-details-info" style={{ fontSize: '16px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span>Technologies :</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                        {project.tags.split(',').map((t, idx) => (
                          <span 
                            key={idx} 
                            style={{ 
                              fontSize: '13px', 
                              fontWeight: '600', 
                              background: '#f1f5f9', 
                              color: '#475569', 
                              padding: '0.25rem 0.6rem', 
                              borderRadius: '6px' 
                            }}
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
