import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Loader2 } from 'lucide-react';

export default function QuoteForm() {
  const [currencies, setCurrencies] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project_type: '',
    budget: '',
    currency: '',
    message: ''
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_options')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const curs = data.filter(opt => opt.category === 'currency');
      const types = data.filter(opt => opt.category === 'project_type');
      
      setCurrencies(curs);
      setProjectTypes(types);

      // Set default values if available
      setFormData(prev => ({
        ...prev,
        currency: curs.length > 0 ? curs[0].value : '',
        project_type: types.length > 0 ? types[0].value : ''
      }));

    } catch (error) {
      console.error('Error fetching quote options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          project_type: formData.project_type,
          budget: formData.budget,
          currency: formData.currency,
          message: formData.message,
          status: 'Nouveau'
        }]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        name: '', phone: '', email: '', budget: '', message: '',
        currency: currencies.length > 0 ? currencies[0].value : '',
        project_type: projectTypes.length > 0 ? projectTypes[0].value : ''
      });
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <Loader2 className="spinner" size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem' }}>Chargement du formulaire...</p>
      </div>
    );
  }

  return (
    <div className="contact-form">
      {success && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #10b981', textAlign: 'center', fontWeight: '500' }}>
          Merci ! Votre demande de devis a été envoyée avec succès. Je vous recontacterai rapidement.
        </div>
      )}
      
      <form className="tmp-dynamic-form" onSubmit={handleSubmit}>
        <div className="contact-form-wrapper row">
          
          <div className="col-lg-6">
            <div className="form-group">
              <input className="input-field" name="name" placeholder="Votre Nom complet" type="text" value={formData.name} onChange={handleChange} required disabled={submitting} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <input className="input-field" name="email" placeholder="Votre Email professionnel" type="email" value={formData.email} onChange={handleChange} required disabled={submitting} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <input className="input-field" name="phone" placeholder="Numéro de Téléphone" type="tel" value={formData.phone} onChange={handleChange} required disabled={submitting} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <select className="input-field" name="project_type" value={formData.project_type} onChange={handleChange} required disabled={submitting} style={{ WebkitAppearance: 'none', appearance: 'none', background: 'var(--color-white)' }}>
                <option value="" disabled>Type de projet...</option>
                {projectTypes.map(pt => (
                  <option key={pt.id} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="form-group">
              <input className="input-field" name="budget" placeholder="Budget estimé (ex: 5000 - 10000)" type="text" value={formData.budget} onChange={handleChange} required disabled={submitting} />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <select className="input-field" name="currency" value={formData.currency} onChange={handleChange} required disabled={submitting} style={{ WebkitAppearance: 'none', appearance: 'none', background: 'var(--color-white)' }}>
                {currencies.map(cur => (
                  <option key={cur.id} value={cur.value}>{cur.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group">
              <textarea className="input-field" placeholder="Décrivez votre projet en quelques mots..." name="message" value={formData.message} onChange={handleChange} required disabled={submitting} rows="4"></textarea>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="tmp-button-here">
              <button className="tmp-btn hover-icon-reverse radius-round w-100" type="submit" disabled={submitting}>
                <span className="icon-reverse-wrapper">
                  <span className="btn-text">{submitting ? 'Envoi en cours...' : 'Demander un Devis'}</span>
                  <span className="btn-icon"><i className="fa-sharp fa-regular fa-paper-plane"></i></span>
                  <span className="btn-icon"><i className="fa-sharp fa-regular fa-paper-plane"></i></span>
                </span>
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
