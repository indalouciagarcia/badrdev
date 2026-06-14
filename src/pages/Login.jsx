import { useState } from 'react';
import { supabase } from '../config/supabase';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data?.session) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      fontFamily: 'inherit',
      padding: '1.5rem',
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '3rem 2.5rem',
      width: '100%',
      maxWidth: '440px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
    },
    logo: {
      width: '56px',
      height: '56px',
      background: 'rgba(255, 1, 79, 0.08)',
      color: '#FF014F',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#0f172a',
      margin: '0 0 0.5rem',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '0.875rem',
      marginBottom: '2rem',
    },
    formGroup: {
      textAlign: 'left',
      marginBottom: '1.25rem',
      position: 'relative',
    },
    label: {
      display: 'block',
      fontSize: '0.8rem',
      fontWeight: '700',
      color: '#334155',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '0.5rem',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '0.85rem 1rem 0.85rem 2.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '0.95rem',
      outline: 'none',
      color: '#1e293b',
      background: '#fafbfc',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    icon: {
      position: 'absolute',
      left: '0.85rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    eyeBtn: {
      position: 'absolute',
      right: '0.85rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    btn: {
      width: '100%',
      padding: '1rem',
      background: '#FF014F',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '1rem',
      boxShadow: '0 10px 15px -3px rgba(255, 1, 79, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
    },
    error: {
      background: '#fee2e2',
      color: '#b91c1c',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      fontSize: '0.85rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      textAlign: 'left',
    }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.logo}>
          <Lock size={28} />
        </div>
        <h1 style={s.title}>Espace Administration</h1>
        <p style={s.subtitle}>Veuillez vous authentifier pour accéder au tableau de bord.</p>

        {errorMsg && <div style={s.error}>{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <div style={s.formGroup}>
            <label style={s.label}>Adresse Email</label>
            <div style={s.inputWrapper}>
              <Mail size={16} style={s.icon} />
              <input
                type="email"
                required
                style={s.input}
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Mot de passe</label>
            <div style={s.inputWrapper}>
              <Lock size={16} style={s.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                style={{ ...s.input, paddingRight: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={s.eyeBtn}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
