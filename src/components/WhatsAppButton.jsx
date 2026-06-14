import { useState } from 'react';

const WHATSAPP_NUMBER = '212603411160'; // +212 603 411 160
const WHATSAPP_MESSAGE = encodeURIComponent("Bonjour Badr, je vous contacte depuis votre portfolio. J'aimerais discuter d'un projet.");

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9997,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: '#25D366',
          color: '#ffffff',
          textDecoration: 'none',
          borderRadius: '50px',
          padding: hovered ? '1rem 1.5rem' : '1rem',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.45)',
          transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Icône WhatsApp SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="white"
          style={{ flexShrink: 0 }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.961 1.395 5.666L.057 23.196a.75.75 0 0 0 .92.92l5.53-1.338A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.643-.49-5.182-1.348l-.371-.214-3.839.929.944-3.839-.228-.38A10 10 0 1 1 12 22z" />
        </svg>

        {/* Label visible au hover */}
        <span style={{
          fontSize: '1.05rem',
          fontWeight: '600',
          maxWidth: hovered ? '160px' : '0',
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.35s ease',
        }}>
          WhatsApp
        </span>
      </a>

      {/* Animation pulse autour du bouton */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .wa-pulse-ring {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 3px solid #25D366;
          animation: wa-pulse 2s ease-out infinite;
          z-index: 9996;
          pointer-events: none;
        }
      `}</style>
      <div className="wa-pulse-ring" />
    </>
  );
}
