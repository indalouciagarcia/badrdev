import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Mail, Trash2, Check, CheckSquare, Loader2, Eye, Calendar, User } from 'lucide-react';
import '../Dashboard.css';

export default function DashboardMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
      // If a message is selected, keep it updated
      if (selectedMessage) {
        const updatedSelected = data?.find(m => m.id === selectedMessage.id);
        if (updatedSelected) setSelectedMessage(updatedSelected);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message définitivement ?')) return;

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      handleMarkAsRead(msg.id, true);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading && messages.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner text-indigo" size={32} />
        <p>Chargement de la boîte de réception...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Boîte de Réception</h1>
          <p>Lisez et gérez les messages envoyés par vos visiteurs depuis le formulaire de contact.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card projects">
          <div className="stat-icon-wrapper">
            <Mail size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Messages</h3>
            <p className="stat-number">{messages.length}</p>
          </div>
        </div>
        <div className="stat-card active-services" style={{ borderLeftColor: unreadCount > 0 ? 'var(--rose-primary)' : 'var(--emerald-primary)' }}>
          <div className="stat-icon-wrapper" style={{ background: unreadCount > 0 ? 'var(--rose-glow)' : 'var(--emerald-glow)', color: unreadCount > 0 ? 'var(--rose-primary)' : 'var(--emerald-primary)' }}>
            <Mail size={24} />
          </div>
          <div className="stat-content">
            <h3>Messages non lus</h3>
            <p className="stat-number">{unreadCount}</p>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="no-data">
          <Mail size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Votre boîte de réception est vide pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Messages List */}
          <div className="dashboard-section" style={{ padding: '1.25rem', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Discussions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => handleSelectMessage(msg)}
                  style={{
                    background: selectedMessage?.id === msg.id ? 'var(--indigo-glow)' : '#f8fafc',
                    border: '1px solid',
                    borderColor: selectedMessage?.id === msg.id ? 'var(--indigo-primary)' : '#e2e8f0',
                    padding: '1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {!msg.is_read && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      background: 'var(--rose-primary)',
                      borderRadius: '50%'
                    }}></span>
                  )}
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: msg.is_read ? '600' : '800', color: '#0f172a', paddingRight: '1rem' }}>
                    {msg.name}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: msg.is_read ? '500' : '700', color: '#475569' }}>
                    {msg.subject || 'Sans sujet'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>{new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail Panel */}
          <div className="dashboard-section" style={{ minHeight: '350px' }}>
            {selectedMessage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 0.25rem 0' }}>{selectedMessage.subject || 'Sans sujet'}</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={13} />
                        <strong>{selectedMessage.name}</strong>
                      </span>
                      <span>&bull;</span>
                      <span>{selectedMessage.email}</span>
                      <span>&bull;</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} />
                        {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.is_read)} 
                      className="btn-primary" 
                      style={{ padding: '0.5rem', background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}
                      title={selectedMessage.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    >
                      {selectedMessage.is_read ? <Mail size={16} /> : <CheckSquare size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteMessage(selectedMessage.id)} 
                      className="btn-danger" 
                      style={{ padding: '0.5rem' }}
                      title="Supprimer ce message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid #f1f5f9',
                  minHeight: '200px',
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  color: '#334155',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedMessage.message}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || ''}`} 
                    className="btn-primary"
                  >
                    <span>Répondre par email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#94a3b8' }}>
                <Eye size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p>Sélectionnez un message dans la liste de gauche pour l'afficher.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
