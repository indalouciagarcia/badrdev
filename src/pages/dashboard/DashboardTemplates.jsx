import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { 
  FileText, Plus, Trash2, Edit, Save, Calculator, CheckCircle, Clock, 
  ChevronRight, ArrowRight, Printer, Mail, Send, Check, X, FilePlus, Loader2
} from 'lucide-react';
import '../Dashboard.css';

export default function DashboardTemplates() {
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(false);

  // States pour les templates/canva types
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // States pour les devis émis/générés
  const [quotes, setQuotes] = useState([]);
  const [editingQuote, setEditingQuote] = useState(null);

  // Formulaire pour créer/modifier un template
  const [templateForm, setTemplateForm] = useState({
    title: '',
    description: '',
    estimated_duration: '1 mois',
    items: [] // [{description: '', unit_price: 0, quantity: 1}]
  });

  // Formulaire pour créer/modifier un devis client réel
  const [quoteForm, setQuoteForm] = useState({
    quote_number: '',
    client_name: '',
    client_email: '',
    client_company: '',
    title: '',
    items: [],
    vat_rate: 20.0,
    status: 'Brouillon',
    validity_date: ''
  });

  const location = useLocation();

  useEffect(() => {
    fetchTemplates();
    fetchQuotes();

    // Si on provient d'une fiche client (CRM / Devis)
    if (location.state && location.state.client_name) {
      setActiveTab('quotes');
      const year = new Date().getFullYear();
      const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setQuoteForm({
        quote_number: `DEV-${year}-${num}`,
        client_name: location.state.client_name,
        client_email: location.state.client_email || '',
        client_company: location.state.client_company || '',
        title: location.state.title || '',
        items: [{ description: 'Prestation de développement sur-mesure', unit_price: 1000, quantity: 1 }],
        vat_rate: 20.0,
        status: 'Brouillon',
        validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lead_id: location.state.lead_id || null
      });
    }
  }, [location.state]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_canvas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (err) {
      console.error('Error fetching quotes:', err);
    }
  };

  // --- LOGIQUE TEMPLATES (CANVAS) ---

  const handleAddTemplateItem = () => {
    setTemplateForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', unit_price: 0, quantity: 1 }]
    }));
  };

  const handleRemoveTemplateItem = (index) => {
    setTemplateForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleTemplateItemChange = (index, field, value) => {
    setTemplateForm(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!templateForm.title) return;

    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('quote_templates')
          .update({
            title: templateForm.title,
            description: templateForm.description,
            estimated_duration: templateForm.estimated_duration,
            items: templateForm.items,
            updated_at: new Date()
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        alert('Modèle (Canva) mis à jour !');
      } else {
        const { error } = await supabase
          .from('quote_templates')
          .insert([{
            title: templateForm.title,
            description: templateForm.description,
            estimated_duration: templateForm.estimated_duration,
            items: templateForm.items
          }]);

        if (error) throw error;
        alert('Nouveau modèle (Canva) créé !');
      }

      setTemplateForm({ title: '', description: '', estimated_duration: '1 mois', items: [] });
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du modèle.');
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Supprimer ce modèle de canva ?')) return;
    try {
      const { error } = await supabase.from('quote_templates').delete().eq('id', id);
      if (error) throw error;
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  // --- LOGIQUE DEVIS CLIENTS (QUOTE CANVAS) ---

  const handleAddQuoteItem = () => {
    setQuoteForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', unit_price: 0, quantity: 1 }]
    }));
  };

  const handleRemoveQuoteItem = (index) => {
    setQuoteForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleQuoteItemChange = (index, field, value) => {
    setQuoteForm(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleLoadTemplateIntoQuote = (tpl) => {
    setQuoteForm(prev => ({
      ...prev,
      title: tpl.title,
      items: tpl.items.map(item => ({ ...item }))
    }));
    alert(`Modèle "${tpl.title}" chargé avec succès dans le devis.`);
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    if (!quoteForm.client_name || !quoteForm.client_email || !quoteForm.title) {
      alert('Veuillez remplir le nom, l\'email et l\'objet du devis.');
      return;
    }

    // Générer un numéro de devis s'il n'y en a pas
    let qNumber = quoteForm.quote_number;
    if (!qNumber) {
      const year = new Date().getFullYear();
      const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      qNumber = `DEV-${year}-${num}`;
    }

    try {
      if (editingQuote) {
        const { error } = await supabase
          .from('quote_canvas')
          .update({
            client_name: quoteForm.client_name,
            client_email: quoteForm.client_email,
            client_company: quoteForm.client_company,
            title: quoteForm.title,
            items: quoteForm.items,
            vat_rate: parseFloat(quoteForm.vat_rate),
            status: quoteForm.status,
            validity_date: quoteForm.validity_date || null,
            lead_id: quoteForm.lead_id || null,
            updated_at: new Date()
          })
          .eq('id', editingQuote.id);

        if (error) throw error;
        alert('Devis mis à jour !');
      } else {
        const { error } = await supabase
          .from('quote_canvas')
          .insert([{
            quote_number: qNumber,
            client_name: quoteForm.client_name,
            client_email: quoteForm.client_email,
            client_company: quoteForm.client_company,
            title: quoteForm.title,
            items: quoteForm.items,
            vat_rate: parseFloat(quoteForm.vat_rate),
            status: quoteForm.status,
            validity_date: quoteForm.validity_date || null,
            lead_id: quoteForm.lead_id || null
          }]);

        if (error) throw error;
        alert('Nouveau devis client généré !');
      }

      // Reset
      setQuoteForm({
        quote_number: '',
        client_name: '',
        client_email: '',
        client_company: '',
        title: '',
        items: [],
        vat_rate: 20.0,
        status: 'Brouillon',
        validity_date: ''
      });
      setEditingQuote(null);
      fetchQuotes();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du devis.');
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!confirm('Voulez-vous supprimer définitivement ce devis ?')) return;
    try {
      const { error } = await supabase.from('quote_canvas').delete().eq('id', id);
      if (error) throw error;
      fetchQuotes();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  const calculateTotals = (items, vatRate) => {
    const ht = items.reduce((sum, item) => sum + (parseFloat(item.unit_price || 0) * parseInt(item.quantity || 1)), 0);
    const tva = ht * (parseFloat(vatRate || 20) / 100);
    const ttc = ht + tva;
    return { ht, tva, ttc };
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>📋 Canva & Générateur de Devis</h1>
          <p>Concevez vos modèles de chiffrage (canvas) et éditez des devis professionnels structurés en quelques clics.</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'templates') {
              setEditingTemplate(null);
              setTemplateForm({ title: '', description: '', estimated_duration: '1 mois', items: [{ description: 'Développement initial', unit_price: 1500, quantity: 1 }] });
            } else {
              setEditingQuote(null);
              const year = new Date().getFullYear();
              const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
              setQuoteForm({
                quote_number: `DEV-${year}-${num}`,
                client_name: '',
                client_email: '',
                client_company: '',
                title: '',
                items: [{ description: 'Conception UI/UX', unit_price: 1000, quantity: 1 }],
                vat_rate: 20.0,
                status: 'Brouillon',
                validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 jours
              });
            }
          }}
          className="btn-primary" 
          style={{ background: '#FF014F', display: 'flex', gap: '0.5rem', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}
        >
          <Plus size={18} />
          <span>Créer un {activeTab === 'templates' ? 'Modèle (Canva)' : 'Nouveau Devis'}</span>
        </button>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('templates')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'templates' ? '2px solid #FF014F' : '2px solid transparent', color: activeTab === 'templates' ? '#FF014F' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FileText size={18} />
          Modèles de Canva ({templates.length})
        </button>
        <button 
          onClick={() => setActiveTab('quotes')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'quotes' ? '2px solid #FF014F' : '2px solid transparent', color: activeTab === 'quotes' ? '#FF014F' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Calculator size={18} />
          Devis Clients Émis ({quotes.length})
        </button>
      </div>

      {/* ===================== TAB : MODÈLES DE CANVA ===================== */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
          
          {/* Liste des Modèles existants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Sélectionnez un modèle</h3>
            {loading ? (
              <p>Chargement des modèles...</p>
            ) : templates.length === 0 ? (
              <p style={{ color: '#64748b' }}>Aucun modèle de canva enregistré.</p>
            ) : (
              templates.map(tpl => (
                <div 
                  key={tpl.id} 
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setTemplateForm({
                      title: tpl.title,
                      description: tpl.description || '',
                      estimated_duration: tpl.estimated_duration || '1 mois',
                      items: tpl.items || []
                    });
                    setEditingTemplate(tpl);
                  }}
                  style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    boxShadow: selectedTemplate?.id === tpl.id ? '0 4px 12px rgba(255, 1, 79, 0.1)' : 'none',
                    borderColor: selectedTemplate?.id === tpl.id ? '#FF014F' : '#e2e8f0',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: '700', fontSize: '15px' }}>{tpl.title}</h4>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(tpl.id);
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '13px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tpl.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}>
                    <span style={{ color: '#8b5cf6' }}>⏱ Durée : {tpl.estimated_duration}</span>
                    <span style={{ color: '#FF014F' }}>
                      💰 {calculateTotals(tpl.items || [], 0).ht.toLocaleString('fr-FR')} € HT
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulaire de Création / Édition de Modèle */}
          <div className="detail-card" style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '700' }}>
              {editingTemplate ? `Modifier le modèle: ${editingTemplate.title}` : 'Créer un nouveau Canva de chiffrage'}
            </h3>
            
            <form onSubmit={handleSaveTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="meta-label">Nom du modèle (ex: Application Web Basique)</label>
                <input 
                  type="text" 
                  className="meta-input"
                  value={templateForm.title}
                  onChange={e => setTemplateForm({ ...templateForm, title: e.target.value })}
                  placeholder="ex: Application Web Mobile hybride"
                  required
                />
              </div>

              <div className="form-group">
                <label className="meta-label">Description du périmètre</label>
                <textarea 
                  className="meta-input"
                  style={{ minHeight: '60px', fontFamily: 'inherit' }}
                  value={templateForm.description}
                  onChange={e => setTemplateForm({ ...templateForm, description: e.target.value })}
                  placeholder="Qu'est-ce qui est inclus par défaut dans ce modèle ?"
                />
              </div>

              <div className="form-group">
                <label className="meta-label">Délai indicatif estimé</label>
                <input 
                  type="text" 
                  className="meta-input"
                  value={templateForm.estimated_duration}
                  onChange={e => setTemplateForm({ ...templateForm, estimated_duration: e.target.value })}
                  placeholder="ex: 1 à 2 mois"
                />
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Lignes d'estimation du Canva</h4>
                  <button 
                    type="button" 
                    onClick={handleAddTemplateItem} 
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Plus size={14} /> Ajouter une ligne
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {templateForm.items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 40px', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Désignation de la tâche"
                        className="meta-input"
                        style={{ padding: '0.5rem' }}
                        value={item.description}
                        onChange={e => handleTemplateItemChange(index, 'description', e.target.value)}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Prix unitaire"
                        className="meta-input"
                        style={{ padding: '0.5rem' }}
                        value={item.unit_price}
                        onChange={e => handleTemplateItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Qte"
                        className="meta-input"
                        style={{ padding: '0.5rem' }}
                        value={item.quantity}
                        onChange={e => handleTemplateItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTemplateItem(index)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {templateForm.items.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                      Aucune ligne budgétaire. Cliquez sur "Ajouter une ligne".
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  Total Estimé : {calculateTotals(templateForm.items, 0).ht.toLocaleString('fr-FR')} € HT
                </span>
                <button type="submit" className="btn-primary" style={{ background: '#FF014F', border: 'none', borderRadius: '8px', color: 'white', padding: '0.6rem 1.2rem', fontWeight: 'bold' }}>
                  <Save size={16} />
                  <span>Enregistrer le Canva</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ===================== TAB : DEVIS CLIENTS ÉMIS ===================== */}
      {activeTab === 'quotes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
          
          {/* Liste des devis émis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Historique des devis générés</h3>
            {quotes.length === 0 ? (
              <p style={{ color: '#64748b' }}>Aucun devis généré pour le moment.</p>
            ) : (
              quotes.map(q => {
                const totals = calculateTotals(q.items || [], q.vat_rate);
                return (
                  <div 
                    key={q.id}
                    onClick={() => {
                      setEditingQuote(q);
                      setQuoteForm({
                        quote_number: q.quote_number,
                        client_name: q.client_name,
                        client_email: q.client_email,
                        client_company: q.client_company || '',
                        title: q.title,
                        items: q.items || [],
                        vat_rate: q.vat_rate,
                        status: q.status,
                        validity_date: q.validity_date || ''
                      });
                    }}
                    style={{
                      background: 'white',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      boxShadow: editingQuote?.id === q.id ? '0 4px 12px rgba(255, 1, 79, 0.1)' : 'none',
                      borderColor: editingQuote?.id === q.id ? '#FF014F' : '#e2e8f0',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#FF014F', letterSpacing: '0.5px' }}>{q.quote_number}</span>
                        <h4 style={{ margin: '0.1rem 0 0.3rem 0', color: '#0f172a', fontWeight: '700', fontSize: '15px' }}>{q.title}</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Définir la fiche active d'abord
                            setEditingQuote(q);
                            setQuoteForm({
                              quote_number: q.quote_number,
                              client_name: q.client_name,
                              client_email: q.client_email,
                              client_company: q.client_company || '',
                              title: q.title,
                              items: q.items || [],
                              vat_rate: q.vat_rate,
                              status: q.status,
                              validity_date: q.validity_date || ''
                            });
                            // Laisser le temps à React de monter le container d'impression puis lancer l'impression
                            setTimeout(() => {
                              window.print();
                            }, 150);
                          }}
                          className="btn-primary"
                          style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '12px', background: '#f1f5f9', color: '#475569', display: 'flex', gap: '0.25rem', alignItems: 'center', boxShadow: 'none' }}
                          title="Imprimer / Exporter en PDF"
                        >
                          <Printer size={13} /> PDF
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuote(q.id);
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: '#475569' }}>
                      Client : <strong>{q.client_name}</strong> {q.client_company && `(${q.client_company})`}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', marginTop: '0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '11px',
                        background: q.status === 'Brouillon' ? '#f1f5f9' : q.status === 'Envoyé' ? '#fef3c7' : q.status === 'Accepté' ? '#d1fae5' : '#fee2e2',
                        color: q.status === 'Brouillon' ? '#475569' : q.status === 'Envoyé' ? '#d97706' : q.status === 'Accepté' ? '#065f46' : '#b91c1c'
                      }}>
                        {q.status}
                      </span>
                      <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '700' }}>
                        TTC : {totals.ttc.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Formulaire d'édition / création de devis client */}
          <div className="detail-card" style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '700' }}>
              {editingQuote ? `Édition Devis : ${editingQuote.quote_number}` : 'Générer un Devis Client'}
            </h3>

            {/* Quick Loader from template */}
            {!editingQuote && templates.length > 0 && (
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '0.4rem' }}>Pré-charger depuis un Canva type :</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {templates.map(tpl => (
                    <button 
                      key={tpl.id}
                      type="button"
                      onClick={() => handleLoadTemplateIntoQuote(tpl)}
                      style={{ padding: '0.4rem 0.6rem', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveQuote} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="meta-label">Nom du Client *</label>
                  <input 
                    type="text" 
                    className="meta-input"
                    value={quoteForm.client_name}
                    onChange={e => setQuoteForm({ ...quoteForm, client_name: e.target.value })}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="meta-label">Email de contact *</label>
                  <input 
                    type="email" 
                    className="meta-input"
                    value={quoteForm.client_email}
                    onChange={e => setQuoteForm({ ...quoteForm, client_email: e.target.value })}
                    placeholder="jean@client.com"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="meta-label">Entreprise / Organisation</label>
                  <input 
                    type="text" 
                    className="meta-input"
                    value={quoteForm.client_company}
                    onChange={e => setQuoteForm({ ...quoteForm, client_company: e.target.value })}
                    placeholder="ex: SAS Digitale"
                  />
                </div>
                <div className="form-group">
                  <label className="meta-label">Objet du devis *</label>
                  <input 
                    type="text" 
                    className="meta-input"
                    value={quoteForm.title}
                    onChange={e => setQuoteForm({ ...quoteForm, title: e.target.value })}
                    placeholder="ex: Création application mobile iOS & Android"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="meta-label">Date limite de validité</label>
                  <input 
                    type="date" 
                    className="meta-input"
                    value={quoteForm.validity_date}
                    onChange={e => setQuoteForm({ ...quoteForm, validity_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="meta-label">Taux de TVA (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="meta-input"
                    value={quoteForm.vat_rate}
                    onChange={e => setQuoteForm({ ...quoteForm, vat_rate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label className="meta-label">Statut</label>
                  <select 
                    className="meta-input"
                    value={quoteForm.status}
                    onChange={e => setQuoteForm({ ...quoteForm, status: e.target.value })}
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Envoyé">Envoyé</option>
                    <option value="Accepté">Accepté</option>
                    <option value="Refusé">Refusé</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Prestations / Lignes du devis</h4>
                  <button 
                    type="button" 
                    onClick={handleAddQuoteItem} 
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    + Ajouter une ligne
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {quoteForm.items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 70px 40px', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Libellé prestation"
                        className="meta-input"
                        style={{ padding: '0.5rem' }}
                        value={item.description}
                        onChange={e => handleQuoteItemChange(index, 'description', e.target.value)}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="PU HT"
                        className="meta-input"
                        style={{ padding: '0.5rem' }}
                        value={item.unit_price}
                        onChange={e => handleQuoteItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Qte"
                        className="meta-input"
                        style={{ padding: '0.5rem' }}
                        value={item.quantity}
                        onChange={e => handleQuoteItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveQuoteItem(index)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total calculations display */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>Total HT :</span>
                  <strong>{calculateTotals(quoteForm.items, quoteForm.vat_rate).ht.toLocaleString('fr-FR')} €</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>TVA ({quoteForm.vat_rate}%) :</span>
                  <span>{calculateTotals(quoteForm.items, quoteForm.vat_rate).tva.toLocaleString('fr-FR')} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', color: '#FF014F' }}>
                  <span>Total TTC :</span>
                  <span>{calculateTotals(quoteForm.items, quoteForm.vat_rate).ttc.toLocaleString('fr-FR')} €</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ background: '#FF014F', border: 'none', borderRadius: '8px', color: 'white', padding: '0.75rem 1.5rem', fontWeight: 'bold', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Save size={18} />
                  <span>Enregistrer le Devis</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* Hidden printable invoice container */}
      <div id="invoice-print-area" className="print-only" style={{ padding: '2.5rem', fontFamily: 'Arial, sans-serif', color: '#1e293b', background: '#ffffff', minHeight: '297mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #FF014F', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF014F', margin: '0 0 0.5rem 0' }}>BADR BELABBES</h1>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '13px', color: '#64748b' }}>Développeur d'applications Web & Mobiles</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>badr.belabbes.pro@gmail.com</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>DEVIS</h2>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '13px' }}><strong>N° :</strong> {quoteForm.quote_number || 'DEV-TEMP'}</p>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '13px' }}><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
            {quoteForm.validity_date && <p style={{ margin: 0, fontSize: '13px' }}><strong>Validité :</strong> {new Date(quoteForm.validity_date).toLocaleDateString('fr-FR')}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem' }}>PRESTATAIRE</h3>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '14px', fontWeight: 'bold' }}>Badr Belabbes</p>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '13px' }}>Rabat, Maroc</p>
            <p style={{ margin: 0, fontSize: '13px' }}>Contact : badr.belabbes.pro@gmail.com</p>
          </div>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem' }}>CLIENT</h3>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '14px', fontWeight: 'bold' }}>{quoteForm.client_name || 'Client'}</p>
            {quoteForm.client_company && <p style={{ margin: '0 0 0.25rem 0', fontSize: '13px' }}><strong>Entreprise :</strong> {quoteForm.client_company}</p>}
            <p style={{ margin: 0, fontSize: '13px' }}><strong>Email :</strong> {quoteForm.client_email || '-'}</p>
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '1rem' }}>Objet : {quoteForm.title || '-'}</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>DESIGNATION DES PRESTATIONS</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', width: '100px' }}>P.U. HT</th>
              <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', width: '60px' }}>QTE</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', width: '120px' }}>TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {(quoteForm.items || []).map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem', textAlign: 'left', whiteSpace: 'pre-wrap' }}>{item.description}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>{parseFloat(item.unit_price || 0).toLocaleString('fr-FR')} €</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>{(parseFloat(item.unit_price || 0) * parseInt(item.quantity || 1)).toLocaleString('fr-FR')} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
              <span>Total Hors Taxes (HT) :</span>
              <strong>{calculateTotals(quoteForm.items || [], quoteForm.vat_rate).ht.toLocaleString('fr-FR')} €</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
              <span>TVA ({quoteForm.vat_rate}%) :</span>
              <span>{calculateTotals(quoteForm.items || [], quoteForm.vat_rate).tva.toLocaleString('fr-FR')} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', color: '#FF014F', paddingTop: '0.25rem' }}>
              <span>Total Toutes Taxes Comprises (TTC) :</span>
              <span>{calculateTotals(quoteForm.items || [], quoteForm.vat_rate).ttc.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
          <p style={{ margin: '0 0 0.25rem 0' }}>Ce devis est établi conformément aux conditions générales de services de Badr Belabbes.</p>
          <p style={{ margin: 0 }}>Merci pour votre confiance !</p>
        </div>
      </div>

      <style>{`
        .print-only {
          display: none;
        }
        @media print {
          body, html, #root, .dashboard-layout, .dashboard-main, main, .dashboard-page {
            background: #ffffff !important;
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            height: auto !important;
          }
          .dashboard-layout, .dashboard-sidebar, .dashboard-main, .dashboard-page, .tabs, .detail-card, button, form, header, footer {
            display: none !important;
          }
          #invoice-print-area {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #invoice-print-area * {
            display: block !important;
            visibility: visible !important;
          }
          #invoice-print-area table {
            display: table !important;
            width: 100% !important;
          }
          #invoice-print-area thead {
            display: table-header-group !important;
          }
          #invoice-print-area tbody {
            display: table-row-group !important;
          }
          #invoice-print-area tr {
            display: table-row !important;
          }
          #invoice-print-area th, #invoice-print-area td {
            display: table-cell !important;
          }
        }
      `}</style>
    </div>
  );
}
