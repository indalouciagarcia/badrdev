import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

export default function QuoteCTA() {
  const navigate = useNavigate();

  const handleRequestQuote = (e) => {
    e.preventDefault();
    navigate('/devis');
  };

  return (
    <div style={{
      background: '#1b1b1c',
      padding: '3rem 2rem',
      borderRadius: '24px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Décor cercle en fond */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '150px', height: '150px',
        background: 'rgba(255,1,79,0.06)', borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-30px', left: '-30px',
        width: '100px', height: '100px',
        background: 'rgba(255,1,79,0.04)', borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Icône */}
      <div style={{
        width: '68px',
        height: '68px',
        background: 'rgba(255,1,79,0.12)',
        color: '#FF014F',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        border: '2px solid rgba(255,1,79,0.2)',
        position: 'relative',
        zIndex: 1,
      }}>
        <FileText size={30} />
      </div>

      {/* Titre */}
      <h3 style={{
        fontSize: '1.6rem',
        fontWeight: '800',
        marginBottom: '1rem',
        color: '#ffffff',
        lineHeight: '1.3',
        position: 'relative',
        zIndex: 1,
      }}>
        Prêt à démarrer votre projet ?
      </h3>

      {/* Description */}
      <p style={{
        color: '#9f9f9f',
        marginBottom: '2rem',
        lineHeight: '1.7',
        fontSize: '1rem',
        position: 'relative',
        zIndex: 1,
      }}>
        Obtenez une estimation détaillée, structurée et rapide pour votre développement Web, Mobile ou Consulting.
      </p>

      {/* Bouton CTA */}
      <button
        onClick={handleRequestQuote}
        style={{
          background: '#FF014F',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(255,1,79,0.4)',
          position: 'relative',
          zIndex: 1,
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#cc003d';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,1,79,0.5)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#FF014F';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,1,79,0.4)';
        }}
      >
        Demander un devis
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
