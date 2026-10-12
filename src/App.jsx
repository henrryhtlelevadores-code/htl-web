import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import { ThemeProvider } from './lib/theme';
import { FloorProvider } from './lib/floor';

// Floor links are `/#id`; this rides to the floor after every navigation.
const ScrollToFloor = () => {
    const { pathname, hash, key } = useLocation();
    useEffect(() => {
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!hash || hash === '#lobby') {
            window.scrollTo({ top: 0, behavior: hash && smooth ? 'smooth' : 'auto' });
            return;
        }
        // Wait a frame so a freshly mounted home page has laid out its floors.
        const id = requestAnimationFrame(() => {
            document.querySelector(hash)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
        });
        return () => cancelAnimationFrame(id);
    }, [pathname, hash, key]);
    return null;
};

const App = () => (
    <ThemeProvider>
        <FloorProvider>
            <MotionConfig reducedMotion="user">
                <BrowserRouter>
                    <ScrollToFloor />
                    <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ground focus:px-4 focus:py-3 focus:font-semibold">
                        Saltar al contenido
                    </a>
                    <Navbar />
                    <main id="contenido">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/productos" element={<ProductsPage />} />
                            <Route path="/terminos-y-condiciones" element={<TermsPage />} />
                            <Route path="/politicas-de-privacidad" element={<PrivacyPage />} />
                        </Routes>
                    </main>
                    <Footer />
                    <WhatsAppButton />
                </BrowserRouter>
            </MotionConfig>
        </FloorProvider>
    </ThemeProvider>
);

export default App;
