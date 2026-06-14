import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Loader2, Save, Upload } from 'lucide-react';
import '../Dashboard.css';

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    category: 'Développement Web',
    image_url: '/assets/images/latest-portfolio/portfoli-img-1.jpg',
    client: 'Badr Belabbes',
    project_date: '',
    tags: 'React, Node.js, Supabase',
    mini_title: 'Élever votre entreprise avec des solutions IT',
    sub_description: '',
    gallery_images: '/assets/images/projects-details/project-detials-swiper-img-1.jpg,/assets/images/projects-details/project-detials-swiper-img-2.png',
    features: 'Design UI/UX, Développement d\'applications, Intégration de services'
  });

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setProjectForm({
          name: data.name,
          description: data.description || '',
          category: data.category || 'Développement Web',
          image_url: data.image_url || '/assets/images/latest-portfolio/portfoli-img-1.jpg',
          client: data.client || 'Badr Belabbes',
          project_date: data.project_date || '',
          tags: data.tags || 'React, Node.js, Supabase',
          mini_title: data.mini_title || 'Élever votre entreprise avec des solutions IT',
          sub_description: data.sub_description || '',
          gallery_images: data.gallery_images || '/assets/images/projects-details/project-detials-swiper-img-1.jpg,/assets/images/projects-details/project-detials-swiper-img-2.png',
          features: data.features || 'Design UI/UX, Développement d\'applications, Intégration de services'
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Impossible de récupérer les informations du projet.');
      navigate('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `project_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setProjectForm(prev => ({ ...prev, image_url: publicUrl }));
      alert('Image téléchargée avec succès !');
    } catch (error) {
      console.error('Error uploading project image:', error);
      alert('Erreur lors du téléchargement de l\'image : ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: projectForm.name,
        description: projectForm.description,
        category: projectForm.category,
        image_url: projectForm.image_url,
        client: projectForm.client,
        project_date: projectForm.project_date,
        tags: projectForm.tags,
        mini_title: projectForm.mini_title,
        sub_description: projectForm.sub_description,
        gallery_images: projectForm.gallery_images,
        features: projectForm.features,
        updated_at: new Date()
      };

      if (isEdit) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([payload]);
        
        if (error) throw error;
      }
      
      navigate('/dashboard/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erreur lors de l\'enregistrement du projet.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement des détails...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <Link to="/dashboard/projects" className="back-link">
            <ArrowLeft size={18} />
            <span>Retour aux projets</span>
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>
            {isEdit ? 'Modifier le Projet' : 'Créer un Nouveau Projet'}
          </h1>
          <p>Saisissez les informations techniques et de présentation de votre réalisation.</p>
        </div>
      </div>

      <div className="service-detail" style={{ maxWidth: '900px' }}>
        <form onSubmit={handleSubmit} className="detail-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="meta-label">Nom du Projet</label>
                <input
                  type="text"
                  placeholder="Nom du projet (ex: Plateforme Analyse Football)"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  required
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>

              <div>
                <label className="meta-label">Catégorie</label>
                <input
                  type="text"
                  placeholder="Catégorie (ex: Technologies Sportives)"
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                  required
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="meta-label">Client / Auteur</label>
                  <input
                    type="text"
                    placeholder="ex: Badr Belabbes"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({...projectForm, client: e.target.value})}
                    disabled={submitting}
                    style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                  />
                </div>
                <div>
                  <label className="meta-label">Date du Projet</label>
                  <input
                    type="text"
                    placeholder="ex: Juin 2026"
                    value={projectForm.project_date}
                    onChange={(e) => setProjectForm({...projectForm, project_date: e.target.value})}
                    disabled={submitting}
                    style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                  />
                </div>
              </div>

              <div>
                <label className="meta-label">Technologies (séparées par des virgules)</label>
                <input
                  type="text"
                  placeholder="ex: React, Node.js, PostgreSQL"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>

              <div>
                <label className="meta-label">Image Principale</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  {projectForm.image_url && (
                    <img 
                      src={projectForm.image_url} 
                      alt="Aperçu" 
                      style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }} 
                    />
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={projectForm.image_url}
                      onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                      disabled={submitting}
                      style={{ padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        id="form-project-image-upload"
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="form-project-image-upload" 
                        className="btn-primary" 
                        style={{ 
                          padding: '0.6rem 1.2rem', 
                          fontSize: '16px', 
                          margin: 0, 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          boxShadow: 'none'
                        }}
                      >
                        {uploadingImage ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
                        <span>{uploadingImage ? 'Téléchargement...' : 'Téléverser un fichier'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="meta-label">Sous-titre (Mini-title)</label>
                <input
                  type="text"
                  placeholder="ex: Élever votre entreprise avec des solutions IT"
                  value={projectForm.mini_title}
                  onChange={(e) => setProjectForm({...projectForm, mini_title: e.target.value})}
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>

              <div>
                <label className="meta-label">Description Principale</label>
                <textarea
                  placeholder="Description principale du projet..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  disabled={submitting}
                  rows={4}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label className="meta-label">Description Secondaire</label>
                <textarea
                  placeholder="Description secondaire détaillée..."
                  value={projectForm.sub_description}
                  onChange={(e) => setProjectForm({...projectForm, sub_description: e.target.value})}
                  disabled={submitting}
                  rows={4}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label className="meta-label">Checklist Fonctionnalités (séparées par des virgules)</label>
                <input
                  type="text"
                  placeholder="ex: App Mobile, Design UI/UX, Backend API"
                  value={projectForm.features}
                  onChange={(e) => setProjectForm({...projectForm, features: e.target.value})}
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>

              <div>
                <label className="meta-label">Galerie d'images (URLs séparées par des virgules)</label>
                <input
                  type="text"
                  placeholder="ex: /img1.png, /img2.png"
                  value={projectForm.gallery_images}
                  onChange={(e) => setProjectForm({...projectForm, gallery_images: e.target.value})}
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>
            </div>
          </div>

          <div className="detail-actions" style={{ marginTop: '2.5rem', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{submitting ? 'Sauvegarde...' : (isEdit ? 'Modifier le projet' : 'Créer le projet')}</span>
            </button>
            <button type="button" onClick={() => navigate('/dashboard/projects')} style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', padding: '0.75rem 1.35rem', fontWeight: '600', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
