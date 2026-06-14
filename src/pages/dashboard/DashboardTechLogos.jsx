import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabase'
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Image, AlertCircle, CheckCircle } from 'lucide-react'

export default function DashboardTechLogos() {
  const navigate = useNavigate()
  const [logos, setLogos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Form pour ajouter
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', image_url: '', sort_order: 0 })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { fetchLogos() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchLogos = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tech_logos')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      setLogos(data || [])
    } catch (err) {
      showToast('Erreur lors du chargement : ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.image_url.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase.from('tech_logos').update({
          name: form.name, image_url: form.image_url, sort_order: Number(form.sort_order)
        }).eq('id', editingId)
        if (error) throw error
        showToast('Logo mis à jour !')
      } else {
        const { error } = await supabase.from('tech_logos').insert([{
          name: form.name, image_url: form.image_url, sort_order: Number(form.sort_order)
        }])
        if (error) throw error
        showToast('Logo ajouté !')
      }
      setForm({ name: '', image_url: '', sort_order: logos.length + 1 })
      setEditingId(null)
      setShowForm(false)
      await fetchLogos()
    } catch (err) {
      showToast('Erreur : ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return
    try {
      const { error } = await supabase.from('tech_logos').delete().eq('id', id)
      if (error) throw error
      showToast('Logo supprimé')
      await fetchLogos()
    } catch (err) {
      showToast('Erreur : ' + err.message, 'error')
    }
  }

  const toggleActive = async (logo) => {
    try {
      const { error } = await supabase.from('tech_logos')
        .update({ is_active: !logo.is_active }).eq('id', logo.id)
      if (error) throw error
      showToast(logo.is_active ? 'Logo masqué' : 'Logo visible')
      await fetchLogos()
    } catch (err) {
      showToast('Erreur : ' + err.message, 'error')
    }
  }

  const startEdit = (logo) => {
    setForm({ name: logo.name, image_url: logo.image_url, sort_order: logo.sort_order || 0 })
    setEditingId(logo.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setForm({ name: '', image_url: '', sort_order: logos.length + 1 })
    setEditingId(null)
    setShowForm(false)
  }

  // ─── Styles ───
  const s = {
    page: { padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 },
    addBtn: {
      background: '#FF014F', color: 'white', border: 'none', borderRadius: '12px',
      padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: '600',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
    },
    formCard: {
      background: 'white', borderRadius: '16px', padding: '2rem',
      border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      marginBottom: '2rem',
    },
    formTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' },
    input: {
      width: '100%', padding: '0.75rem 1rem', border: '2px solid #e5e7eb',
      borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit',
      boxSizing: 'border-box', outline: 'none', color: '#1e293b',
      transition: 'border-color 0.2s',
    },
    formActions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    saveBtn: {
      background: '#FF014F', color: 'white', border: 'none', borderRadius: '10px',
      padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
    },
    cancelBtn: {
      background: 'transparent', color: '#64748b', border: '2px solid #e2e8f0',
      borderRadius: '10px', padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
    },
    gridLogos: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem',
    },
    logoCard: (active) => ({
      background: 'white', borderRadius: '16px',
      border: active ? '2px solid #e2e8f0' : '2px dashed #e2e8f0',
      padding: '1.25rem', textAlign: 'center',
      opacity: active ? 1 : 0.55,
      transition: 'all 0.2s', position: 'relative',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }),
    logoImg: { width: '80px', height: '50px', objectFit: 'contain', marginBottom: '0.75rem' },
    logoName: { fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' },
    cardActions: { display: 'flex', justifyContent: 'center', gap: '0.5rem' },
    iconBtn: (color) => ({
      width: '34px', height: '34px', borderRadius: '8px',
      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: color + '15', color: color, transition: 'all 0.2s',
    }),
    toast: (type) => ({
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
      background: type === 'success' ? '#059669' : '#ef4444',
      color: 'white', padding: '0.9rem 1.5rem', borderRadius: '12px',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)', fontWeight: '600', fontSize: '0.95rem',
    }),
  }

  return (
    <div style={s.page}>

      {/* Toast */}
      {toast && (
        <div style={s.toast(toast.type)}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🏷️ Logos Technos / Partenaires</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
            {logos.length} logo{logos.length !== 1 ? 's' : ''} — affiché{logos.length !== 1 ? 's' : ''} sur la page d'accueil
          </p>
        </div>
        <button style={s.addBtn} onClick={() => { cancelEdit(); setShowForm(v => !v) }}>
          <Plus size={18} /> {showForm ? 'Annuler' : 'Ajouter un logo'}
        </button>
      </div>

      {/* Formulaire ajout / édition */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editingId ? '✏️ Modifier le logo' : '➕ Ajouter un logo'}</h3>
          <form onSubmit={handleSave}>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Nom de la technologie *</label>
                <input
                  style={s.input} value={form.name} required
                  placeholder="ex: React, Docker, Figma..."
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={s.label}>Ordre d'affichage</label>
                <input
                  type="number" min="0" style={s.input} value={form.sort_order}
                  onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label style={s.label}>URL du logo (image SVG, PNG ou externe) *</label>
              <input
                style={s.input} value={form.image_url} required
                placeholder="ex: /assets/images/our-supported-company/company-logo-1.svg ou https://..."
                onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
              />
            </div>
            {/* Prévisualisation */}
            {form.image_url && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Aperçu :</p>
                <img src={form.image_url} alt="preview" style={{ maxHeight: '60px', maxWidth: '160px', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
            )}
            <div style={s.formActions}>
              <button type="submit" style={s.saveBtn} disabled={saving}>
                {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button type="button" style={s.cancelBtn} onClick={cancelEdit}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Grille des logos */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#FF014F', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Chargement...
        </div>
      ) : logos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
          <Image size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Aucun logo pour l'instant.</p>
          <button style={{ ...s.addBtn, margin: '1rem auto 0', display: 'inline-flex' }}
            onClick={() => setShowForm(true)}>
            <Plus size={18} /> Ajouter le premier logo
          </button>
        </div>
      ) : (
        <div style={s.gridLogos}>
          {logos.map(logo => (
            <div key={logo.id} style={s.logoCard(logo.is_active)}>
              {/* Badge ordre */}
              <span style={{
                position: 'absolute', top: '0.5rem', left: '0.5rem',
                background: '#f1f5f9', color: '#64748b', borderRadius: '6px',
                fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem'
              }}>
                #{logo.sort_order}
              </span>
              {/* Badge actif/inactif */}
              <span style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem',
                background: logo.is_active ? '#d1fae5' : '#fee2e2',
                color: logo.is_active ? '#059669' : '#ef4444',
                borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem'
              }}>
                {logo.is_active ? 'visible' : 'masqué'}
              </span>

              <img
                src={logo.image_url}
                alt={logo.name}
                style={s.logoImg}
                onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><rect width="100" height="60" fill="%23f1f5f9"/><text x="50" y="35" text-anchor="middle" fill="%2394a3b8" font-size="12">IMG</text></svg>' }}
              />
              <p style={s.logoName}>{logo.name}</p>

              <div style={s.cardActions}>
                <button title="Modifier" style={s.iconBtn('#3b82f6')} onClick={() => startEdit(logo)}>
                  <Edit2 size={15} />
                </button>
                <button title={logo.is_active ? 'Masquer' : 'Afficher'} style={s.iconBtn(logo.is_active ? '#f59e0b' : '#10b981')} onClick={() => toggleActive(logo)}>
                  {logo.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button title="Supprimer" style={s.iconBtn('#ef4444')} onClick={() => handleDelete(logo.id, logo.name)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
