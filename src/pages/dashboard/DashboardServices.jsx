import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { Plus, Trash2, Loader2, Wrench, CheckCircle, Euro, Eye, Edit3 } from 'lucide-react';
import '../Dashboard.css';

export default function DashboardServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, projects(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Erreur lors de la suppression du service');
    }
  };

  const activeServices = services.filter(s => s.status === 'active').length;
  const totalRevenue = services
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

  if (loading && services.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement des services...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Gestion des Services</h1>
          <p>Proposez des services clairs et gérez leur avancement.</p>
        </div>
        <Link className="btn-primary" to="/dashboard/services/new" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          <span>Nouveau Service</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card services">
          <div className="stat-icon-wrapper">
            <Wrench size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Services</h3>
            <p className="stat-number">{services.length}</p>
          </div>
        </div>
        <div className="stat-card active-services">
          <div className="stat-icon-wrapper">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Services Actifs</h3>
            <p className="stat-number">{activeServices}</p>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon-wrapper">
            <Euro size={24} />
          </div>
          <div className="stat-content">
            <h3>Revenu Actif</h3>
            <p className="stat-number">{totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
          </div>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="no-data">
          <Wrench size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Aucun service enregistré. Commencez par en ajouter un !</p>
        </div>
      ) : (
        <div className="items-grid">
          {services.map(service => (
            <Link key={service.id} to={`/dashboard/services/${service.id}`} className="item-card clickable" style={{ textDecoration: 'none' }}>
              <span className={`status ${service.status}`}>{service.status}</span>
              <h3 style={{ fontSize: '20px', marginTop: '0.5rem' }}>{service.title}</h3>
              <p>{service.description || 'Aucune description fournie.'}</p>
              <p className="price" style={{ fontSize: '20px' }}>{service.price.toLocaleString('fr-FR')} €</p>
              {service.projects?.name && (
                <span className="project-name">Projet: {service.projects.name}</span>
              )}
              <div className="card-actions">
                <span className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none' }}>
                  <Eye size={14} />
                  <span>Détail</span>
                </span>
                <Link 
                  to={`/dashboard/services/edit/${service.id}`} 
                  className="btn-primary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none', background: '#f1f5f9', color: '#475569', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Edit3 size={14} />
                  <span>Modifier</span>
                </Link>
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleDeleteService(service.id); 
                  }} 
                  className="btn-danger"
                >
                  <Trash2 size={14} />
                  <span>Supprimer</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
