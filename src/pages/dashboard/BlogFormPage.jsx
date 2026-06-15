import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Loader2, Save, Upload, Trash2, MessageSquare } from 'lucide-react';
import '../Dashboard.css';

export default function BlogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image_url: '',
    status: 'draft',
    author: 'Badr Belabbes',
    category_id: '',
    keywords: 'React, Web, Frontend'
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('blog_categories').select('*').order('name', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
      if (data && data.length > 0 && !isEdit) {
        setPostForm(prev => ({ ...prev, category_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setPostForm({
          title: data.title,
          content: data.content,
          image_url: data.image_url || '',
          status: data.status,
          author: data.author || 'Badr Belabbes',
          category_id: data.category_id || '',
          keywords: data.keywords || 'React, Web, Frontend'
        });
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      alert('Impossible de charger l\'article.');
      navigate('/dashboard/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        // Silencieux si la table de commentaires facultative n'existe pas encore
        if (error.code === '42P01') return;
        throw error;
      }
      setComments(data || []);
    } catch (error) {
      console.warn('Comments table optionally missing or offline:', error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Supprimer ce commentaire définitivement ?')) return;
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Erreur lors de la suppression du commentaire.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blog_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      let activeBucket = 'blog';
      let uploadRes = await supabase.storage
        .from('blog')
        .upload(filePath, file);

      if (uploadRes.error) {
        activeBucket = 'profile';
        uploadRes = await supabase.storage
          .from('profile')
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

      if (uploadRes.error) throw uploadRes.error;

      const { data: { publicUrl } } = supabase.storage
        .from(activeBucket)
        .getPublicUrl(filePath);

      setPostForm(prev => ({ ...prev, image_url: publicUrl }));
      alert('Image de couverture téléchargée avec succès !');
    } catch (error) {
      console.error('Error uploading blog image:', error);
      alert('Erreur lors du téléchargement de l\'image (vérifiez que le bucket "portfolio" ou "uploads" est créé sur Supabase) : ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: postForm.title,
        content: postForm.content,
        image_url: postForm.image_url || null,
        status: postForm.status,
        author: postForm.author,
        category_id: postForm.category_id || null,
        keywords: postForm.keywords,
        updated_at: new Date()
      };

      if (isEdit) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([payload]);
        
        if (error) throw error;
      }
      
      navigate('/dashboard/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Erreur lors de l\'enregistrement de l\'article.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement de l'article...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <Link to="/dashboard/blog" className="back-link">
            <ArrowLeft size={18} />
            <span>Retour aux articles</span>
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>
            {isEdit ? 'Modifier l\'Article' : 'Rédiger un Nouvel Article'}
          </h1>
          <p>Configurez le titre, les tags, les mots-clés, l'image d'illustration et rédigez le contenu.</p>
        </div>
      </div>

      <div className="service-detail" style={{ maxWidth: '900px' }}>
        <form onSubmit={handleSubmit} className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="meta-label">Titre de l'article</label>
                <input
                  type="text"
                  placeholder="ex: Pourquoi utiliser Supabase avec React ?"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  required
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="meta-label">Auteur</label>
                  <input
                    type="text"
                    value={postForm.author}
                    onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                    required
                    disabled={submitting}
                    style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                  />
                </div>
                <div>
                  <label className="meta-label">Catégorie</label>
                  <select
                    value={postForm.category_id}
                    onChange={(e) => setPostForm({ ...postForm, category_id: e.target.value })}
                    required
                    disabled={submitting || categories.length === 0}
                    style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', background: 'white' }}
                  >
                    <option value="" disabled>Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="meta-label">Mots-clés / Keywords (séparés par des virgules)</label>
                <input
                  type="text"
                  placeholder="ex: Web Design, UX Design, Graphics"
                  value={postForm.keywords}
                  onChange={(e) => setPostForm({ ...postForm, keywords: e.target.value })}
                  required
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="meta-label">Statut</label>
                <select
                  value={postForm.status}
                  onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', background: 'white' }}
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publier</option>
                </select>
              </div>

              <div>
                <label className="meta-label">Image de Couverture</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={postForm.image_url}
                    onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })}
                    disabled={submitting}
                    style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    id="blog-image-upload"
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="blog-image-upload" 
                    className="btn-primary" 
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '14px', 
                      margin: 0, 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      boxShadow: 'none'
                    }}
                  >
                    {uploadingImage ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                    <span>Téléverser</span>
                  </label>
                </div>
              </div>

              {postForm.image_url && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <img 
                    src={postForm.image_url} 
                    alt="Couverture" 
                    style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }} 
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="meta-label">Contenu de l'article (Markdown supporté)</label>
            <textarea
              placeholder="Écrivez le corps de votre article ici..."
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              required
              disabled={submitting}
              rows={12}
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '18px', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div className="detail-actions" style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{submitting ? 'Sauvegarde...' : (isEdit ? 'Modifier l\'article' : 'Créer l\'article')}</span>
            </button>
            <button type="button" onClick={() => navigate('/dashboard/blog')} style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', padding: '0.75rem 1.35rem', fontWeight: '600', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </form>

        {/* SECTION DE GESTION DES COMMENTAIRES (SEULEMENT EN MODE ÉDITION) */}
        {isEdit && (
          <div className="detail-card" style={{ marginTop: '2.5rem', border: '1px solid #fee2e2' }}>
            <h3 style={{ fontSize: '22px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #fee2e2', paddingBottom: '0.5rem' }}>
              <MessageSquare size={20} />
              <span>Gestion des Commentaires ({comments.length})</span>
            </h3>
            {comments.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '18px' }}>Aucun commentaire sur cet article.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map((comment) => (
                  <div key={comment.id} style={{ padding: '1rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '16px', color: '#1e293b' }}>{comment.name} ({comment.email})</strong>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>{new Date(comment.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '16px', color: '#475569', lineHeight: '1.5' }}>{comment.message}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteComment(comment.id)} 
                      className="btn-danger" 
                      style={{ padding: '0.5rem', borderRadius: '8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
