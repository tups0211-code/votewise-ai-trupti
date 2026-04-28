import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, Menu, X, Globe, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onPledgeClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPledgeClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const checkPrompt = setInterval(() => {
      if ((window as any).deferredPrompt) {
        setIsInstallable(true);
        clearInterval(checkPrompt);
      }
    }, 500);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      (window as any).deferredPrompt = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearInterval(checkPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) {
      alert("App installation via button is not supported by your browser. Please try adding it manually:\n\n• Chrome/Edge: Click the install icon in the address bar.\n• Safari (iOS): Tap the Share button and select 'Add to Home Screen'.\n• Firefox: Click the menu and select 'Install'.");
      return;
    }
    try {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        (window as any).deferredPrompt = null;
        setIsInstallable(false);
      }
    } catch (err) {
      console.error("Installation error:", err);
    }
  };

  const links = [
    { name: t('nav', 'timeline'), path: '/timeline' },
    { name: t('nav', 'eligibility'), path: '/eligibility' },
    { name: t('nav', 'guide'), path: '/guide' },
    { name: t('nav', 'polling'), path: '/polling-booth' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-full max-w-6xl rounded-2xl pointer-events-auto transition-all duration-500 ${
          scrolled 
            ? 'glass-panel bg-indigo-dark/70 py-3 px-4' 
            : 'bg-transparent py-4 px-2'
        }`}
      >
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center gap-3 group px-2">
            <div className="bg-gradient-to-br from-blue-electric to-cyan-bright text-white p-2 rounded-xl shadow-lg shadow-blue-electric/30 group-hover:scale-105 transition-transform duration-300">
              <Vote size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-sm">
              VoteWise <span className="text-cyan-bright">AI</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex md:items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-5 py-2 text-sm font-semibold transition-colors duration-300 group"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-lg shadow-inner"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {/* Hover Underline */}
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-bright opacity-0 group-hover:opacity-100 transition-all duration-300 ${isActive ? 'scale-0' : 'scale-100'}`} />
                </Link>
              );
            })}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md">
              {(['English', 'Hindi', 'Marathi'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${language === lang ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  {lang.substring(0, 3).toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPledgeClick?.()}
              className="px-6 py-2.5 bg-white text-indigo-dark hover:bg-slate-50 rounded-xl text-sm font-bold shadow-lg shadow-white/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              {t('nav', 'pledge')}
            </button>
            
            {isInstalled ? (
              <div className="px-4 py-2.5 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 hidden md:flex">
                Installed
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className={`px-4 py-2.5 ${isInstallable ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'} border rounded-xl text-sm font-bold transition-all flex items-center gap-2`}
                title={isInstallable ? "Install App" : "Install (Browser Menu)"}
              >
                <Download size={16} /> <span className="hidden lg:inline">{isInstallable ? 'Install' : 'Get App'}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden pr-2 gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Slide-in */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="p-4 bg-indigo-dark/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl space-y-1">
                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-1 mb-4">
                  {(['English', 'Hindi', 'Marathi'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${language === lang ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-5 py-3.5 rounded-xl text-base font-semibold transition-all ${
                        isActive 
                          ? 'bg-blue-electric/20 text-blue-300' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="pt-4 mt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onPledgeClick?.();
                    }}
                    className="block w-full text-center px-5 py-4 text-base font-bold text-indigo-dark bg-white rounded-xl shadow-lg"
                  >
                    {t('nav', 'pledge')}
                  </button>
                  {!isInstalled ? (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleInstallClick();
                      }}
                      className={`block w-full text-center px-5 py-4 mt-3 text-base font-bold rounded-xl border ${isInstallable ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30' : 'text-slate-300 bg-slate-800 border-slate-700'}`}
                    >
                      {isInstallable ? 'Install App' : 'Add to Home Screen'}
                    </button>
                  ) : (
                    <div className="block w-full text-center px-5 py-4 mt-3 text-base font-bold text-slate-400 bg-white/5 rounded-xl border border-white/10">
                      App Installed
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default Navbar;
