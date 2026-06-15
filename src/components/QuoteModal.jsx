import { useNavigate } from 'react-router-dom';
import { X, Sparkles, FileText, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './QuoteModal.css';

export default function QuoteModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStartQuote = () => {
    onClose();
    navigate('/devis');
  };

  return (
    <div className="quote-modal-overlay" onClick={onClose}>
      <div 
        className="quote-modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        <button className="quote-modal-close" onClick={onClose} aria-label="Fermer">
          <X size={24} />
        </button>

        <div className="quote-modal-body" style={{ padding: '3.5rem 2.5rem 3rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, rgba(255, 1, 79, 0.15) 0%, rgba(255, 73, 74, 0.15) 100%)',
            color: '#FF014F',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem',
            boxShadow: '0 0 25px rgba(255, 1, 79, 0.2)'
          }}>
            <Sparkles size={36} />
          </div>

          <h3 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', marginBottom: '1rem', lineHeight: '1.2' }}>
            Prêt à lancer votre projet ?
          </h3>
          <p style={{ color: '#64748b', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Estimez le coût de votre développement web, mobile ou consulting technique en moins de 2 minutes.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            textAlign: 'left',
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '20px',
            marginBottom: '2.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Zap size={22} color="#FF014F" style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#334155', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>Estimation rapide & gratuite</strong>
                <p style={{ color: '#64748b', fontSize: '1.02rem', margin: 0, lineHeight: '1.5' }}>Réponse et étude personnalisée sous 48 heures.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <FileText size={22} color="#FF014F" style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#334155', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>Génération de devis structuré</strong>
                <p style={{ color: '#64748b', fontSize: '1.02rem', margin: 0, lineHeight: '1.5' }}>Recevez une estimation formelle avec référence unique.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <ShieldCheck size={22} color="#FF014F" style={{ marginTop: '4px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#334155', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>100% Confidentiel</strong>
                <p style={{ color: '#64748b', fontSize: '1.02rem', margin: 0, lineHeight: '1.5' }}>Vos données et idées de projets sont entièrement protégées.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartQuote}
            className="quote-btn-submit"
            style={{
              padding: '1.15rem 2.5rem',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              margin: '0 auto',
              borderRadius: '14px',
              border: 'none',
              color: 'white',
              background: 'linear-gradient(135deg, #FF014F 0%, #FF494A 100%)',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Demander mon devis
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
