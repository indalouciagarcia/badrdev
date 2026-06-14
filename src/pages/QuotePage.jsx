import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { CheckCircle, FileText, Download, Loader2, User, Mail, Phone, Briefcase, DollarSign, Clock, MessageSquare } from 'lucide-react';
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
  heading:     '#181c32',   // titres : quasi-noir
  body:        '#65676b',   // corps : gris moyen
  border:      'rgba(0,0,0,0.08)',
  borderLight: 'rgba(0,0,0,0.04)',
  success:     '#3EB75E',
};


const styles = {
  page: {
    padding: '80px 0 120px',
    background: C.secondary,
    minHeight: '70vh',
  },
  card: {
    background: C.card,
    borderRadius: '24px',
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
  },
  header: {
    background: `linear-gradient(135deg, ${C.primary} 0%, #c2003d 100%)`,
    padding: '3.5rem 4rem',
    position: 'relative',
    overflow: 'hidden',
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
    fontSize: '3rem',
    fontWeight: '900',
    color: C.heading,
    margin: '0 0 1rem',
    lineHeight: '1.15',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.85)',
    margin: 0,
    lineHeight: '1.7',
    fontWeight: '400',
  },
  body: {
    padding: '3rem 4rem',
  },
  sectionLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  sectionDivider: {
    borderBottom: `1px solid ${C.border}`,
    paddingBottom: '2.5rem',
    marginBottom: '2.5rem',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.75rem',
    marginBottom: '0',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  label: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: C.heading,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: C.body,
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    padding: '1.25rem 1.5rem 1.25rem 4rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: C.border,
    borderRadius: '50px',
    fontSize: '1.5rem',
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
    boxShadow: `0 0 0 4px rgba(255, 1, 79, 0.1)`,
  },
  inputError: {
    borderColor: '#ef4444',
    background: '#fff5f5',
  },
  select: {
    width: '100%',
    padding: '1.25rem 1.5rem 1.25rem 4rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: C.border,
    borderRadius: '50px',
    fontSize: '1.5rem',
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
    padding: '1.5rem 1.75rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: C.border,
    borderRadius: '24px',
    fontSize: '1.5rem',
    color: C.heading,
    background: C.dark,
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    minHeight: '180px',
    lineHeight: '1.75',
  },
  errorText: {
    color: '#e00040',
    fontSize: '0.9rem',
    marginTop: '0.25rem',
    paddingLeft: '0.5rem',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    background: 'rgba(255,1,79,0.06)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,1,79,0.2)',
    borderRadius: '20px',
    padding: '1.5rem 1.75rem',
  },
  checkboxInput: {
    marginTop: '4px',
    width: '20px',
    height: '20px',
    accentColor: C.primary,
    flexShrink: 0,
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '1.15rem',
    color: C.body,
    lineHeight: '1.7',
  },
  footer: {
    padding: '2.5rem 4rem 3.5rem',
    background: '#f4f5f7',
    borderTop: `1px solid ${C.border}`,
  },
  submitBtn: {
    background: C.primary,
    color: C.heading,
    border: 'none',
    borderRadius: '50px',
    padding: '1.35rem 3.5rem',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '460px',
    margin: '0 auto',
    transition: 'all 0.3s ease',
    boxShadow: `0 8px 30px rgba(255, 1, 79, 0.4)`,
    letterSpacing: '0.3px',
  },
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
        <span style={styles.inputIcon}><Icon size={20} /></span>
        <input type={type} name={name} style={inputStyle} placeholder={placeholder}
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
        <span style={styles.inputIcon}><Icon size={20} /></span>
        <select name={name} style={selectStyle} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <option value="" style={{ background: C.dark }}>Sélectionnez...</option>
          {options.map(opt => (
            <option key={opt.value || opt.id} value={opt.label} style={{ background: C.dark }}>{opt.label}</option>
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
  const [projectTypes, setProjectTypes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [textareaFocused, setTextareaFocused] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', project_type: '',
    budget: '', timeline: '', message: '', accepted: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchOptions(); }, []);

  const fetchOptions = async () => {
    try {
      const { data, error } = await supabase.from('quote_options').select('*');
      if (error) throw error;
      const types = data.filter(o => o.category === 'project_type');
      const buds  = data.filter(o => o.category === 'budget');
      const times = data.filter(o => o.category === 'timeline');
      if (!types.length) types.push(
        { value: 'web', label: 'Développement Web' },
        { value: 'mobile', label: 'Application Mobile' },
        { value: 'design', label: 'UI/UX Design' },
        { value: 'consulting', label: 'Consulting Technique' },
        { value: 'erp', label: 'Automatisation / ERP' },
        { value: 'sport', label: 'Plateforme Football/Sport' }
      );
      if (!buds.length) buds.push(
        { value: '<3000', label: 'Moins de 3 000€' },
        { value: '3000-8000', label: '3 000€ – 8 000€' },
        { value: '8000-15000', label: '8 000€ – 15 000€' },
        { value: '15000-30000', label: '15 000€ – 30 000€' },
        { value: '>30000', label: 'Plus de 30 000€' }
      );
      if (!times.length) times.push(
        { value: 'urgent', label: '⚡ Urgent (< 2 semaines)' },
        { value: 'normal', label: '📅 Normal (1–2 mois)' },
        { value: 'flexible', label: '🕐 Flexible (3 mois+)' }
      );
      setProjectTypes(types); setBudgets(buds); setTimelines(times);
    } catch (err) { console.error(err); }
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Le nom est obligatoire';
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) e.email = 'L\'email est obligatoire';
    else if (!rx.test(formData.email)) e.email = 'Format invalide';
    if (!formData.phone.trim()) e.phone = 'Le téléphone est obligatoire';
    if (!formData.project_type) e.project_type = 'Sélectionnez un type';
    if (!formData.budget) e.budget = 'Sélectionnez un budget';
    if (!formData.timeline) e.timeline = 'Sélectionnez un délai';
    if (!formData.message.trim()) e.message = 'La description est obligatoire';
    else if (formData.message.length < 20) e.message = 'Minimum 20 caractères';
    if (!formData.accepted) e.accepted = 'Consentement requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name, value, type, checked } = ev.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const qn = `DEV-${year}-${num}`;
    try {
      const { error } = await supabase.from('quote_requests').insert([{
        quote_number: qn, name: formData.name, email: formData.email,
        phone: formData.phone, project_type: formData.project_type,
        budget: formData.budget, timeline: formData.timeline,
        message: formData.message, currency: 'EUR', status: 'Nouveau'
      }]);
      if (error && error.code !== '42703') throw error;
      setQuoteNumber(qn); setStep(2);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally { setLoading(false); }
  };

  const textareaStyle = {
    ...styles.textarea,
    ...(textareaFocused ? styles.inputFocus : {}),
    ...(errors.message ? styles.inputError : {}),
  };

  return (
    <>
      <Breadcrumb title="Demander un devis" />

      <div style={styles.page}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-11">

              {step === 1 ? (
                <div style={styles.card}>

                  {/* ── Header ── */}
                  <div style={styles.header}>
                    <div style={styles.headerDecor1} />
                    <div style={styles.headerDecor2} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={styles.headerIcon}>
                        <FileText size={30} color="white" />
                      </div>
                      <h1 style={styles.headerTitle}>Obtenir une estimation gratuite</h1>
                      <p style={styles.headerSubtitle}>
                        Remplissez le formulaire et recevez un devis personnalisé sous 48h.
                      </p>
                    </div>
                  </div>

                  {/* ── Form ── */}
                  <form onSubmit={handleSubmit} noValidate>
                    <div style={styles.body}>

                      {/* Section Coordonnées */}
                      <div style={styles.sectionDivider}>
                        <p style={styles.sectionLabel}>
                          <User size={14} /> Vos coordonnées
                        </p>
                        <div style={styles.grid2}>
                          <InputField icon={User}  label="Nom complet"  name="name"  placeholder="Votre nom complet" value={formData.name}  onChange={handleChange} error={errors.name}  required />
                          <InputField icon={Mail}  label="Email"        name="email" type="email" placeholder="vous@exemple.com" value={formData.email} onChange={handleChange} error={errors.email} required />
                          <InputField icon={Phone} label="Téléphone"   name="phone" type="tel" placeholder="+33 6 00 00 00 00"  value={formData.phone} onChange={handleChange} error={errors.phone} required />
                        </div>
                      </div>

                      {/* Section Projet */}
                      <div style={styles.sectionDivider}>
                        <p style={styles.sectionLabel}>
                          <Briefcase size={14} /> Détails du projet
                        </p>
                        <div style={styles.grid2}>
                          <SelectField icon={Briefcase}   label="Type de projet" name="project_type" options={projectTypes} value={formData.project_type} onChange={handleChange} error={errors.project_type} required />
                          <SelectField icon={DollarSign} label="Budget estimé"   name="budget"       options={budgets}       value={formData.budget}       onChange={handleChange} error={errors.budget}       required />
                          <SelectField icon={Clock}       label="Délai souhaité" name="timeline"     options={timelines}     value={formData.timeline}     onChange={handleChange} error={errors.timeline}     required />
                        </div>
                      </div>

                      {/* Section Description */}
                      <div style={{ marginBottom: '2rem' }}>
                        <p style={styles.sectionLabel}>
                          <MessageSquare size={14} /> Description du projet
                        </p>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>
                            Décrivez votre projet <span style={{ color: C.primary }}>*</span>
                          </label>
                          <textarea
                            name="message" rows="7"
                            style={textareaStyle}
                            placeholder="Décrivez vos besoins, objectifs, fonctionnalités souhaitées, contraintes techniques... (min. 20 caractères)"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setTextareaFocused(true)}
                            onBlur={() => setTextareaFocused(false)}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '0.5rem' }}>
                            {errors.message
                              ? <span style={styles.errorText}>⚠ {errors.message}</span>
                              : <span />
                            }
                            <span style={{ fontSize: '0.95rem', color: formData.message.length < 20 ? C.body : C.success }}>
                              {formData.message.length} / 20 min.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Consentement */}
                      <div>
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

                    </div>{/* /body */}

                    {/* ── Footer / Submit ── */}
                    <div style={styles.footer}>
                      <button type="submit" style={styles.submitBtn} disabled={loading}
                        onMouseOver={e => { e.currentTarget.style.background = C.primaryHover; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseOut={e =>  { e.currentTarget.style.background = C.primary;      e.currentTarget.style.transform = 'none'; }}>
                        {loading
                          ? <><Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
                          : <><FileText size={22} /> Envoyer ma demande de devis</>
                        }
                      </button>
                      <p style={{ textAlign: 'center', color: C.body, fontSize: '0.95rem', marginTop: '1.25rem', opacity: 0.8 }}>
                        🔒 Vos données sont sécurisées — Réponse garantie sous 48h ouvrées
                      </p>
                    </div>
                  </form>

                </div>
              ) : (
                /* ══════ SUCCESS VIEW ══════ */
                <div style={{ ...styles.card, textAlign: 'center' }}>

                  <div style={{ ...styles.header, background: `linear-gradient(135deg, #059669 0%, #10b981 100%)` }}>
                    <div style={styles.headerDecor1} /><div style={styles.headerDecor2} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ ...styles.headerIcon, margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={30} color="white" />
                      </div>
                      <h1 style={{ ...styles.headerTitle, fontSize: '2.5rem' }}>Demande enregistrée !</h1>
                      <p style={styles.headerSubtitle}>
                        Votre demande a bien été reçue. Je vous recontacte sous 48h ouvrées.
                      </p>
                    </div>
                  </div>

                  <div style={styles.body}>

                    {/* Numéro de devis */}
                    <div style={{
                      background: 'rgba(255,1,79,0.08)',
                      borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(255,1,79,0.25)',
                      borderRadius: '20px', padding: '2.5rem', marginBottom: '2.5rem'
                    }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: C.primary, textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 0.75rem' }}>
                        Référence de votre devis
                      </p>
                      <p style={{ fontSize: '2.75rem', fontWeight: '900', color: C.heading, margin: 0, letterSpacing: '3px' }}>
                        {quoteNumber}
                      </p>
                      <p style={{ color: C.body, margin: '0.75rem 0 0', fontSize: '1.05rem' }}>
                        Créé le {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Récapitulatif */}
                    <div style={{ background: C.dark, borderRadius: '20px', padding: '2rem', textAlign: 'left', marginBottom: '2.5rem', borderWidth: '1px', borderStyle: 'solid', borderColor: C.border }}>
                      <p style={{ ...styles.sectionLabel, marginBottom: '1.5rem' }}>Récapitulatif de la demande</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {[
                          { label: 'Nom', value: formData.name },
                          { label: 'Email', value: formData.email },
                          { label: 'Type de projet', value: formData.project_type },
                          { label: 'Budget estimé', value: formData.budget },
                          { label: 'Délai souhaité', value: formData.timeline, full: true },
                        ].map(item => (
                          <div key={item.label} style={{
                            ...(item.full ? { gridColumn: '1 / -1' } : {}),
                            background: C.card, borderRadius: '14px', padding: '1.1rem 1.5rem',
                            borderWidth: '1px', borderStyle: 'solid', borderColor: C.border
                          }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: C.body, letterSpacing: '1px' }}>
                              {item.label}
                            </span>
                            <p style={{ fontSize: '1.15rem', fontWeight: '600', color: C.heading, margin: '0.3rem 0 0' }}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => alert("Fonctionnalité PDF à intégrer prochainement !")}
                        style={{ ...styles.submitBtn, maxWidth: '260px', padding: '1.1rem 2rem' }}>
                        <Download size={20} /> Télécharger (PDF)
                      </button>
                      <button
                        onClick={() => { setStep(1); setFormData({ name: '', email: '', phone: '', project_type: '', budget: '', timeline: '', message: '', accepted: false }); }}
                        style={{ ...styles.submitBtn, maxWidth: '260px', padding: '1.1rem 2rem', background: 'transparent', color: C.heading, border: `2px solid ${C.border}`, boxShadow: 'none' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = C.primary; }}
                        onMouseOut={e =>  { e.currentTarget.style.borderColor = C.border; }}>
                        Nouvelle demande
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
        @media (max-width: 768px) {
          .devis-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
