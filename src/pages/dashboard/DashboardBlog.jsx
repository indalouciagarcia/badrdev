import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { BookOpen, Plus, Trash2, Loader2, Edit3, FileText, Tag, MessageSquare, Users, Ban, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

export default function DashboardBlog() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for new category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, categoriesRes, commentsRes, subscribersRes] = await Promise.all([
        supabase.from('blog_posts').select('*, blog_categories(name)').order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('name', { ascending: true }),
        supabase.from('blog_comments').select('*, blog_posts(title)').order('created_at', { ascending: false }),
        supabase.from('blog_subscribers').select('*').order('created_at', { ascending: false })
      ]);

      if (postsRes.error) throw postsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (commentsRes.error) throw commentsRes.error;
      if (subscribersRes.error) throw subscribersRes.error;

      setPosts(postsRes.data || []);
      setCategories(categoriesRes.data || []);
      setComments(commentsRes.data || []);
      setSubscribers(subscribersRes.data || []);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommentStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modération du commentaire.');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('Supprimer ce commentaire définitivement ?')) return;
    try {
      const { error } = await supabase.from('blog_comments').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  const handleToggleBlacklist = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_subscribers')
        .update({ is_blacklisted: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification de la liste noire.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article définitivement ?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSavingCategory(true);
    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { error } = await supabase.from('blog_categories').insert([{ name: newCategoryName, slug }]);
      if (error) throw error;
      
      setNewCategoryName('');
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Erreur lors de l\'ajout de la catégorie (le slug doit être unique)');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Voulez-vous supprimer cette catégorie ? Les articles liés perdront cette catégorie.')) return;
    try {
      const { error } = await supabase.from('blog_categories').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const activeCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  if (loading && posts.length === 0 && categories.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement du blog...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Gestion du Blog</h1>
          <p>Rédigez des articles et gérez vos catégories.</p>
        </div>
        {activeTab === 'posts' && (
          <Link className="btn-primary" to="/dashboard/blog/new" style={{ textDecoration: 'none' }}>
            <Plus size={18} />
            <span>Nouvel Article</span>
          </Link>
        )}
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card projects">
          <div className="stat-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>Articles Publiés</h3>
            <p className="stat-number">{activeCount}</p>
          </div>
        </div>
        <div className="stat-card active-services" style={{ borderLeftColor: 'var(--amber-primary)' }}>
          <div className="stat-icon-wrapper" style={{ background: 'var(--amber-glow)', color: 'var(--amber-primary)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Brouillons</h3>
            <p className="stat-number">{draftCount}</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981', background: '#fff', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#10b981', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={24} />
          </div>
          <div className="stat-content">
            <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', fontWeight: '500', textTransform: 'uppercase' }}>Catégories</h3>
            <p className="stat-number" style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{categories.length}</p>
          </div>
        </div>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'posts' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'posts' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <BookOpen size={18} />
          Articles
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'categories' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'categories' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Tag size={18} />
          Catégories
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'comments' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'comments' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MessageSquare size={18} />
          Commentaires ({comments.filter(c => c.status === 'pending').length} en attente)
        </button>
        <button 
          onClick={() => setActiveTab('subscribers')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'subscribers' ? '2px solid var(--indigo-primary)' : '2px solid transparent', color: activeTab === 'subscribers' ? 'var(--indigo-primary)' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Users size={18} />
          Abonnés & Blacklist
        </button>
      </div>

      {activeTab === 'posts' && (
        <>
          {posts.length === 0 ? (
            <div className="no-data">
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Aucun article enregistré. Commencez par en ajouter un !</p>
            </div>
          ) : (
            <div className="items-grid">
              {posts.map(post => (
                <div key={post.id} className="item-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`status ${post.status === 'published' ? 'active' : 'pending'}`}>
                      {post.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                    {post.blog_categories?.name && (
                      <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '500' }}>
                        {post.blog_categories.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ marginTop: '0.5rem', fontSize: '22px' }}>{post.title}</h3>
                  <p>{post.content.slice(0, 140) + (post.content.length > 140 ? '...' : '')}</p>
                  
                  {post.image_url && (
                    <div style={{
                      height: '100px',
                      borderRadius: '8px',
                      backgroundImage: `url(${post.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      marginBottom: '1rem',
                      border: '1px solid #e2e8f0'
                    }}></div>
                  )}

                  <div className="card-meta" style={{ marginBottom: '0.5rem' }}>
                    <span>Rédigé le: {new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="card-actions">
                    <Link 
                      to={`/dashboard/blog/edit/${post.id}`} 
                      className="btn-primary" 
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', boxShadow: 'none', background: '#f1f5f9', color: '#475569', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <Edit3 size={14} />
                      <span>Modifier</span>
                    </Link>
                    <button onClick={() => handleDeletePost(post.id)} className="btn-danger">
                      <Trash2 size={14} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          <div className="detail-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Ajouter une Catégorie</h3>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="meta-label">Nom de la catégorie</label>
                <input 
                  type="text" 
                  className="meta-input" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  placeholder="Ex: Développement Web"
                  required 
                />
              </div>
              <button type="submit" disabled={savingCategory} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {savingCategory ? <Loader2 className="spinner" size={18} /> : <Plus size={18} />}
                <span>Ajouter</span>
              </button>
            </form>
          </div>

          <div className="detail-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Liste des Catégories</h3>
            {categories.length === 0 ? (
              <p style={{ color: '#64748b' }}>Aucune catégorie.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{cat.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Slug: {cat.slug}</p>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="detail-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '700' }}>Modération des commentaires</h3>
          {comments.length === 0 ? (
            <p style={{ color: '#64748b' }}>Aucun commentaire à modérer.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.map(c => (
                <div key={c.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{c.name}</strong>
                      <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '0.5rem' }}>({c.email})</span>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '11px', color: '#8b5cf6' }}>
                        Article : {c.blog_posts?.title || 'Chargement...'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {c.status === 'pending' ? (
                        <button 
                          onClick={() => handleUpdateCommentStatus(c.id, 'diffused')}
                          className="btn-primary" 
                          style={{ background: '#10b981', color: 'white', padding: '0.35rem 0.75rem', fontSize: '12px', display: 'flex', gap: '0.25rem', alignItems: 'center', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <CheckCircle size={14} /> Diffuser
                        </button>
                      ) : (
                        <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                          Diffusé
                        </span>
                      )}
                      <button 
                        onClick={() => handleDeleteComment(c.id)}
                        className="btn-danger"
                        style={{ padding: '0.35rem', borderRadius: '6px' }}
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9', fontStyle: 'italic' }}>
                    "{c.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="detail-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '700' }}>Gestionnaires des Utilisateurs (Abonnés & Blacklist)</h3>
          {subscribers.length === 0 ? (
            <p style={{ color: '#64748b' }}>Aucun utilisateur abonné.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {subscribers.map(sub => (
                <div key={sub.id} style={{ background: sub.is_blacklisted ? '#fee2e2' : '#f8fafc', border: `1px solid ${sub.is_blacklisted ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifycontent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{sub.name}</h4>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{sub.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: sub.is_blacklisted ? '#ef4444' : '#10b981' }}>
                      {sub.is_blacklisted ? '🔴 Banni' : '🟢 Actif'}
                    </span>
                    <button 
                      onClick={() => handleToggleBlacklist(sub.id, sub.is_blacklisted)}
                      style={{ 
                        background: sub.is_blacklisted ? '#10b981' : '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        padding: '0.35rem 0.75rem', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Ban size={13} /> {sub.is_blacklisted ? 'Débloquer' : 'Bannir (Blacklist)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
