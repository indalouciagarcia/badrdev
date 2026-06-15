import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Link } from 'react-router-dom';
import { 
  Users, Mail, Phone, Calendar, ArrowRight, CheckCircle2, 
  Clock, AlertCircle, Plus, Trash2, Edit2, Search, 
  MessageSquare, UserPlus, DollarSign, FileText, Check, X, ShieldAlert
} from 'lucide-react';
import '../Dashboard.css';

export default function DashboardCRM() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  
  // Modal states
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [editingNotesLeadId, setEditingNotesLeadId] = useState(null);

  // New Lead manual state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: '',
    budget: '',
    timeline: '',
    message: '',
    status: 'Nouveau'
  });
  const [savingLead, setSavingLead] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching CRM leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', id);

      if (error) throw error;
      fetchLeads();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors du changement de statut.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ message: notes, updated_at: new Date() })
        .eq('id', selectedLead.id);

      if (error) throw error;
      alert('Notes et historique mis à jour avec succès !');
      fetchLeads();
      setSelectedLead(prev => ({ ...prev, message: notes }));
      setEditingNotesLeadId(null);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Erreur lors de la sauvegarde des notes.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.email) return;

    setSavingLead(true);
    try {
      // Generate a quote number
      const qNum = `CRM-${Date.now().toString().slice(-6)}`;
      const { error } = await supabase
        .from('quote_requests')
        .insert([{
          ...newLeadForm,
          quote_number: qNum
        }]);

      if (error) throw error;
      setShowAddLeadModal(false);
      setNewLeadForm({
        name: '',
        email: '',
        phone: '',
        project_type: '',
        budget: '',
        timeline: '',
        message: '',
        status: 'Nouveau'
      });
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead manually:', error);
      alert('Erreur lors de la création du contact/lead.');
    } finally {
      setSavingLead(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Voulez-vous supprimer définitivement ce lead du CRM ?')) return;
    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchLeads();
      setSelectedLead(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  // Filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.quote_number && lead.quote_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.project_type && lead.project_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'Tous') return matchesSearch;
    return matchesSearch && lead.status === statusFilter;
  });

  // Calculate statistics for pipeline
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'Nouveau').length,
    inProgress: leads.filter(l => l.status === 'En cours').length,
    closedWon: leads.filter(l => l.status === 'Clôturé').length, // Treated as validated/signed
  };

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>💼 CRM & Suivi Client</h1>
          <p>Visualisez vos contacts, gérez les étapes de vente, et ajoutez des notes de suivi.</p>
        </div>
        <button 
          onClick={() => setShowAddLeadModal(true)}
          className="btn-primary"
          style={{ background: '#FF014F', display: 'flex', gap: '0.5rem', alignItems: 'center', border: 'none', borderRadius: '10px', padding: '0.8rem 1.2rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <UserPlus size={18} />
          Nouveau Prospect
        </button>
      </div>

      {/* Pipeline Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #94a3b8' }}>
          <div className="stat-content">
            <h3>Total Leads</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-content">
            <h3>Nouveau</h3>
            <p className="stat-number">{stats.new}</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-content">
            <h3>En discussion</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-content">
            <h3>Projets Gagnés</h3>
            <p className="stat-number">{stats.closedWon}</p>
          </div>
        </div>
      </div>

      {/* CRM Actions & Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none', fontSize: '15px' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none', background: 'white', fontSize: '15px', minWidth: '160px' }}
        >
          <option value="Tous">Tous les statuts</option>
          <option value="Nouveau">Nouveaux</option>
          <option value="En cours">En cours</option>
          <option value="Clôturé">Clôturés / Gagnés</option>
        </select>
      </div>

      {/* CRM Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Leads Table Card */}
        <div className="detail-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Chargement des opportunités...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Aucun prospect trouvé correspondant aux critères.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>CLIENT / LEAD</th>
                  <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>PROJET / BUDGET</th>
                  <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>STATUT</th>
                  <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr 
                    key={lead.id} 
                    onClick={() => {
                      setSelectedLead(lead);
                      setNotes(lead.message || '');
                      setEditingNotesLeadId(null);
                    }}
                    style={{ 
                      borderBottom: '1px solid #f1f5f9', 
                      cursor: 'pointer',
                      background: selectedLead?.id === lead.id ? '#f8fafc' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    className="crm-row"
                  >
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px' }}>{lead.name}</strong>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={12} /> {lead.email}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <span style={{ display: 'block', color: '#334155', fontWeight: '500', fontSize: '14px' }}>
                        {lead.project_type || 'Devis standard'}
                      </span>
                      {lead.budget && (
                        <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>
                          💰 {lead.budget} {lead.currency || '€'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: lead.status === 'Nouveau' ? '#fee2e2' : lead.status === 'En cours' ? '#fef3c7' : '#d1fae5',
                        color: lead.status === 'Nouveau' ? '#991b1b' : lead.status === 'En cours' ? '#92400e' : '#065f46'
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 0.5rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      >
                        <option value="Nouveau">Nouveau</option>
                        <option value="En cours">En cours</option>
                        <option value="Clôturé">Clôturé</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Lead Detail / Follow-up Panel Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {selectedLead ? (
            <div className="detail-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Fiche CRM Prospect
                  </span>
                  <h3 style={{ fontSize: '20px', margin: '0.25rem 0 0 0', fontWeight: '800', color: '#0f172a' }}>{selectedLead.name}</h3>
                </div>
                <button 
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  title="Supprimer définitivement"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Status Banner */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Statut de l'opportunité</span>
                  <select
                    value={selectedLead.status}
                    onChange={e => handleUpdateStatus(selectedLead.id, e.target.value)}
                    style={{ padding: '0.35rem 0.60rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '600', background: 'white' }}
                  >
                    <option value="Nouveau">🔴 Nouveau</option>
                    <option value="En cours">🟡 En cours</option>
                    <option value="Clôturé">🟢 Clôturé / Gagné</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '14px' }}>
                  <Mail size={16} color="#64748b" />
                  <a href={`mailto:${selectedLead.email}`} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '14px' }}>
                    <Phone size={16} color="#64748b" />
                    <a href={`tel:${selectedLead.phone}`} style={{ color: '#334155', textDecoration: 'none' }}>{selectedLead.phone}</a>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '14px', color: '#64748b' }}>
                  <Calendar size={16} />
                  <span>Entré le {new Date(selectedLead.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Project Specs */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #bbf7d0', paddingBottom: '0.4rem' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#166534', textTransform: 'uppercase', fontWeight: '700' }}>Besoin estimé</h4>
                  <Link 
                    to="/dashboard/templates" 
                    state={{
                      client_name: selectedLead.name,
                      client_email: selectedLead.email,
                      client_company: selectedLead.company_name || selectedLead.client_type === 'entreprise' ? 'Entreprise' : '',
                      title: selectedLead.project_type || 'Prestation sur-mesure',
                      lead_id: selectedLead.id
                    }}
                    style={{ fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', color: 'white', background: '#FF014F', padding: '0.3rem 0.6rem', borderRadius: '6px' }}
                  >
                    🚀 Créer Devis
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '13px', color: '#14532d' }}>
                  <div><strong>Catégorie :</strong> {selectedLead.project_type || 'Standard'}</div>
                  <div><strong>Délai :</strong> {selectedLead.timeline || 'Non spécifié'}</div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Budget prévu :</strong> {selectedLead.budget ? `${selectedLead.budget} ${selectedLead.currency || '€'}` : 'Non spécifié'}
                  </div>
                </div>
              </div>

              {/* Follow-up Notes Form */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '14px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={16} color="#6366f1" /> Notes & Historique d'Échange
                </h4>
                {editingNotesLeadId === selectedLead.id ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      style={{ width: '100%', minHeight: '120px', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                      placeholder="Ajoutez vos compte-rendus de réunions, retours par mail ou négociations..."
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setEditingNotesLeadId(null)}
                        className="btn-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <X size={14} /> Annuler
                      </button>
                      <button 
                        onClick={handleSaveNotes}
                        disabled={savingNote}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', borderRadius: '6px', background: '#FF014F', color: 'white', cursor: 'pointer' }}
                      >
                        <Check size={14} /> {savingNote ? 'Enregistrement...' : 'Valider'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fafafa', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9', position: 'relative' }}>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {selectedLead.message || 'Aucune note de suivi pour le moment.'}
                    </p>
                    <button
                      onClick={() => {
                        setEditingNotesLeadId(selectedLead.id);
                        setNotes(selectedLead.message || '');
                      }}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}
                      title="Écrire des notes"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="detail-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <Users size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p>Sélectionnez un prospect dans la liste de gauche pour afficher son dossier CRM complet et ajouter des notes de négociation.</p>
            </div>
          )}
        </div>

      </div>

      {/* Manual Prospect Creation Modal */}
      {showAddLeadModal && (
        <div className="modal-overlay" onClick={() => setShowAddLeadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '20px' }}>
              <UserPlus size={22} color="#FF014F" /> Ajouter un lead manuellement
            </h2>
            <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Nom Client *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={newLeadForm.name}
                    onChange={e => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jean@example.com"
                    value={newLeadForm.email}
                    onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Téléphone</label>
                  <input
                    type="text"
                    placeholder="06 12 34 56 78"
                    value={newLeadForm.phone}
                    onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Type de projet</label>
                  <input
                    type="text"
                    placeholder="ex: App Web React"
                    value={newLeadForm.project_type}
                    onChange={e => setNewLeadForm({ ...newLeadForm, project_type: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Budget</label>
                  <input
                    type="text"
                    placeholder="ex: 5000"
                    value={newLeadForm.budget}
                    onChange={e => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Délai</label>
                  <input
                    type="text"
                    placeholder="ex: 1 mois"
                    value={newLeadForm.timeline}
                    onChange={e => setNewLeadForm({ ...newLeadForm, timeline: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Description / Notes de départ</label>
                <textarea
                  placeholder="Détails du projet ou premier contact..."
                  value={newLeadForm.message}
                  onChange={e => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  style={{ padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddLeadModal(false)}>
                  Annuler
                </button>
                <button type="submit" disabled={savingLead} style={{ background: '#FF014F', color: 'white' }}>
                  {savingLead ? 'Création...' : 'Créer le lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
