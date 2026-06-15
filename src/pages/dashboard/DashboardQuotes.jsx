import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Mail, Settings, CheckCircle, Clock, Trash2, Plus, Loader2 } from 'lucide-react';
import '../Dashboard.css';

export default function DashboardQuotes() {
  const [activeTab, setActiveTab] = useState('requests');
  
  // Requests state
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Settings state
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [newOption, setNewOption] = useState({ category: 'project_type', label: '', value: '' });
  const [savingOption, setSavingOption] = useState(false);

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    } else {
      fetchOptions();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const { data, error } = await supabase
        .from('quote_options')
        .select('*')
        .order('category', { ascending: true })
        .order('label', { ascending: true });

      if (error) throw error;
      setOptions(data || []);
    } catch (error) {
      console.error('Error fetching quote options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', id);

      if (error) throw error;
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm('Supprimer cette demande définitivement ?')) return;
    try {
      const { error } = await supabase.from('quote_requests').delete().eq('id', id);
      if (error) throw error;
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleAddOption = async (e) => {
    e.preventDefault();
    if (!newOption.label || !newOption.value) return;

    setSavingOption(true);
    try {
      const { error } = await supabase.from('quote_options').insert([{
        category: newOption.category,
        label: newOption.label,
        value: newOption.value
      }]);

      if (error) throw error;
      setNewOption({ category: newOption.category, label: '', value: '' });
      fetchOptions();
    } catch (error) {
      console.error('Error adding option:', error);
      alert('Erreur lors de l\'ajout de l\'option.');
    } finally {
      setSavingOption(false);
    }
  };

  const handleDeleteOption = async (id) => {
    if (!confirm('Voulez-vous supprimer cette option du formulaire ?')) return;
    try {
      const { error } = await supabase.from('quote_options').delete().eq('id', id);
      if (error) throw error;
      fetchOptions();
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const newCount = requests.filter(r => r.status === 'Nouveau').length;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Devis & Contacts</h1>
          <p>Gérez vos leads, demandes de devis et configurez les options du formulaire.</p>
        </div>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('requests')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'requests' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'requests' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Mail size={18} />
          Demandes Reçues {newCount > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '12px' }}>{newCount}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'settings' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'settings' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Settings size={18} />
          Paramètres du Formulaire
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="requests-container">
          {loadingRequests ? (
            <div className="loading-container">
              <Loader2 className="spinner text-indigo" size={32} />
              <p>Chargement des demandes...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="no-data">
              <Mail size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Aucune demande de devis pour le moment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.map(req => (
                <div key={req.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          background: req.status === 'Nouveau' ? '#fee2e2' : req.status === 'En cours' ? '#fef3c7' : '#d1fae5',
                          color: req.status === 'Nouveau' ? '#991b1b' : req.status === 'En cours' ? '#92400e' : '#065f46'
                        }}>
                          {req.status}
                        </span>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                          Reçu le {new Date(req.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {req.quote_number && <span style={{fontSize: '12px', color: '#8b5cf6', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem'}}>{req.quote_number}</span>}
                      <h3 style={{ fontSize: '18px', margin: '0 0 0.25rem 0', color: '#0f172a' }}>{req.name}</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                        <a href={`mailto:${req.email}`} style={{ color: 'var(--indigo-primary)', textDecoration: 'none' }}>{req.email}</a> • {req.phone}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select 
                        value={req.status} 
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      >
                        <option value="Nouveau">Nouveau</option>
                        <option value="En cours">En cours</option>
                        <option value="Clôturé">Clôturé</option>
                      </select>
                      <button onClick={() => handleDeleteRequest(req.id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Type de Projet</strong>
                        <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>{req.project_type || 'Non spécifié'}</span>
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Budget Estimé</strong>
                        <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>{req.budget || 'Non spécifié'} {req.currency}</span>
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Délai Souhaité</strong>
                        <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>{req.timeline || 'Non spécifié'}</span>
                      </div>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Détails & Qualification du Projet</strong>
                      {req.message && req.message.includes('--- IDENTITÉ DU CLIENT ---') ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13.5px' }}>
                          {req.message.split('\n\n').map((section, sidx) => {
                            const lines = section.trim().split('\n');
                            const sectionTitle = lines[0].replace(/---/g, '').trim();
                            const sectionItems = lines.slice(1);
                            
                            if (!sectionTitle) return null;
                            return (
                              <div key={sidx} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                                <strong style={{ color: '#FF014F', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '0.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem' }}>
                                  {sectionTitle}
                                </strong>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  {sectionItems.map((li, lidx) => {
                                    const parts = li.split(':');
                                    if (parts.length >= 2) {
                                      return (
                                        <div key={lidx}>
                                          <span style={{ color: '#64748b', fontWeight: '500' }}>{parts[0].trim()} : </span>
                                          <span style={{ color: '#1e293b', fontWeight: '600' }}>{parts.slice(1).join(':').trim()}</span>
                                        </div>
                                      );
                                    }
                                    return <div key={lidx} style={{ color: '#334155', fontStyle: 'italic', fontSize: '13px', whiteSpace: 'pre-wrap' }}>{li}</div>;
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{req.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          <div className="detail-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Ajouter une Option</h3>
            <form onSubmit={handleAddOption} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="meta-label">Type d'option</label>
                <select 
                  className="meta-input" 
                  value={newOption.category} 
                  onChange={e => setNewOption({ ...newOption, category: e.target.value })}
                >
                  <option value="project_type">Type de Projet</option>
                  <option value="budget">Budget Estimé</option>
                  <option value="timeline">Délai Souhaité</option>
                  <option value="currency">Devise / Monnaie</option>
                </select>
              </div>
              <div className="form-group">
                <label className="meta-label">Label (Affiché publiquement)</label>
                <input 
                  type="text" 
                  className="meta-input" 
                  value={newOption.label} 
                  onChange={e => setNewOption({ ...newOption, label: e.target.value })} 
                  placeholder="Ex: Application Web"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="meta-label">Valeur interne (Identifiant unique)</label>
                <input 
                  type="text" 
                  className="meta-input" 
                  value={newOption.value} 
                  onChange={e => setNewOption({ ...newOption, value: e.target.value })} 
                  placeholder="Ex: web_app"
                  required 
                />
              </div>
              <button type="submit" disabled={savingOption} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {savingOption ? <Loader2 className="spinner" size={18} /> : <Plus size={18} />}
                <span>Ajouter l'option</span>
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Types de projets */}
            <div className="detail-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--indigo-primary)' }}>Types de Projets</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {options.filter(o => o.category === 'project_type').map(opt => (
                  <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{opt.label}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>val: {opt.value}</p>
                    </div>
                    <button onClick={() => handleDeleteOption(opt.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Devises */}
            <div className="detail-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--indigo-primary)' }}>Devises</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {options.filter(o => o.category === 'currency').map(opt => (
                  <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{opt.label}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>val: {opt.value}</p>
                    </div>
                    <button onClick={() => handleDeleteOption(opt.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Budgets */}
            <div className="detail-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--indigo-primary)' }}>Budgets Estimés</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {options.filter(o => o.category === 'budget').map(opt => (
                  <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{opt.label}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>val: {opt.value}</p>
                    </div>
                    <button onClick={() => handleDeleteOption(opt.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Délais */}
            <div className="detail-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--indigo-primary)' }}>Délais Souhaités</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {options.filter(o => o.category === 'timeline').map(opt => (
                  <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{opt.label}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>val: {opt.value}</p>
                    </div>
                    <button onClick={() => handleDeleteOption(opt.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
