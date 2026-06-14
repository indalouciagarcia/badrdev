import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import '../Dashboard.css';

export default function SkillFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 80,
    category: 'Frontend'
  });

  useEffect(() => {
    if (isEdit) {
      fetchSkill();
    }
  }, [id]);

  const fetchSkill = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setSkillForm({
          name: data.name,
          level: data.level,
          category: data.category
        });
      }
    } catch (error) {
      console.error('Error fetching skill:', error);
      alert('Impossible de charger la compétence.');
      navigate('/dashboard/skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: skillForm.name,
        level: skillForm.level,
        category: skillForm.category
      };

      if (isEdit) {
        const { error } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([payload]);
        
        if (error) throw error;
      }
      
      navigate('/dashboard/skills');
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Erreur lors de l\'enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <Link to="/dashboard/skills" className="back-link">
            <ArrowLeft size={18} />
            <span>Retour aux compétences</span>
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>
            {isEdit ? 'Modifier la Compétence' : 'Créer une Compétence'}
          </h1>
          <p>Configurez le nom, la catégorie et votre niveau de maîtrise pour cette technologie.</p>
        </div>
      </div>

      <div className="service-detail" style={{ maxWidth: '650px' }}>
        <form onSubmit={handleSubmit} className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="meta-label">Nom de la compétence</label>
            <input
              type="text"
              placeholder="ex: React, Python, Docker"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              required
              disabled={submitting}
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
            />
          </div>

          <div>
            <label className="meta-label">Catégorie</label>
            <select
              value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
              disabled={submitting}
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', background: 'white' }}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database & SQL</option>
              <option value="Mobile">Mobile (iOS/Android)</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Design">Design & UI/UX</option>
              <option value="Autres">Autres</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#475569' }}>
              <span>Niveau de maîtrise :</span>
              <strong style={{ color: 'var(--indigo-primary)', fontSize: '18px' }}>{skillForm.level}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
              disabled={submitting}
              style={{ cursor: 'pointer', accentColor: 'var(--indigo-primary)', height: '8px', marginTop: '0.25rem' }}
            />
          </div>

          <div className="detail-actions" style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{submitting ? 'Sauvegarde...' : (isEdit ? 'Modifier' : 'Créer')}</span>
            </button>
            <button type="button" onClick={() => navigate('/dashboard/skills')} style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', padding: '0.75rem 1.35rem', fontWeight: '600', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
