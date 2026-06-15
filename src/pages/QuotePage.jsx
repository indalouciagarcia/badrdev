import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { CheckCircle, FileText, Download, Loader2, User, Mail, Phone, Briefcase, DollarSign, Clock, MessageSquare, Shield, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb.jsx';

/* =====================================================
   CHARTE COULEUR DU SITE (style.css)
   --color-primary: #FF014F
   --color-secondary: #060606
   --color-heading: #ffffff
   --color-body: #9f9f9f
   --color-card: #1b1b1c
   --color-dark: #1d1d1d
   H1=60px / H2=36px / H3=27px / body-b2=18px / b3=22px
 ===================================================== */

const C = {
  primary:     '#FF014F',
  primaryHover:'#cc003d',
  secondary:   '#f4f5f7',   // fond page : gris très clair
  card:        '#ffffff',   // carte : blanc
  dark:        '#f8f9fb',   // inputs : blanc cassé
  heading:     '#1e293b',   // titres : noir ardoise
  body:        '#475569',   // corps : gris foncé ardoise
  border:      'rgba(0,0,0,0.08)',
  borderLight: 'rgba(0,0,0,0.04)',
  success:     '#10b981',
};

const styles = {
  page: {
    padding: '80px 0 120px',
    background: C.secondary,
    minHeight: '80vh',
  },
  card: {
    background: C.card,
    borderRadius: '28px',
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    boxShadow: '0 30px 80px rgba(0,0,0,0.08)',
  },
  header: {
    background: `linear-gradient(135deg, ${C.primary} 0%, #c2003d 100%)`,
    padding: '4rem 4rem',
    position: 'relative',
    overflow: 'hidden',
    color: '#ffffff',
  },
  headerDecor1: {
    position: 'absolute', top: '-50px', right: '-50px',
    width: '200px', height: '200px',
    background: 'rgba(255,255,255,0.07)', borderRadius: '50%',
  },
  headerDecor2: {
    position: 'absolute', bottom: '-60px', right: '120px',
    width: '140px', height: '140px',
    background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
  },
  headerIcon: {
    width: '64px', height: '64px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '18px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  headerTitle: {
    fontSize: '3.2rem',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 1rem',
    lineHeight: '1.15',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    fontSize: '1.35rem',
    color: 'rgba(255,255,255,0.85)',
    margin: 0,
    lineHeight: '1.7',
    fontWeight: '400',
  },
  body: {
    padding: '4rem 4rem',
  },
  sectionLabel: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  label: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: C.heading,
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: C.body,
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    padding: '1.5rem 1.75rem 1.5rem 4.5rem',
    borderWidth: '2.5px',
    borderStyle: 'solid',
    borderColor: C.border,
    borderRadius: '50px',
    fontSize: '1.55rem',
    color: C.heading,
    background: C.dark,
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
  },
  inputFocus: {
    borderColor: C.primary,
    background: '#ffffff',
    boxShadow: `0 0 0 5px rgba(255, 1, 79, 0.12)`,
  },
  inputError: {
    borderColor: '#ef4444',
    background: '#fff5f5',
  },
  select: {
    width: '100%',
    padding: '1.5rem 1.75rem 1.5rem 4.5rem',
    borderWidth: '2.5px',
    borderStyle: 'solid',
    borderColor: C.border,
    borderRadius: '50px',
    fontSize: '1.55rem',
    color: C.heading,
    background: C.dark,
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  textarea: {
    width: '100%',
    padding: '1.75rem 2rem',
    borderWidth: '2.5px',
    borderStyle: 'solid',
    borderColor: C.border,
    borderRadius: '28px',
    fontSize: '1.55rem',
    color: C.heading,
    background: C.dark,
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    minHeight: '180px',
    lineHeight: '1.8',
  },
  errorText: {
    color: '#e00040',
    fontSize: '1.1rem',
    marginTop: '0.45rem',
    paddingLeft: '0.5rem',
    fontWeight: '600'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.25rem',
    background: 'rgba(255,1,79,0.06)',
    borderWidth: '2.5px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,1,79,0.15)',
    borderRadius: '24px',
    padding: '1.75rem 2rem',
    cursor: 'pointer',
  },
  checkboxInput: {
    marginTop: '6px',
    width: '24px',
    height: '24px',
    accentColor: C.primary,
    flexShrink: 0,
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '1.45rem',
    color: C.body,
    lineHeight: '1.7',
  },
  footer: {
    padding: '3rem 4rem 4rem',
    background: '#f4f5f7',
    borderTop: `1px solid ${C.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  btnNext: {
    background: C.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    padding: '1.5rem 3.5rem',
    fontSize: '1.45rem',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    boxShadow: `0 10px 35px rgba(255, 1, 79, 0.4)`,
    transition: 'all 0.2s ease',
  },
  btnPrev: {
    background: '#ffffff',
    color: C.heading,
    border: `2.5px solid ${C.border}`,
    borderRadius: '50px',
    padding: '1.5rem 3.5rem',
    fontSize: '1.45rem',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    transition: 'all 0.2s ease',
  },
  stepIndicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    marginBottom: '2.5rem',
  },
  stepIndicator: (active, completed) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: active ? C.primary : completed ? C.success : '#cbd5e1',
    transition: 'all 0.3s ease',
    transform: active ? 'scale(1.2)' : 'none',
  })
};

function InputField({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false);
  const inputStyle = {
    ...styles.input,
    ...(focused ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
  };
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: C.primary }}>*</span>}
      </label>
      <div style={styles.inputWrap}>
        {Icon && <span style={styles.inputIcon}><Icon size={20} /></span>}
        <input type={type} name={name} style={{...inputStyle, paddingLeft: Icon ? '4rem' : '1.5rem'}} placeholder={placeholder}
          value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </div>
      {error && <span style={styles.errorText}>⚠ {error}</span>}
    </div>
  );
}

function SelectField({ icon: Icon, label, name, options, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false);
  const selectStyle = {
    ...styles.select,
    ...(focused ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
  };
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: C.primary }}>*</span>}
      </label>
      <div style={styles.inputWrap}>
        {Icon && <span style={styles.inputIcon}><Icon size={20} /></span>}
        <select name={name} style={{...selectStyle, paddingLeft: Icon ? '4rem' : '1.5rem'}} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <option value="">Sélectionnez...</option>
          {options.map(opt => (
            <option key={opt.value || opt.id || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      </div>
      {error && <span style={styles.errorText}>⚠ {error}</span>}
    </div>
  );
}

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [activeAnim, setActiveAnim] = useState(true);

  // Form states matching client requirements
  const [formData, setFormData] = useState({
    // Étape 1 : Identité Client
    client_type: 'entreprise', // entreprise / particulier
    company_type: '', // EURL, SARL, SAS, micro-entreprise, association, startup, grand groupe...
    company_size: '', // 1-10, 11-50, 51-250, >250
    company_revenue: '', // budget / CA
    sector: '', // commerce, sante, education, logistique, services...
    location: '', // pays, région
    siret: '', // SIRET / TVA optionnel
    name: '', // contact principal
    role: '', // fonction
    phone: '',
    email: '',

    // Étape 2 : Contexte
    project_objective: '',
    message: '',

    // Étape 3 : Spécification Application
    app_type: '', // web, mobile, hybride
    has_design: '', // oui, non, a concevoir
    features_auth: false,
    features_payment: false,
    features_chat: false,
    features_map: false,
    features_dashboard: false,

    // Étape 4 : Technique & Déploiement
    tech_requirements: '', // BD, API, hebergement
    deployment_need: '', // stores, serveur, en ligne
    maintenance_need: '', // support post-deploiement

    // Étape 5 : Budget & Délais
    budget: '',
    timeline: '',
    accepted: false
  });

  const [errors, setErrors] = useState({});
  const [dbOptions, setDbOptions] = useState({
    project_types: [],
    budgets: [],
    timelines: []
  });

  useEffect(() => {
    async function loadFormOptions() {
      try {
        const { data, error } = await supabase.from('quote_options').select('*');
        if (!error && data) {
          setDbOptions({
            project_types: data.filter(o => o.category === 'project_type').map(o => o.label),
            budgets: data.filter(o => o.category === 'budget').map(o => ({ value: o.label, label: o.label })),
            timelines: data.filter(o => o.category === 'timeline').map(o => o.label)
          });
        }
      } catch (err) {
        console.error('Error loading quote options:', err);
      }
    }
    loadFormOptions();
  }, []);

  useEffect(() => {
    // Reset animation key on step change
    setActiveAnim(false);
    const t = setTimeout(() => setActiveAnim(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  const handleChange = (ev) => {
    const { name, value, type, checked } = ev.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const nextStep = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.name.trim()) errs.name = 'Le nom du contact principal est obligatoire';
      if (!formData.email.trim()) errs.email = 'L\'email est obligatoire';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Format d\'email invalide';
      if (!formData.phone.trim()) errs.phone = 'Le numéro de téléphone est requis';
      if (!formData.location.trim()) errs.location = 'La localisation est requise';
      if (formData.client_type === 'entreprise') {
        if (!formData.company_type) errs.company_type = 'Sélectionnez un type d\'entreprise';
        if (!formData.company_size) errs.company_size = 'Sélectionnez la taille de l\'entreprise';
        if (!formData.sector) errs.sector = 'Sélectionnez un secteur d\'activité';
      }
    } else if (step === 2) {
      if (!formData.message.trim()) errs.message = 'La description du projet est requise';
      else if (formData.message.length < 20) errs.message = 'Veuillez rédiger au moins 20 caractères';
    } else if (step === 3) {
      if (!formData.app_type) errs.app_type = 'Veuillez sélectionner un type d\'application';
      if (!formData.has_design) errs.has_design = 'Veuillez préciser votre situation graphique';
    } else if (step === 4) {
      if (!formData.tech_requirements) errs.tech_requirements = 'Précisez les exigences techniques';
      if (!formData.deployment_need) errs.deployment_need = 'Précisez le type de déploiement';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!formData.accepted) {
      setErrors({ accepted: 'Vous devez accepter les conditions pour continuer' });
      return;
    }

    setLoading(true);
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const qn = `DEV-${year}-${num}`;

    // Construire le message descriptif complet intégrant toutes les informations qualificatives
    const formattedFeatures = [
      formData.features_auth && 'Authentification',
      formData.features_payment && 'Paiement en ligne',
      formData.features_chat && 'Messagerie instantanée',
      formData.features_map && 'Cartographie/Géolocalisation',
      formData.features_dashboard && 'Tableau de bord admin'
    ].filter(Boolean).join(', ') || 'Aucune spécifiée';

    const fullMessage = `
--- IDENTITÉ DU CLIENT ---
Statut : ${formData.client_type === 'entreprise' ? 'Entreprise' : 'Particulier'}
Type d'entreprise : ${formData.company_type || 'N/A'}
Taille (salariés) : ${formData.company_size || 'N/A'}
Secteur d'activité : ${formData.sector || 'N/A'}
Localisation : ${formData.location}
SIRET / TVA : ${formData.siret || 'N/A'}
Fonction du contact : ${formData.role || 'N/A'}

--- DÉTAILS DE L'APPLICATION ---
Type d'application : ${formData.app_type}
Design / Charte graphique : ${formData.has_design}
Fonctionnalités clés : ${formattedFeatures}
Objectifs du projet : ${formData.project_objective || 'Non spécifiés'}

--- EXIGENCES TECHNIQUES & DÉPLOIEMENT ---
Besoins techniques (BD, API...) : ${formData.tech_requirements}
Déploiement (serveurs/stores) : ${formData.deployment_need}
Maintenance souhaitée : ${formData.maintenance_need || 'Non spécifiée'}

--- DESCRIPTION DU PROJET ---
${formData.message}
`;

    try {
      // 1. Tenter d'insérer dans la structure de table complète (si migration v2 appliquée)
      const payload = {
        quote_number: qn,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.app_type,
        budget: formData.budget,
        timeline: formData.timeline,
        currency: 'EUR',
        status: 'Nouveau',
        message: fullMessage,
        // Colonnes spécifiques qualification
        client_type: formData.client_type,
        company_type: formData.company_type || null,
        company_size: formData.company_size || null,
        sector: formData.sector || null,
        location: formData.location,
        contact_role: formData.role || null,
        siret: formData.siret || null,
        app_type: formData.app_type,
        features: formattedFeatures,
        has_design: formData.has_design,
        tech_requirements: formData.tech_requirements,
        deployment_need: formData.deployment_need,
        maintenance_need: formData.maintenance_need || null
      };

      let { error } = await supabase.from('quote_requests').insert([payload]);

      // 2. Si échec lié à des colonnes manquantes (erreur PostgREST ou code inconnu), replier sur l'ancienne structure de base
      if (error) {
        console.warn('Advanced schema columns missing, falling back to legacy schema insertion...', error);
        
        const legacyPayload = {
          quote_number: qn,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.app_type,
          budget: formData.budget,
          timeline: formData.timeline,
          currency: 'EUR',
          status: 'Nouveau',
          message: fullMessage
        };

        const fallbackRes = await supabase.from('quote_requests').insert([legacyPayload]);
        if (fallbackRes.error) throw fallbackRes.error;
      }

      setQuoteNumber(qn);
      setStep(6); // Success page
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Demander un devis" />

      <div style={styles.page}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-11">

              {step < 6 ? (
                <div style={styles.card}>
                  
                  {/* Header */}
                  <div style={styles.header}>
                    <div style={styles.headerDecor1} />
                    <div style={styles.headerDecor2} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={styles.headerIcon}>
                        <FileText size={30} color="white" />
                      </div>
                      <h1 style={styles.headerTitle}>Estimez votre projet sur-mesure</h1>
                      <p style={styles.headerSubtitle}>
                        Formulaire de qualification client — Étape {step} sur 5
                      </p>
                    </div>
                  </div>

                  {/* Step Indicators */}
                  <div style={{ padding: '2rem 4rem 0' }}>
                    <div style={styles.stepIndicatorContainer}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} style={styles.stepIndicator(step === s, step > s)} />
                      ))}
                    </div>
                  </div>

                  {/* Form Step Body */}
                  <div style={styles.body} className={activeAnim ? 'animate-step' : ''}>
                    
                    {/* ÉTAPE 1 : IDENTITÉ CLIENT */}
                    {step === 1 && (
                      <div>
                        <p style={styles.sectionLabel}><User size={16} /> Chapitre 1 : Qui êtes-vous ?</p>
                        
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Vous êtes :</label>
                          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                            <label style={{ ...styles.checkboxGroup, flex: 1, background: formData.client_type === 'entreprise' ? 'rgba(255, 1, 79, 0.08)' : 'transparent', borderColor: formData.client_type === 'entreprise' ? C.primary : C.border }}>
                              <input type="radio" name="client_type" value="entreprise" checked={formData.client_type === 'entreprise'} onChange={handleChange} style={styles.checkboxInput} />
                              <span style={styles.checkboxLabel}>
                                <strong>Une entreprise / startup / marque</strong>
                                <span style={{ display: 'block', fontSize: '0.95rem', color: '#64748b', marginTop: '0.2rem' }}>SAS, SARL, startup, association, collectivité, etc.</span>
                              </span>
                            </label>
                            
                            <label style={{ ...styles.checkboxGroup, flex: 1, background: formData.client_type === 'particulier' ? 'rgba(255, 1, 79, 0.08)' : 'transparent', borderColor: formData.client_type === 'particulier' ? C.primary : C.border }}>
                              <input type="radio" name="client_type" value="particulier" checked={formData.client_type === 'particulier'} onChange={handleChange} style={styles.checkboxInput} />
                              <span style={styles.checkboxLabel}>
                                <strong>Un particulier</strong>
                                <span style={{ display: 'block', fontSize: '0.95rem', color: '#64748b', marginTop: '0.2rem' }}>Porteur de projet individuel, freelance, idée personnelle.</span>
                              </span>
                            </label>
                          </div>
                        </div>

                        {formData.client_type === 'entreprise' && (
                          <div style={styles.grid2}>
                            <SelectField 
                              label="Type de structure" 
                              name="company_type" 
                              options={['SAS', 'SARL', 'EURL', 'Micro-entreprise', 'Association', 'Startup', 'Grand Groupe', 'Collectivité']} 
                              value={formData.company_type} 
                              onChange={handleChange} 
                              error={errors.company_type} 
                              required 
                            />
                            <SelectField 
                              label="Taille de l'entreprise" 
                              name="company_size" 
                              options={['1 - 10 salariés', '11 - 50 salariés', '51 - 250 salariés', 'Plus de 250 salariés']} 
                              value={formData.company_size} 
                              onChange={handleChange} 
                              error={errors.company_size} 
                              required 
                            />
                          </div>
                        )}

                        {formData.client_type === 'entreprise' && (
                          <div style={styles.grid2}>
                            <SelectField 
                              label="Secteur d'activité" 
                              name="sector" 
                              options={['Commerce & E-commerce', 'Santé & Bien-être', 'Éducation & Formation', 'Logistique & Transport', 'Services & Conseil', 'Sport & Football', 'Autre']} 
                              value={formData.sector} 
                              onChange={handleChange} 
                              error={errors.sector} 
                              required 
                            />
                            <InputField 
                              label="Numéro SIRET / TVA (Optionnel)" 
                              name="siret" 
                              placeholder="ex: 123 456 789 00001" 
                              value={formData.siret} 
                              onChange={handleChange} 
                            />
                          </div>
                        )}

                        <div style={styles.grid2}>
                          <InputField label="Contact principal (Nom complet)" name="name" icon={User} placeholder="ex: Jean Dupont" value={formData.name} onChange={handleChange} error={errors.name} required />
                          <InputField label="Fonction / Rôle" name="role" placeholder="ex: CEO, Directeur Technique, Particulier..." value={formData.role} onChange={handleChange} />
                        </div>

                        <div style={styles.grid2}>
                          <InputField label="Email professionnel" name="email" type="email" icon={Mail} placeholder="jean@entreprise.com" value={formData.email} onChange={handleChange} error={errors.email} required />
                          <InputField label="Téléphone de contact" name="phone" type="tel" icon={Phone} placeholder="ex: 06 12 34 56 78" value={formData.phone} onChange={handleChange} error={errors.phone} required />
                        </div>

                        <InputField label="Lieu / Localisation (Pays, Ville)" name="location" placeholder="ex: France, Paris" value={formData.location} onChange={handleChange} error={errors.location} required />
                      </div>
                    )}

                    {/* ÉTAPE 2 : CONTEXTE ET OBJECTIFS */}
                    {step === 2 && (
                      <div>
                        <p style={styles.sectionLabel}><Briefcase size={16} /> Chapitre 2 : Contexte & Objectifs du projet</p>
                        
                        <div style={styles.formGroup}>
                          <InputField 
                            label="Objectif principal du projet" 
                            name="project_objective" 
                            placeholder="ex: Augmenter les ventes en ligne, automatiser la saisie des stocks..." 
                            value={formData.project_objective} 
                            onChange={handleChange} 
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Description globale de votre besoin <span style={{ color: C.primary }}>*</span></label>
                          <textarea
                            name="message"
                            style={errors.message ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
                            placeholder="Expliquez en quelques lignes votre idée, le problème que vous souhaitez résoudre, et les bénéfices attendus (min. 20 caractères)..."
                            value={formData.message}
                            onChange={handleChange}
                          />
                          {errors.message && <span style={styles.errorText}>⚠ {errors.message}</span>}
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 3 : SPÉCIFICATIONS TECHNIQUES & DESIGN */}
                    {step === 3 && (
                      <div>
                        <p style={styles.sectionLabel}><HelpCircle size={16} /> Chapitre 3 : Type d'application & Maquettes</p>

                        <div style={styles.grid2}>
                          <SelectField 
                            label="Type d'application souhaité" 
                            name="app_type" 
                            options={dbOptions.project_types.length > 0 ? dbOptions.project_types : ['Application Web (SaaS, Portail)', 'Application Mobile (iOS & Android)', 'Application Hybride (React Native, Flutter)', 'Site Web / E-commerce', 'Autre besoin technique']} 
                            value={formData.app_type} 
                            onChange={handleChange} 
                            error={errors.app_type}
                            required 
                          />

                          <SelectField 
                            label="Design & Charte graphique" 
                            name="has_design" 
                            options={['J\'ai déjà une charte graphique et des maquettes Figma', 'J\'ai un logo/charte mais pas de maquettes', 'Je n\'ai rien, tout est à concevoir (du logo au design UI/UX)']} 
                            value={formData.has_design} 
                            onChange={handleChange} 
                            error={errors.has_design}
                            required 
                          />
                        </div>

                        <div style={{ ...styles.formGroup, marginTop: '2rem' }}>
                          <label style={styles.label}>Fonctionnalités clés attendues (cochez ce qui s'applique) :</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}>
                              <input type="checkbox" name="features_auth" checked={formData.features_auth} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: C.primary }} />
                              <span>Authentification (Inscription/Connexion)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}>
                              <input type="checkbox" name="features_payment" checked={formData.features_payment} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: C.primary }} />
                              <span>Paiement en ligne sécurisé (Stripe/PayPal)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}>
                              <input type="checkbox" name="features_chat" checked={formData.features_chat} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: C.primary }} />
                              <span>Messagerie instantanée / Chat</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}>
                              <input type="checkbox" name="features_map" checked={formData.features_map} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: C.primary }} />
                              <span>Cartographie & Géolocalisation</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}>
                              <input type="checkbox" name="features_dashboard" checked={formData.features_dashboard} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: C.primary }} />
                              <span>Tableau de bord administrateur (Statistiques)</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 4 : TECHNIQUE & DÉPLOIEMENT */}
                    {step === 4 && (
                      <div>
                        <p style={styles.sectionLabel}><Shield size={16} /> Chapitre 4 : Technique & Déploiement</p>

                        <div style={styles.formGroup}>
                          <SelectField 
                            label="Exigences techniques (Hébergement souhaité)" 
                            name="tech_requirements" 
                            options={['Cloud managé (Vercel, Netlify, Supabase)', 'Serveur dédié ou VPS (AWS, GCP, OVH)', 'Pas de préférence technique (clé en main)']} 
                            value={formData.tech_requirements} 
                            onChange={handleChange} 
                            error={errors.tech_requirements}
                            required 
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <SelectField 
                            label="Déploiement attendu" 
                            name="deployment_need" 
                            options={['Publication sur les Stores (App Store, Google Play)', 'Mise en ligne serveur web (production)', 'Livraison du code source brut uniquement']} 
                            value={formData.deployment_need} 
                            onChange={handleChange} 
                            error={errors.deployment_need}
                            required 
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <SelectField 
                            label="Besoin de maintenance post-déploiement" 
                            name="maintenance_need" 
                            options={['Support technique mensuel (garantie, mises à jour)', 'Garantie de livraison simple (correctif de bugs initial)', 'Pas de maintenance requise dans l\'immédiat']} 
                            value={formData.maintenance_need} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 5 : BUDGET ET DÉLAIS */}
                    {step === 5 && (
                      <div>
                        <p style={styles.sectionLabel}><DollarSign size={16} /> Chapitre 5 : Budget & Délais du projet</p>

                        <div style={styles.grid2}>
                          <SelectField 
                            label="Budget global alloué" 
                            name="budget" 
                            options={dbOptions.budgets.length > 0 ? dbOptions.budgets : [
                              { value: 'Moins de 3 000€', label: 'Moins de 3 000 €' },
                              { value: '3 000€ – 8 000€', label: '3 000 € – 8 000 €' },
                              { value: '8 000€ – 15 000€', label: '8 000 € – 15 000 €' },
                              { value: '15 000€ – 30 000€', label: '15 000 € – 30 000 €' },
                              { value: 'Plus de 30 000€', label: 'Plus de 30 000 €' }
                            ]} 
                            value={formData.budget} 
                            onChange={handleChange} 
                            error={errors.budget}
                            required 
                          />

                          <SelectField 
                            label="Délai souhaité" 
                            name="timeline" 
                            options={dbOptions.timelines.length > 0 ? dbOptions.timelines : [
                              { value: '⚡ Urgent (< 2 semaines)', label: '⚡ Urgent (< 2 semaines)' },
                              { value: '📅 Normal (1–2 mois)', label: '📅 Normal (1–2 mois)' },
                              { value: 'Flexible (3 mois+)', label: 'Flexible (3 mois+)' }
                            ]} 
                            value={formData.timeline} 
                            onChange={handleChange} 
                            error={errors.timeline}
                            required 
                          />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                          <label style={styles.checkboxGroup}>
                            <input type="checkbox" name="accepted" style={styles.checkboxInput}
                              checked={formData.accepted} onChange={handleChange} />
                            <span style={styles.checkboxLabel}>
                              J'accepte d'être recontacté par Badr Belabbes concernant mon projet et je consens au traitement de mes données personnelles.{' '}
                              <span style={{ color: C.primary }}>*</span>
                            </span>
                          </label>
                          {errors.accepted && (
                            <span style={{ ...styles.errorText, display: 'block', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                              ⚠ {errors.accepted}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Wizard Navigation Footer */}
                  <div style={styles.footer}>
                    {step > 1 ? (
                      <button type="button" onClick={prevStep} style={styles.btnPrev}>
                        <ArrowLeft size={18} />
                        Retour
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 5 ? (
                      <button type="button" onClick={nextStep} style={styles.btnNext}>
                        Suivant
                        <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button type="button" onClick={handleSubmit} style={styles.btnNext} disabled={loading}>
                        {loading ? (
                          <><Loader2 size={18} className="spin" /> Traitement...</>
                        ) : (
                          <><CheckCircle size={18} /> Envoyer ma demande</>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                /* SUCCESS STATE */
                <div style={{ ...styles.card, textAlign: 'center' }}>
                  <div style={{ ...styles.header, background: `linear-gradient(135deg, #059669 0%, #10b981 100%)` }}>
                    <div style={styles.headerDecor1} /><div style={styles.headerDecor2} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ ...styles.headerIcon, margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={30} color="white" />
                      </div>
                      <h1 style={{ ...styles.headerTitle, fontSize: '2.5rem' }}>Demande enregistrée !</h1>
                      <p style={styles.headerSubtitle}>
                        Votre qualification de devis a bien été reçue. Je vous recontacte sous 48h ouvrées.
                      </p>
                    </div>
                  </div>

                  <div style={styles.body}>
                    <div style={{
                      background: 'rgba(255,1,79,0.08)',
                      borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(255,1,79,0.25)',
                      borderRadius: '20px', padding: '2.5rem', marginBottom: '2.5rem'
                    }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: C.primary, textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 0.75rem' }}>
                        Référence de votre dossier
                      </p>
                      <p style={{ fontSize: '2.75rem', fontWeight: '900', color: C.heading, margin: 0, letterSpacing: '3px' }}>
                        {quoteNumber}
                      </p>
                      <p style={{ color: C.body, margin: '0.75rem 0 0', fontSize: '1.05rem' }}>
                        Créé le {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => alert("Génération de PDF en cours de finalisation...")}
                        style={{ ...styles.btnNext, maxWidth: '280px', padding: '1.1rem 2rem' }}>
                        <Download size={20} /> Télécharger la fiche (PDF)
                      </button>
                      <button
                        onClick={() => { setStep(1); setFormData({ client_type: 'entreprise', company_type: '', company_size: '', company_revenue: '', sector: '', location: '', siret: '', name: '', role: '', phone: '', email: '', project_objective: '', message: '', app_type: '', has_design: '', features_auth: false, features_payment: false, features_chat: false, features_map: false, features_dashboard: false, tech_requirements: '', deployment_need: '', maintenance_need: '', budget: '', timeline: '', accepted: false }); }}
                        style={{ ...styles.btnPrev, maxWidth: '280px', padding: '1.1rem 2rem' }}>
                        Nouvelle estimation
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-step {
          animation: fadeInSlide 0.35s ease forwards;
        }
        @media (max-width: 768px) {
          .devis-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
