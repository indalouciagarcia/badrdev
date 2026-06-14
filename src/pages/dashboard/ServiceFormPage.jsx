import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import '../Dashboard.css';

export default function ServiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  
  const [serviceForm, setServiceForm] = useState({ 
    project_id: '', 
    title: '', 
    description: '', 
    price: '', 
    status: 'active' 
  });

  useEffect(() => {
    const init = async () => {
      await fetchProjects();
      if (isEdit) {
        await fetchService();
      } else {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setServiceForm({
          project_id: data.project_id || '',
          title: data.title,
          description: data.description || '',
          price: data.price || '',
          status: data.status
        });
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      alert('Impossible de charger le service.');
      navigate('/dashboard/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        project_id: serviceForm.project_id || null,
        title: serviceForm.title,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price) || 0,
        status: serviceForm.status,
        updated_at: new Date()
      };

      if (isEdit) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([payload]);
        
        if (error) throw error;
      }
      
      navigate('/dashboard/services');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Erreur lors de l\'enregistrement du service.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement des informations...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <Link to="/dashboard/services" className="back-link">
            <ArrowLeft size={18} />
            <span>Retour aux services</span>
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>
            {isEdit ? 'Modifier le Service' : 'Créer un Nouveau Service'}
          </h1>
          <p>Saisissez les caractéristiques, tarifs et statut de la prestation proposée.</p>
        </div>
      </div>

      <div className="service-detail" style={{ maxWidth: '750px' }}>
        <form onSubmit={handleSubmit} className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="meta-label">Associer à un projet (optionnel)</label>
            <select
              value={serviceForm.project_id}
              onChange={(e) => setServiceForm({...serviceForm, project_id: e.target.value})}
              disabled={submitting}
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', background: 'white' }}
            >
              <option value="">Aucun projet associé</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="meta-label">Titre du service</label>
            <input
              type="text"
              placeholder="Titre (ex: Développement de l'API)"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
              required
              disabled={submitting}
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
            />
          </div>

          <div>
            <label className="meta-label">Description</label>
            <textarea
              placeholder="Détails de la prestation..."
              value={serviceForm.description}
              onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
              disabled={submitting}
              rows={5}
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="meta-label">Tarif (€)</label>
              <input
                type="number"
                placeholder="ex: 1500"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                step="0.01"
                required
                disabled={submitting}
                style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
              />
            </div>

            <div>
              <label className="meta-label">Statut</label>
              <select
                value={serviceForm.status}
                onChange={(e) => setServiceForm({...serviceForm, status: e.target.value})}
                disabled={submitting}
                style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', background: 'white' }}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>

          <div className="detail-actions" style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{submitting ? 'Sauvegarde...' : (isEdit ? 'Modifier le service' : 'Créer le service')}</span>
            </button>
            <button type="button" onClick={() => navigate('/dashboard/services')} style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', padding: '0.75rem 1.35rem', fontWeight: '600', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
