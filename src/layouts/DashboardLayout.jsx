import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Login from '../pages/Login';
import { 
  LayoutDashboard, FolderKanban, Wrench, ArrowLeft, Layers, 
  User, Award, Mail, BookOpen, Users, LogOut 
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Récupérer la session courante au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { path: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { path: '/dashboard/profile', label: 'Profil / Hero', icon: User },
    { path: '/dashboard/content', label: 'Contenu du Site', icon: FolderKanban },
    { path: '/dashboard/projects', label: 'Projets', icon: FolderKanban },
    { path: '/dashboard/services', label: 'Services', icon: Wrench },
    { path: '/dashboard/skills', label: 'Compétences', icon: Award },
    { path: '/dashboard/blog', label: 'Blog', icon: BookOpen },
    { path: '/dashboard/quotes', label: 'Devis & Contacts', icon: Mail },
    { path: '/dashboard/crm', label: 'Suivi CRM', icon: Users },
    { path: '/dashboard/tech-logos', label: 'Logos Technos', icon: FolderKanban },
    { path: '/dashboard/settings', label: 'Paramètres & GA', icon: LayoutDashboard },
  ];

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#FF014F', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <span>Vérification des droits d'accès...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />;
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Layers className="logo-icon" size={28} />
            <h2>Admin Panel</h2>
          </div>
          <p>{session.user?.email || 'Administrateur'}</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={isActive ? 'active' : ''}
                  >
                    <Icon className="nav-icon" size={20} />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" className="back-to-site">
            <ArrowLeft size={16} />
            <span>Retour au site</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="back-to-site" 
            style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', justifyContent: 'flex-start', cursor: 'pointer', padding: '10px 15px' }}
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
