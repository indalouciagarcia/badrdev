import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import BackToTop from '../components/BackToTop.jsx'
import ChatPopup from '../components/ChatPopup.jsx'
import FloatingQuoteButton from '../components/FloatingQuoteButton.jsx'
import WhatsAppButton from '../components/WhatsAppButton.jsx'

function MainLayout() {
  const location = useLocation()
  const [gaLoaded, setGaLoaded] = useState(false)

  // ── Scroll to top on route change ──
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // ── Injection Google Analytics ──
  useEffect(() => {
    const injectGA = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['ga_measurement_id', 'ga_enabled'])

        if (error || !data) return

        const map = {}
        data.forEach(s => { map[s.key] = s.value })

        const gaId = map['ga_measurement_id']?.trim()
        const gaEnabled = map['ga_enabled'] === 'true'

        if (!gaEnabled || !gaId || !/^G-[A-Z0-9]{6,}$/.test(gaId)) return
        if (gaLoaded) return // déjà injecté

        // Vérifier si le script existe déjà
        if (document.querySelector(`script[data-ga-id="${gaId}"]`)) return

        // Injecter le script gtag
        const script1 = document.createElement('script')
        script1.async = true
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
        script1.setAttribute('data-ga-id', gaId)
        document.head.appendChild(script1)

        const script2 = document.createElement('script')
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `
        document.head.appendChild(script2)

        setGaLoaded(true)
        console.log('[GA] Google Analytics injecté :', gaId)
      } catch (err) {
        // Silencieux en production
        console.warn('[GA] Impossible de charger les paramètres GA :', err.message)
      }
    }

    injectGA()
  }, []) // une seule fois au montage

  // ── Suivi des changements de page (SPA) ──
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      })
    }
  }, [location.pathname])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
      <ChatPopup />
      <FloatingQuoteButton />
      <WhatsAppButton />
    </>
  )
}

export default MainLayout
