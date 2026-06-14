import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { 
  FolderKanban, Wrench, CheckCircle2, Euro, ArrowUpRight, 
  Mail, MessageSquare, Award, BookOpen, AlertCircle, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#6366f1', '#0d9488', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalServices: 0,
    activeServices: 0,
    totalRevenue: 0,
    totalQuotes: 0,
    newQuotes: 0,
    totalMessages: 0,
    totalSkills: 0,
    totalBlogPosts: 0
  });

  const [quotesChartData, setQuotesChartData] = useState([]);
  const [projectTypesData, setProjectTypesData] = useState([]);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        projectsCount,
        servicesData,
        quotesData,
        messagesData,
        skillsCount,
        blogsCount
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('price, status'),
        supabase.from('quote_requests').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true })
      ]);

      // Calcul des services et revenus
      const activeServices = servicesData.data?.filter(s => s.status === 'active') || [];
      const totalRevenue = activeServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

      // Statistiques générales
      const quotesList = quotesData.data || [];
      const messagesList = messagesData.data || [];
      const newQuotes = quotesList.filter(q => q.status === 'Nouveau').length;

      setStats({
        totalProjects: projectsCount.count || 0,
        totalServices: servicesData.data?.length || 0,
        activeServices: activeServices.length,
        totalRevenue,
        totalQuotes: quotesList.length,
        newQuotes,
        totalMessages: messagesList.length,
        totalSkills: skillsCount.count || 0,
        totalBlogPosts: blogsCount.count || 0
      });

      // 1. Préparer les données chronologiques pour les demandes de devis (AreaChart)
      // On groupe les requêtes par mois sur les 6 derniers mois
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        last6Months.push({
          label,
          monthIndex: d.getMonth(),
          year: d.getFullYear(),
          devis: 0,
          messages: 0
        });
      }

      quotesList.forEach(q => {
        const qDate = new Date(q.created_at);
        const match = last6Months.find(m => m.monthIndex === qDate.getMonth() && m.year === qDate.getFullYear());
        if (match) match.devis++;
      });

      messagesList.forEach(m => {
        const mDate = new Date(m.created_at);
        const match = last6Months.find(m => m.monthIndex === mDate.getMonth() && m.year === mDate.getFullYear());
        if (match) match.messages++;
      });

      setQuotesChartData(last6Months);

      // 2. Préparer les données pour les catégories / types de projet (PieChart)
      const categoriesMap = {};
      quotesList.forEach(q => {
        const type = q.project_type || 'Non spécifié';
        categoriesMap[type] = (categoriesMap[type] || 0) + 1;
      });

      const pieData = Object.keys(categoriesMap).map(key => ({
        name: key,
        value: categoriesMap[key]
      })).sort((a, b) => b.value - a.value);

      setProjectTypesData(pieData);

      // Récents
      setRecentQuotes(quotesList.slice(0, 4));
      setRecentMessages(messagesList.slice(0, 4));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du dashboard analytique...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue analytique en temps réel de votre activité et des performances du site.</p>
        </div>
      </div>

      {/* Grid de KPIs Premium */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="stat-card projects">
          <div className="stat-icon-wrapper">
            <FolderKanban size={22} />
          </div>
          <div className="stat-content">
            <h3>Projets</h3>
            <p className="stat-number">{stats.totalProjects}</p>
          </div>
        </div>
        <div className="stat-card active-services">
          <div className="stat-icon-wrapper">
            <Euro size={22} />
          </div>
          <div className="stat-content">
            <h3>CA Actif</h3>
            <p className="stat-number" style={{ fontSize: '32px' }}>
              {stats.totalRevenue.toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>
        <div className="stat-card services" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
            <Mail size={22} />
          </div>
          <div className="stat-content">
            <h3>Devis reçus</h3>
            <p className="stat-number">
              {stats.totalQuotes} 
              {stats.newQuotes > 0 && (
                <span style={{ fontSize: '13px', background: '#ef4444', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '10px', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                  +{stats.newQuotes}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="stat-card revenue" style={{ borderLeftColor: '#f43f5e' }}>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.08)', color: '#f43f5e' }}>
            <MessageSquare size={22} />
          </div>
          <div className="stat-content">
            <h3>Messages</h3>
            <p className="stat-number">{stats.totalMessages}</p>
          </div>
        </div>
      </div>

      {/* Graphiques Premium Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Graphique d'activité temporelle (Recharts AreaChart) */}
        <div className="dashboard-section" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="#6366f1" /> Activité du site (6 mois)
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0.2rem 0 0' }}>Historique comparatif des messages et demandes de devis.</p>
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quotesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDevis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area name="Demandes de Devis" type="monotone" dataKey="devis" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDevis)" />
                <Area name="Messages reçus" type="monotone" dataKey="messages" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique en camembert de répartition (Recharts PieChart) */}
        <div className="dashboard-section" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '20px' }}>Types de Projets</h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0.2rem 0 0' }}>Répartition des demandes de devis.</p>
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {projectTypesData.length > 0 ? (
              <div style={{ height: '200px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTypesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {projectTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '10px', border: 'none', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>Aucune donnée disponible</p>
            )}
            {/* Légende personnalisée */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
              {projectTypesData.slice(0, 4).map((entry, idx) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', fontWeight: '600', color: '#334155' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grille de listes récentes (Devis & Messages) */}
      <div className="dashboard-grid">
        
        {/* Dernières demandes de devis */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Demandes de Devis Récentes</h2>
            <Link to="/dashboard/quotes" className="view-all">
              <span>Voir tout</span> <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="recent-list">
            {recentQuotes.length > 0 ? (
              recentQuotes.map(req => (
                <div key={req.id} className="recent-item" style={{ borderLeft: '4px solid #6366f1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{req.name}</h4>
                    <span style={{
                      fontSize: '11px',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '50px',
                      background: req.status === 'Nouveau' ? '#fee2e2' : '#f1f5f9',
                      color: req.status === 'Nouveau' ? '#ef4444' : '#64748b',
                      fontWeight: '700'
                    }}>
                      {req.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '0.5rem' }}>
                    {req.project_type || 'Projet'} • {req.budget || 'Budget libre'} {req.currency || '€'}
                  </p>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">Aucune demande de devis reçue</p>
            )}
          </div>
        </div>

        {/* Derniers messages de contact */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Messages de Contact Récents</h2>
            <Link to="/dashboard/content" className="view-all">
              <span>Voir tout</span> <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="recent-list">
            {recentMessages.length > 0 ? (
              recentMessages.map(msg => (
                <div key={msg.id} className="recent-item" style={{ borderLeft: '4px solid #0d9488' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{msg.name}</h4>
                    <span style={{
                      fontSize: '11px',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '50px',
                      background: msg.is_read ? '#f1f5f9' : '#e0f2fe',
                      color: msg.is_read ? '#64748b' : '#0284c7',
                      fontWeight: '700'
                    }}>
                      {msg.is_read ? 'Lu' : 'Nouveau'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', marginBottom: '0.5rem' }}>
                    <strong>{msg.subject || 'Sans objet'}</strong> - {msg.message}
                  </p>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">Aucun message de contact reçu</p>
            )}
          </div>
        </div>

      </div>

      {/* Raccourcis / Actions Rapides */}
      <div className="quick-actions">
        <h2>Actions de Gestion</h2>
        <div className="actions-grid">
          <Link to="/dashboard/quotes" className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1' }}>
              <Mail size={20} />
            </div>
            <div className="action-body">
              <h3>Traiter les Devis</h3>
              <p>Consulter les demandes d'estimation client.</p>
            </div>
            <ArrowUpRight className="action-arrow" size={16} />
          </Link>
          <Link to="/dashboard/blog" className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'rgba(13, 148, 136, 0.08)', color: '#0d9488' }}>
              <BookOpen size={20} />
            </div>
            <div className="action-body">
              <h3>Rédiger un Article</h3>
              <p>Créer et publier des actualités de blog.</p>
            </div>
            <ArrowUpRight className="action-arrow" size={16} />
          </Link>
          <Link to="/dashboard/projects" className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
              <FolderKanban size={20} />
            </div>
            <div className="action-body">
              <h3>Ajouter un Projet</h3>
              <p>Mettre en valeur un nouveau projet réalisé.</p>
            </div>
            <ArrowUpRight className="action-arrow" size={16} />
          </Link>
          <Link to="/dashboard/settings" className="action-card">
            <div className="action-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
              <Wrench size={20} />
            </div>
            <div className="action-body">
              <h3>Google Analytics</h3>
              <p>Configurer la mesure et le SEO global.</p>
            </div>
            <ArrowUpRight className="action-arrow" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
