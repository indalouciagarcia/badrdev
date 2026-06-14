import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Award, Plus, Trash2, Loader2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

export default function DashboardSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading && skills.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement des compétences...</p>
      </div>
    );
  }

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Mes Compétences</h1>
          <p>Ajoutez et modifiez vos compétences techniques et leur niveau de maîtrise.</p>
        </div>
        <Link className="btn-primary" to="/dashboard/skills/new" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          <span>Nouvelle Compétence</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card projects">
          <div className="stat-icon-wrapper">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>Compétences</h3>
            <p className="stat-number">{skills.length}</p>
          </div>
        </div>
        <div className="stat-card active-services">
          <div className="stat-icon-wrapper">
            <Award size={24} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div className="stat-content">
            <h3>Catégories</h3>
            <p className="stat-number">{categories.length}</p>
          </div>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="no-data">
          <Award size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Aucune compétence enregistrée. Commencez par en ajouter une !</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categories.map(cat => (
            <div key={cat} className="dashboard-section" style={{ paddingBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                {cat}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {skills.filter(s => s.category === cat).map(skill => (
                  <div key={skill.id} style={{
                    background: '#f8fafc',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{skill.name}</h4>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <Link 
                          to={`/dashboard/skills/edit/${skill.id}`} 
                          className="btn-primary" 
                          style={{ padding: '0.35rem', borderRadius: '6px', boxShadow: 'none', background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Edit3 size={13} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteSkill(skill.id)} 
                          className="btn-danger" 
                          style={{ padding: '0.35rem', borderRadius: '6px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginBottom: '0.25rem' }}>
                        <span>Maîtrise</span>
                        <span style={{ fontWeight: '700', color: 'var(--indigo-primary)' }}>{skill.level}%</span>
                      </div>
                      <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${skill.level}%`, height: '100%', background: 'var(--indigo-primary)', borderRadius: '10px' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
