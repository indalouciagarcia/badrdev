import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { FolderKanban, Wrench, Plus, Trash2, Loader2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

export default function DashboardProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, services(count)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Tous les services associés seront également supprimés.')) return;
    
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement des projets...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Gestion des Projets</h1>
          <p>Organisez et gérez les différents projets de votre portfolio.</p>
        </div>
        <Link className="btn-primary" to="/dashboard/projects/new" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          <span>Nouveau Projet</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card projects">
          <div className="stat-icon-wrapper">
            <FolderKanban size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Projets</h3>
            <p className="stat-number">{projects.length}</p>
          </div>
        </div>
        <div className="stat-card services">
          <div className="stat-icon-wrapper">
            <Wrench size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Services</h3>
            <p className="stat-number">
              {projects.reduce((sum, p) => sum + (p.services?.[0]?.count || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="no-data">
          <FolderKanban size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Aucun projet enregistré. Commencez par en ajouter un !</p>
        </div>
      ) : (
        <div className="items-grid">
          {projects.map(project => (
            <div key={project.id} className="item-card">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                {project.image_url && (
                  <img 
                    src={project.image_url} 
                    alt={project.name} 
                    style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                )}
                <div style={{ flex: 1 }}>
                  <span className="project-badge" style={{ marginTop: 0, background: '#e0e7ff', color: '#4f46e5' }}>{project.category || 'Général'}</span>
                  <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '20px' }}>{project.name}</h3>
                </div>
              </div>
              <p style={{ maxHeight: '72px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {project.description || 'Aucune description fournie.'}
              </p>
              <div className="card-meta" style={{ marginTop: 'auto' }}>
                <Wrench size={14} className="text-teal" />
                <span>{project.services?.[0]?.count || 0} services associés</span>
              </div>
              <div className="card-actions">
                <Link to={`/dashboard/projects/edit/${project.id}`} className="btn-primary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', boxShadow: 'none', background: '#f1f5f9', color: '#475569', textDecoration: 'none' }}>
                  <Edit3 size={14} />
                  <span>Modifier</span>
                </Link>
                <button onClick={() => handleDeleteProject(project.id)} className="btn-danger">
                  <Trash2 size={14} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
