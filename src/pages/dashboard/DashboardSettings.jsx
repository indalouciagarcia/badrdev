import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'
import {
  BarChart3, CheckCircle, AlertCircle, Save, RefreshCw,
  ExternalLink, Info, Globe, Search, Eye, EyeOff
} from 'lucide-react'

const SETTINGS_KEYS = ['ga_measurement_id', 'ga_enabled', 'site_title', 'meta_description']

export default function DashboardSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [showGaId, setShowGaId] = useState(false)
  const [gaPreview, setGaPreview] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', SETTINGS_KEYS)
      if (error) throw error
      const map = {}
      ;(data || []).forEach(s => { map[s.key] = s.value })
      setSettings(map)
    } catch (err) {
      showToast('Erreur de chargement : ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Upsert chaque paramètre
      for (const key of Object.keys(settings)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: settings[key], updated_at: new Date().toISOString() }, { onConflict: 'key' })
        if (error) throw error
      }
      showToast('Paramètres sauvegardés avec succès !')

      // Si GA activé et ID présent → informer
      if (settings.ga_enabled === 'true' && settings.ga_measurement_id?.trim()) {
        setGaPreview(true)
      }
    } catch (err) {
      showToast('Erreur lors de la sauvegarde : ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const gaId = settings.ga_measurement_id?.trim() || ''
  const gaEnabled = settings.ga_enabled === 'true'
  const gaValid = /^G-[A-Z0-9]{6,}$/.test(gaId)

  // ── Styles ──
  const s = {
    page: { padding: '2rem', maxWidth: '860px' },
    title: { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.5rem' },
    subtitle: { color: '#64748b', marginBottom: '2.5rem', fontSize: '0.95rem' },
    section: {
      background: 'white', borderRadius: '20px',
      border: '1px solid #e2e8f0', marginBottom: '1.5rem',
      overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    sectionHead: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9',
      background: '#fafbfc',
    },
    sectionIcon: (color) => ({
      width: '40px', height: '40px', borderRadius: '10px',
      background: color + '15', color, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }),
    sectionTitle: { fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    sectionDesc: { fontSize: '0.85rem', color: '#64748b', margin: '0.15rem 0 0' },
    body: { padding: '1.75rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' },
    input: {
      width: '100%', padding: '0.85rem 1rem', border: '2px solid #e5e7eb',
      borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit',
      boxSizing: 'border-box', outline: 'none', color: '#1e293b',
      background: '#fafbfc', transition: 'border-color 0.2s',
    },
    inputValid: { borderColor: '#10b981' },
    inputInvalid: { borderColor: '#ef4444' },
    helpText: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.4rem' },
    toggle: {
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '12px',
      border: '1px solid #e2e8f0', cursor: 'pointer', userSelect: 'none',
    },
    toggleBtn: (active) => ({
      width: '52px', height: '28px', borderRadius: '50px',
      background: active ? '#FF014F' : '#e2e8f0',
      position: 'relative', transition: 'background 0.3s', flexShrink: 0,
      border: 'none', cursor: 'pointer',
    }),
    toggleDot: (active) => ({
      position: 'absolute', top: '3px',
      left: active ? '26px' : '3px', width: '22px', height: '22px',
      borderRadius: '50%', background: 'white',
      transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }),
    badge: (type) => ({
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.35rem 0.85rem', borderRadius: '50px',
      fontSize: '0.8rem', fontWeight: '700',
      background: type === 'ok' ? '#d1fae5' : type === 'warn' ? '#fef3c7' : '#fee2e2',
      color: type === 'ok' ? '#059669' : type === 'warn' ? '#d97706' : '#ef4444',
    }),
    saveBtn: {
      background: '#FF014F', color: 'white', border: 'none',
      borderRadius: '12px', padding: '1rem 2.5rem',
      fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(255,1,79,0.3)',
    },
    toast: (type) => ({
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
      background: type === 'success' ? '#059669' : '#ef4444',
      color: 'white', padding: '0.9rem 1.5rem', borderRadius: '12px',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)', fontWeight: '600',
    }),
  }

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#FF014F', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
      Chargement des paramètres...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={s.page}>

      {/* Toast */}
      {toast && (
        <div style={s.toast(toast.type)}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <h1 style={s.title}>⚙️ Paramètres du site</h1>
      <p style={s.subtitle}>Configurez les intégrations et les métadonnées de votre portfolio.</p>

      {/* ── Section Google Analytics ── */}
      <div style={s.section}>
        <div style={s.sectionHead}>
          <div style={s.sectionIcon('#FF6B35')}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={s.sectionTitle}>Google Analytics 4</h3>
            <p style={s.sectionDesc}>Suivez les visites et le comportement des utilisateurs sur votre portfolio.</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {gaEnabled && gaValid
              ? <span style={s.badge('ok')}><CheckCircle size={13} /> Actif</span>
              : gaEnabled && !gaValid
              ? <span style={s.badge('error')}><AlertCircle size={13} /> ID invalide</span>
              : <span style={s.badge('warn')}>Inactif</span>
            }
          </div>
        </div>

        <div style={s.body}>
          {/* Toggle activer/désactiver */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={s.label}>Statut du tracking</label>
            <label style={s.toggle}>
              <button
                type="button"
                style={s.toggleBtn(gaEnabled)}
                onClick={() => updateSetting('ga_enabled', gaEnabled ? 'false' : 'true')}
              >
                <div style={s.toggleDot(gaEnabled)} />
              </button>
              <div>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>
                  {gaEnabled ? 'Google Analytics activé' : 'Google Analytics désactivé'}
                </span>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  {gaEnabled ? 'Le script GA sera injecté automatiquement sur toutes les pages.' : 'Aucun tracking en cours.'}
                </p>
              </div>
            </label>
          </div>

          {/* Measurement ID */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={s.label}>Measurement ID (GA4)</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{
                  ...s.input,
                  paddingRight: '3rem',
                  ...(gaId ? (gaValid ? s.inputValid : s.inputInvalid) : {}),
                  fontFamily: showGaId ? 'monospace' : 'inherit',
                  letterSpacing: showGaId ? '2px' : 'normal',
                }}
                type={showGaId ? 'text' : 'password'}
                placeholder="G-XXXXXXXXXX"
                value={settings.ga_measurement_id || ''}
                onChange={e => updateSetting('ga_measurement_id', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowGaId(v => !v)}
                style={{
                  position: 'absolute', right: '1rem', top: '50%',
                  transform: 'translateY(-50%)', border: 'none',
                  background: 'transparent', cursor: 'pointer', color: '#94a3b8',
                }}
              >
                {showGaId ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p style={s.helpText}>
              Format attendu : <code style={{ background: '#f1f5f9', padding: '0 4px', borderRadius: '4px' }}>G-XXXXXXXXXX</code>
              {gaId && !gaValid && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>⚠ Format invalide</span>}
              {gaId && gaValid && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓ Format valide</span>}
            </p>
          </div>

          {/* Guide */}
          <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bae6fd' }}>
            <p style={{ fontWeight: '700', color: '#0369a1', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Info size={15} /> Comment obtenir votre Measurement ID ?
            </p>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.8' }}>
              <li>Allez sur <a href="https://analytics.google.com" target="_blank" rel="noreferrer" style={{ color: '#0369a1', fontWeight: '600' }}>analytics.google.com <ExternalLink size={11} style={{ verticalAlign: 'middle' }} /></a></li>
              <li>Créez ou sélectionnez une propriété → <strong>Flux de données</strong></li>
              <li>Sélectionnez votre flux Web → copiez l'<strong>ID de mesure</strong> (G-XXXXXXXXXX)</li>
              <li>Collez-le ci-dessus et activez le tracking</li>
            </ol>
          </div>

          {/* Preview aperçu du code injecté */}
          {gaEnabled && gaValid && (
            <div style={{ marginTop: '1.25rem', background: '#1e293b', borderRadius: '12px', padding: '1.25rem' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Script injecté automatiquement :
              </p>
              <code style={{ color: '#86efac', fontSize: '0.8rem', lineHeight: '1.7', display: 'block', whiteSpace: 'pre-wrap' }}>
{`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId}');
</script>`}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* ── Section SEO / Métadonnées ── */}
      <div style={s.section}>
        <div style={s.sectionHead}>
          <div style={s.sectionIcon('#8b5cf6')}>
            <Search size={20} />
          </div>
          <div>
            <h3 style={s.sectionTitle}>SEO & Métadonnées</h3>
            <p style={s.sectionDesc}>Titre et description affichés dans les résultats de recherche Google.</p>
          </div>
        </div>
        <div style={s.body}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={s.label}>Titre du site</label>
            <input
              style={s.input}
              value={settings.site_title || ''}
              onChange={e => updateSetting('site_title', e.target.value)}
              placeholder="Mon Portfolio — Développeur Full Stack"
            />
            <p style={s.helpText}>{(settings.site_title || '').length}/60 caractères recommandés</p>
          </div>
          <div>
            <label style={s.label}>Meta description</label>
            <textarea
              style={{ ...s.input, minHeight: '90px', resize: 'vertical', lineHeight: '1.6' }}
              value={settings.meta_description || ''}
              onChange={e => updateSetting('meta_description', e.target.value)}
              placeholder="Description courte de votre portfolio (160 caractères max)"
            />
            <p style={s.helpText}>{(settings.meta_description || '').length}/160 caractères recommandés</p>
          </div>
        </div>
      </div>

      {/* Bouton Sauvegarder */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          style={s.saveBtn}
          onClick={saveSettings}
          disabled={saving}
          onMouseOver={e => e.currentTarget.style.background = '#cc003d'}
          onMouseOut={e => e.currentTarget.style.background = '#FF014F'}
        >
          {saving
            ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sauvegarde...</>
            : <><Save size={18} /> Sauvegarder les paramètres</>
          }
        </button>
        {!saving && <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Les modifications sont appliquées immédiatement.</p>}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
