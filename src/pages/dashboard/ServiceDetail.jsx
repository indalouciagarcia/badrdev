import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Calendar, Tag, Briefcase, Clock, Euro, Loader2 } from 'lucide-react';
import '../Dashboard.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (serviceError) throw serviceError;
      setService(serviceData);
      
      // Fetch project details
      if (serviceData.project_id) {
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', serviceData.project_id)
          .single();
        
        setProject(projectData);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
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

  if (!service) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/dashboard/services" className="back-link">
            <ArrowLeft size={16} />
            <span>Retour aux services</span>
          </Link>
          <h1>Service non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <Link to="/dashboard/services" className="back-link">
            <ArrowLeft size={14} />
            <span>Retour aux services</span>
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Détails du Service</h1>
        </div>
      </div>

      <div className="service-detail">
        <div className="detail-card">
          <div className="detail-header">
            <h2>{service.title}</h2>
            <span className={`status ${service.status}`}>{service.status}</span>
          </div>

          {project && (
            <div className="detail-project">
              <h3>
                <Briefcase size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Projet associé
              </h3>
              <p>{project.name}</p>
              <p className="project-description">{project.description || 'Aucune description de projet.'}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>
              <Tag size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Description
            </h3>
            <p className="detail-description">{service.description || 'Aucune description disponible pour ce service.'}</p>
          </div>

          <div className="detail-section">
            <h3>
              <Euro size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Tarif
            </h3>
            <p className="detail-price">{service.price.toLocaleString('fr-FR')} €</p>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">
                <Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Créé le :
              </span>
              <span className="meta-value">
                {new Date(service.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">
                <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Mis à jour le :
              </span>
              <span className="meta-value">
                {new Date(service.updated_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="detail-actions">
            <Link to="/dashboard/services" className="btn-primary">
              <ArrowLeft size={16} />
              <span>Retour aux services</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
