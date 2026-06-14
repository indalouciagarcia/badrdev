import { useState, useEffect } from 'react';
import QuoteModal from './QuoteModal';

export default function FloatingQuoteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà vu le teaser durant cette session
    const hasSeen = sessionStorage.getItem('hasSeenQuoteTeaser');
    if (hasSeen === 'true') return;

    let timer;
    let opened = false;

    const triggerOpen = () => {
      if (opened) return;
      opened = true;
      setIsModalOpen(true);
      sessionStorage.setItem('hasSeenQuoteTeaser', 'true');
      
      // Nettoyer les écouteurs et timers une fois ouvert
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };

    const handleScroll = () => {
      if (window.scrollY > 300) {
        triggerOpen();
      }
    };

    // Déclencheur après 8 secondes
    timer = setTimeout(() => {
      triggerOpen();
    }, 8000);

    // Déclencheur au défilement (scroll)
    window.addEventListener('scroll', handleScroll);

    // Supporte également le déclencheur manuel si nécessaire
    const handleManualOpen = () => {
      setIsModalOpen(true);
      sessionStorage.setItem('hasSeenQuoteTeaser', 'true');
    };
    window.addEventListener('openQuoteModal', handleManualOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openQuoteModal', handleManualOpen);
    };
  }, []);

  return (
    <QuoteModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
  );
}
