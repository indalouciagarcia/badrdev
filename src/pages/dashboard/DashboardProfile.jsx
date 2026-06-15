import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { User, Mail, Link as LinkIcon, Loader2, Save, CheckCircle, Upload } from 'lucide-react';
import '../Dashboard.css';

export default function DashboardProfile() {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    description: '',
    cv_url: '',
    github_url: '',
    linkedin_url: '',
    photo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${Math.random().toString(36).substring(2)}.${fileExt}`;
      // Utiliser le nom du fichier directement pour éviter les sous-dossiers inutiles
      const filePath = fileName;

      let activeBucket = 'profile';
      let uploadRes = await supabase.storage
        .from('profile')
        .upload(filePath, file);

      if (uploadRes.error) {
        activeBucket = 'blog';
        uploadRes = await supabase.storage
          .from('blog')
          .upload(filePath, file);
      }

      if (uploadRes.error) {
        activeBucket = 'projet';
        uploadRes = await supabase.storage
          .from('projet')
          .upload(filePath, file);
      }

      if (uploadRes.error) {
        activeBucket = 'project';
        uploadRes = await supabase.storage
          .from('project')
          .upload(filePath, file);
      }

      if (uploadRes.error) {
        activeBucket = 'portfolio';
        uploadRes = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);
      }

      if (uploadRes.error) {
        activeBucket = 'uploads';
        uploadRes = await supabase.storage
          .from('uploads')
          .upload(filePath, file);
      }

      if (uploadRes.error) throw uploadRes.error;

      const { data: { publicUrl } } = supabase.storage
        .from(activeBucket)
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, photo_url: publicUrl }));
      alert('Photo téléchargée avec succès !');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erreur lors du téléchargement de la photo : ' + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      let result;
      if (profile.id) {
        result = await supabase
          .from('profile')
          .update({
            name: profile.name,
            title: profile.title,
            description: profile.description,
            cv_url: profile.cv_url,
            github_url: profile.github_url,
            linkedin_url: profile.linkedin_url,
            photo_url: profile.photo_url,
            updated_at: new Date()
          })
          .eq('id', profile.id);
      } else {
        result = await supabase
          .from('profile')
          .insert([profile]);
      }

      if (result.error) throw result.error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de l\'enregistrement du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement des informations de profil...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Mon Profil & Hero</h1>
          <p>Gérez les informations textuelles et les liens affichés en haut de votre portfolio.</p>
        </div>
      </div>

      <div className="service-detail" style={{ maxWidth: '900px' }}>
        <form onSubmit={handleSubmit} className="detail-card">
          <div className="detail-header" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User className="text-indigo" size={22} />
              <span>Informations de Présentation</span>
            </h2>
            {success && (
              <span className="status active" style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                <CheckCircle size={12} />
                <span>Enregistré avec succès</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="meta-item">
                <label className="meta-label">Nom complet</label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="ex: Badr Belabbes"
                  required
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div className="meta-item">
                <label className="meta-label">Titre professionnel</label>
                <input
                  type="text"
                  value={profile.title || ''}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="ex: Développeur Full Stack & Designer"
                  required
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    marginTop: '0.25rem'
                  }}
                />
              </div>
            </div>

            <div className="meta-item">
              <label className="meta-label">Description / Bio</label>
              <textarea
                value={profile.description || ''}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Rédigez une courte présentation accrocheuse pour la bannière principale..."
                rows={4}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  marginTop: '0.25rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <h3 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LinkIcon size={16} className="text-teal" />
              <span>Liens & Liens Externes</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div className="meta-item">
                <label className="meta-label">Lien du CV (PDF)</label>
                <input
                  type="url"
                  value={profile.cv_url || ''}
                  onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })}
                  placeholder="https://drive.google.com/.../cv.pdf"
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div className="meta-item">
                <label className="meta-label">URL GitHub</label>
                <input
                  type="url"
                  value={profile.github_url || ''}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  placeholder="https://github.com/votre-username"
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div className="meta-item">
                <label className="meta-label">URL LinkedIn</label>
                <input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/votre-nom"
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div className="meta-item" style={{ gridColumn: 'span 2' }}>
                <label className="meta-label">Image de Profil</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                  {profile.photo_url && (
                    <img 
                      src={profile.photo_url} 
                      alt="Profil Preview" 
                      style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }} 
                    />
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="url"
                      value={profile.photo_url || ''}
                      onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                      placeholder="https://votre-site.com/photo.jpg"
                      style={{
                        padding: '0.75rem 1rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '18px',
                        width: '100%'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        id="profile-photo-upload"
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="profile-photo-upload" 
                        className="btn-primary" 
                        style={{ 
                          padding: '0.6rem 1.2rem', 
                          fontSize: '16px', 
                          margin: 0, 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          boxShadow: 'none'
                        }}
                      >
                        {uploadingPhoto ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
                        <span>{uploadingPhoto ? 'Téléchargement...' : 'Téléverser une photo'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-actions" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{saving ? 'Enregistrement...' : 'Sauvegarder le profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
