import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Save, Loader2, CheckCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContentFormPage() {
  const { type, id } = useParams(); // type can be 'testimonials', 'counters', 'experiences'
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states based on type
  const [testimonialData, setTestimonialData] = useState({ name: '', role: '', text: '', image_url: '' });
  const [counterData, setCounterData] = useState({ count: 0, label: '' });
  const [experienceData, setExperienceData] = useState({ type: 'education', title: '', subtitle: '', description: '', icon: '' });

  useEffect(() => {
    if (isEditing) {
      fetchItem();
    }
  }, [id, type]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(type).select('*').eq('id', id).single();
      if (error) throw error;
      
      if (type === 'testimonials') setTestimonialData(data);
      if (type === 'counters') setCounterData(data);
      if (type === 'experiences') setExperienceData(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      alert("Erreur lors de la récupération des données");
      navigate('/dashboard/content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);

      if (type === 'testimonials') {
        setTestimonialData(prev => ({ ...prev, image_url: publicUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors du téléchargement: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let dataToSave;
      if (type === 'testimonials') dataToSave = testimonialData;
      if (type === 'counters') dataToSave = counterData;
      if (type === 'experiences') dataToSave = experienceData;

      let result;
      if (isEditing) {
        result = await supabase.from(type).update(dataToSave).eq('id', id);
      } else {
        result = await supabase.from(type).insert([dataToSave]);
      }

      if (result.error) throw result.error;
      navigate('/dashboard/content');
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 className="spinner text-indigo" size={32} />
      </div>
    );
  }

  const titlePrefix = isEditing ? 'Modifier' : 'Nouveau';
  const displayTitle = type === 'testimonials' ? 'Témoignage' : type === 'counters' ? 'Compteur' : 'Expérience';

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link to="/dashboard/content" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={16} /> Retour
            </Link>
          </div>
          <h1>{titlePrefix} {displayTitle}</h1>
          <p>Remplissez les informations ci-dessous pour ce contenu.</p>
        </div>
      </div>

      <div className="service-detail" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="detail-card">
          
          {type === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
              <div className="form-group">
                <label className="meta-label">Nom du client</label>
                <input type="text" className="meta-input" value={testimonialData.name} onChange={e => setTestimonialData({...testimonialData, name: e.target.value})} required placeholder="Ex: Jean Dupont" />
              </div>
              <div className="form-group">
                <label className="meta-label">Rôle ou Entreprise</label>
                <input type="text" className="meta-input" value={testimonialData.role} onChange={e => setTestimonialData({...testimonialData, role: e.target.value})} placeholder="Ex: CEO, Agence Digitale" />
              </div>
              <div className="form-group">
                <label className="meta-label">Témoignage (Texte)</label>
                <textarea className="meta-input" style={{ minHeight: '120px' }} value={testimonialData.text} onChange={e => setTestimonialData({...testimonialData, text: e.target.value})} required placeholder="Son avis sur votre travail..." />
              </div>
              <div className="form-group">
                <label className="meta-label">Photo du client</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {testimonialData.image_url && <img src={testimonialData.image_url} alt="Aperçu" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />}
                  <label className="btn-primary" style={{ cursor: 'pointer', background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}>
                    <Upload size={16} />
                    <span>{uploadingImage ? 'Téléchargement...' : 'Choisir une image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {type === 'counters' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
              <div className="form-group">
                <label className="meta-label">Nombre (Chiffre)</label>
                <input type="number" className="meta-input" value={counterData.count} onChange={e => setCounterData({...counterData, count: parseInt(e.target.value) || 0})} required placeholder="Ex: 150" />
              </div>
              <div className="form-group">
                <label className="meta-label">Libellé</label>
                <input type="text" className="meta-input" value={counterData.label} onChange={e => setCounterData({...counterData, label: e.target.value})} required placeholder="Ex: Projets Réalisés" />
              </div>
            </div>
          )}

          {type === 'experiences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
              <div className="form-group">
                <label className="meta-label">Type de carte</label>
                <select className="meta-input" value={experienceData.type} onChange={e => setExperienceData({...experienceData, type: e.target.value})} required>
                  <option value="education">Formation / Spécialisation (Page À Propos)</option>
                  <option value="expertise">Expertise Principale (Page Accueil)</option>
                  <option value="service_card">Carte Service (Page Accueil / À Propos)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="meta-label">Titre principal</label>
                <input type="text" className="meta-input" value={experienceData.title} onChange={e => setExperienceData({...experienceData, title: e.target.value})} required placeholder="Ex: Développement Full Stack" />
              </div>
              <div className="form-group">
                <label className="meta-label">Sous-titre (Optionnel)</label>
                <input type="text" className="meta-input" value={experienceData.subtitle} onChange={e => setExperienceData({...experienceData, subtitle: e.target.value})} placeholder="Ex: 60+ Projets ou Technologies Football" />
              </div>
              <div className="form-group">
                <label className="meta-label">Description courte</label>
                <textarea className="meta-input" style={{ minHeight: '100px' }} value={experienceData.description} onChange={e => setExperienceData({...experienceData, description: e.target.value})} placeholder="Courte description de l'expertise..." />
              </div>
              <div className="form-group">
                <label className="meta-label">Classe d'icône (FontAwesome)</label>
                <input type="text" className="meta-input" value={experienceData.icon} onChange={e => setExperienceData({...experienceData, icon: e.target.value})} placeholder="Ex: fa-light fa-code" />
                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>Nécessaire uniquement pour les expertises et cartes services.</span>
              </div>
            </div>
          )}

          <div className="detail-footer" style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving || uploadingImage} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {saving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
              <span>{saving ? 'Enregistrement...' : 'Enregistrer le contenu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
