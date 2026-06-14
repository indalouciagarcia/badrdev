import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Plus, Trash2, Edit3, Loader2, FileText, MessageSquare, Hash, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('testimonials');
  const [loading, setLoading] = useState(false);

  const [testimonials, setTestimonials] = useState([]);
  const [counters, setCounters] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [testRes, countRes, expRes] = await Promise.all([
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('counters').select('*').order('created_at', { ascending: true }),
        supabase.from('experiences').select('*').order('type', { ascending: true })
      ]);

      if (testRes.error) throw testRes.error;
      if (countRes.error) throw countRes.error;
      if (expRes.error) throw expRes.error;

      setTestimonials(testRes.data || []);
      setCounters(countRes.data || []);
      setExperiences(expRes.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
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
          <p>Gérez les témoignages, compteurs et expériences affichés sur la page d'accueil et à propos.</p>
        </div>
        <Link 
          className="btn-primary" 
          to={`/dashboard/content/new/${activeTab}`} 
          style={{ textDecoration: 'none' }}
        >
          <Plus size={18} />
          <span>Nouveau {activeTab === 'testimonials' ? 'Témoignage' : activeTab === 'counters' ? 'Compteur' : 'Expérience'}</span>
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
          onClick={() => setActiveTab('experiences')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'experiences' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'experiences' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Briefcase size={18} />
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
    </div>
  );
}
