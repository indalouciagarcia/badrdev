import { FileText, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function QuoteCTA() {
  const handleRequestQuote = (e) => {
    e.preventDefault();
    // Déclenche l'événement global pour ouvrir le pop-up modal de devis
    const event = new CustomEvent('openQuoteModal');
    window.dispatchEvent(event);
  };

  return (
    <div style={{
      background: 'white',
      padding: '3rem 2rem',
      borderRadius: '24px',
      textAlign: 'center',
      border: '1px solid rgb(226, 232, 240)',
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 10px 25px -5px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Icône Sparkles */}
      <div style={{
        width: '64px',
        height: '64px',
        background: 'rgba(255, 1, 79, 0.08)',
        color: '#FF014F',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: 'rgba(255, 1, 79, 0.1) 0px 0px 20px',
      }}>
        <Sparkles size={32} />
      </div>

      {/* Titre */}
      <h3 style={{
        fontSize: '2.15rem',
        fontWeight: '900',
        color: 'rgb(30, 41, 59)',
        marginBottom: '1rem',
        lineHeight: '1.2',
      }}>
        Prêt à lancer votre projet ?
      </h3>

      {/* Description */}
      <p style={{
        color: 'rgb(100, 116, 139)',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        marginBottom: '2.5rem',
      }}>
        Estimez le coût de votre développement web, mobile ou consulting technique en moins de 2 minutes.
      </p>

      {/* Liste des bénéfices */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        textAlign: 'left',
        background: 'rgb(248, 250, 252)',
        padding: '1.5rem',
        borderRadius: '20px',
        marginBottom: '2.5rem',
        border: '1px solid rgb(226, 232, 240)',
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Zap size={22} color="#FF014F" style={{ marginTop: '4px', flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'rgb(51, 65, 85)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
              Estimation rapide & gratuite
            </strong>
            <p style={{ color: 'rgb(100, 116, 139)', fontSize: '1.02rem', margin: 0, lineHeight: '1.5' }}>
              Réponse et étude personnalisée sous 48 heures.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <FileText size={22} color="#FF014F" style={{ marginTop: '4px', flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'rgb(51, 65, 85)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
              Génération de devis structuré
            </strong>
            <p style={{ color: 'rgb(100, 116, 139)', fontSize: '1.02rem', margin: 0, lineHeight: '1.5' }}>
              Recevez une estimation formelle avec référence unique.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ShieldCheck size={22} color="#FF014F" style={{ marginTop: '4px', flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'rgb(51, 65, 85)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
              100% Confidentiel
            </strong>
            <p style={{ color: 'rgb(100, 116, 139)', fontSize: '1.02rem', margin: 0, lineHeight: '1.5' }}>
              Vos données et idées de projets sont entièrement protégées.
            </p>
          </div>
        </div>
      </div>

      {/* Bouton CTA */}
      <button
        onClick={handleRequestQuote}
        className="quote-btn-submit"
        style={{
          padding: '1.15rem 2.5rem',
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          width: '100%',
          margin: '0px auto',
          borderRadius: '14px',
          border: 'none',
          color: 'white',
          background: 'linear-gradient(135deg, #FF014F 0%, #FF494A 100%)',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: 'rgba(255, 1, 79, 0.25) 0px 8px 20px',
          transition: 'all 0.2s ease',
        }}
      >
        Demander mon devis
        <ArrowRight size={24} />
      </button>
    </div>
  );
}
