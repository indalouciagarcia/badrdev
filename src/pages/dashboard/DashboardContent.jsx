import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Plus, Trash2, Edit3, Loader2, FileText, MessageSquare, Hash, Briefcase, Image, Upload, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('testimonials');
  const [loading, setLoading] = useState(false);

  const [testimonials, setTestimonials] = useState([]);
  const [counters, setCounters] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [servicesSettings, setServicesSettings] = useState({
    services_subtitle: 'Derniers Services',
    services_title: 'Des Solutions Digitales Sur Mesure',
    services_desc: 'Je conçois et développe des applications web et mobiles innovantes, évolutives et sécurisées pour les entreprises, startups et organisations sportives.',
    services_image: ''
  });
  const [savingServices, setSavingServices] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [testRes, countRes, expRes, settingsRes] = await Promise.all([
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('counters').select('*').order('created_at', { ascending: true }),
        supabase.from('experiences').select('*').order('type', { ascending: true }),
        supabase.from('site_settings').select('key, value').in('key', ['services_subtitle', 'services_title', 'services_desc', 'services_image'])
      ]);

      if (testRes.error) throw testRes.error;
      if (countRes.error) throw countRes.error;
      if (expRes.error) throw expRes.error;
      if (settingsRes.error) throw settingsRes.error;

      setTestimonials(testRes.data || []);
      setCounters(countRes.data || []);
      setExperiences(expRes.data || []);

      if (settingsRes.data) {
        const map = {};
        settingsRes.data.forEach(item => { map[item.key] = item.value });
        setServicesSettings(prev => ({ ...prev, ...map }));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveServicesSettings = async (e) => {
    e.preventDefault();
    setSavingServices(true);
    try {
      for (const key of Object.keys(servicesSettings)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: servicesSettings[key], updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) throw error;
      }
      alert('Paramètres de la section Services enregistrés avec succès !');
    } catch (error) {
      console.error('Error saving services settings:', error);
      alert('Erreur lors de l\'enregistrement des paramètres : ' + error.message);
    } finally {
      setSavingServices(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `services_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      let activeBucket = 'portfolio';
      let uploadRes = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadRes.error) {
        activeBucket = 'uploads';
        uploadRes = await supabase.storage
          .from('uploads')
          .upload(filePath, file);
      }

      if (uploadRes.error) {
        activeBucket = 'profile';
        uploadRes = await supabase.storage
          .from('profile')
          .upload(filePath, file);
      }

      if (uploadRes.error) throw uploadRes.error;

      const { data: { publicUrl } } = supabase.storage
        .from(activeBucket)
        .getPublicUrl(filePath);

      setServicesSettings(prev => ({ ...prev, services_image: publicUrl }));
      alert('Image de la section Services importée avec succès !');
    } catch (error) {
      console.error('Error uploading services image:', error);
      alert('Erreur lors du téléchargement de l\'image : ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading && testimonials.length === 0 && counters.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement du contenu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Contenu du Site</h1>
          <p>Gérez les témoignages, compteurs, expériences et services affichés sur la page d'accueil et à propos.</p>
        </div>
        <Link 
          className="btn-primary" 
          to={activeTab === 'services' ? '/dashboard/content/new/experiences' : `/dashboard/content/new/${activeTab}`} 
          style={{ textDecoration: 'none' }}
        >
          <Plus size={18} />
          <span>Nouveau {activeTab === 'testimonials' ? 'Témoignage' : activeTab === 'counters' ? 'Compteur' : activeTab === 'services' ? 'Service' : 'Expérience'}</span>
        </Link>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('testimonials')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'testimonials' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'testimonials' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MessageSquare size={18} />
          Témoignages
        </button>
        <button 
          onClick={() => setActiveTab('counters')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'counters' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'counters' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Hash size={18} />
          Compteurs
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'services' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'services' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Briefcase size={18} />
          Derniers Services
        </button>
        <button 
          onClick={() => setActiveTab('experiences')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'experiences' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'experiences' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FileText size={18} />
          Expériences / Cartes
        </button>
      </div>

      {activeTab === 'testimonials' && (
        <div className="grid-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {testimonials.map(item => (
            <div key={item.id} className="card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.image_url && <img src={item.image_url} alt="Testimonial" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{item.name}</h4>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{item.role}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <Link to={`/dashboard/content/edit/testimonials/${item.id}`} className="btn-primary" style={{ padding: '0.35rem', borderRadius: '6px', boxShadow: 'none', background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center' }}>
                    <Edit3 size={14} />
                  </Link>
                  <button onClick={() => handleDelete('testimonials', item.id)} className="btn-danger" style={{ padding: '0.35rem', borderRadius: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontStyle: 'italic' }}>"{item.text}"</p>
            </div>
          ))}
          {testimonials.length === 0 && <p style={{ color: '#64748b' }}>Aucun témoignage trouvé.</p>}
        </div>
      )}

      {activeTab === 'counters' && (
        <div className="grid-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {counters.map(item => (
            <div key={item.id} className="card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--indigo-primary)', fontWeight: '700' }}>{item.count}+</h2>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <Link to={`/dashboard/content/edit/counters/${item.id}`} className="btn-primary" style={{ padding: '0.35rem', borderRadius: '6px', boxShadow: 'none', background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center' }}>
                    <Edit3 size={14} />
                  </Link>
                  <button onClick={() => handleDelete('counters', item.id)} className="btn-danger" style={{ padding: '0.35rem', borderRadius: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontWeight: '500', color: '#475569' }}>{item.label}</p>
            </div>
          ))}
          {counters.length === 0 && <p style={{ color: '#64748b' }}>Aucun compteur trouvé.</p>}
        </div>
      )}

      {activeTab === 'experiences' && (
        <div className="grid-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {experiences.map(item => (
            <div key={item.id} className="card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--indigo-primary)', marginBottom: '0.25rem' }}>{item.type}</span>
                  <h4 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{item.title}</h4>
                  {item.subtitle && <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{item.subtitle}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <Link to={`/dashboard/content/edit/experiences/${item.id}`} className="btn-primary" style={{ padding: '0.35rem', borderRadius: '6px', boxShadow: 'none', background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center' }}>
                    <Edit3 size={14} />
                  </Link>
                  <button onClick={() => handleDelete('experiences', item.id)} className="btn-danger" style={{ padding: '0.35rem', borderRadius: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {item.description && <p style={{ fontSize: '14px', color: '#475569', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}
              {item.icon && <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className={item.icon}></i> <span>{item.icon}</span></div>}
            </div>
          ))}
          {experiences.length === 0 && <p style={{ color: '#64748b' }}>Aucune expérience trouvée.</p>}
        </div>
      )}

      {activeTab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Configuration Form for the Section Header */}
          <form onSubmit={handleSaveServicesSettings} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>⚙️ En-tête & Illustration de la Section</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', marginTop: '-0.75rem' }}>Personnalisez les textes de titre et l'image affichée à droite de la section.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="meta-label">Sous-titre</label>
                <input
                  type="text"
                  className="meta-input"
                  value={servicesSettings.services_subtitle}
                  onChange={e => setServicesSettings({ ...servicesSettings, services_subtitle: e.target.value })}
                  placeholder="Derniers Services"
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="meta-label">Titre principal</label>
                <input
                  type="text"
                  className="meta-input"
                  value={servicesSettings.services_title}
                  onChange={e => setServicesSettings({ ...servicesSettings, services_title: e.target.value })}
                  placeholder="Des Solutions Digitales Sur Mesure"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="meta-label">Description générale</label>
              <textarea
                className="meta-input"
                style={{ minHeight: '80px', fontFamily: 'inherit' }}
                value={servicesSettings.services_desc}
                onChange={e => setServicesSettings({ ...servicesSettings, services_desc: e.target.value })}
                placeholder="Description courte de vos expertises..."
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="meta-label">Image d'illustration (Droite)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {servicesSettings.services_image && (
                  <img src={servicesSettings.services_image} alt="Illustration preview" style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                  <input
                    type="url"
                    className="meta-input"
                    value={servicesSettings.services_image}
                    onChange={e => setServicesSettings({ ...servicesSettings, services_image: e.target.value })}
                    placeholder="https://..."
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <label className="btn-primary" style={{ cursor: 'pointer', background: '#f1f5f9', color: '#475569', boxShadow: 'none', margin: 0 }}>
                      {uploadingImage ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
                      <span>{uploadingImage ? 'Téléchargement...' : 'Téléverser une image'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" disabled={savingServices} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {savingServices ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                <span>{savingServices ? 'Enregistrement...' : 'Enregistrer la section'}</span>
              </button>
            </div>
          </form>

          {/* Individual Service Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>🛠️ Cartes de Services (Home)</h3>
            <div className="grid-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {experiences.filter(item => item.type === 'service_card').map(item => (
                <div key={item.id} className="card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{item.title}</h4>
                      {item.subtitle && <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600', marginTop: '0.25rem' }}>{item.subtitle}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <Link to={`/dashboard/content/edit/experiences/${item.id}`} className="btn-primary" style={{ padding: '0.35rem', borderRadius: '6px', boxShadow: 'none', background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center' }}>
                        <Edit3 size={14} />
                      </Link>
                      <button onClick={() => handleDelete('experiences', item.id)} className="btn-danger" style={{ padding: '0.35rem', borderRadius: '6px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {item.description && <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{item.description}</p>}
                </div>
              ))}
              {experiences.filter(item => item.type === 'service_card').length === 0 && <p style={{ color: '#64748b' }}>Aucun service trouvé. Cliquez sur "Nouveau Service" ci-dessus pour en ajouter.</p>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
