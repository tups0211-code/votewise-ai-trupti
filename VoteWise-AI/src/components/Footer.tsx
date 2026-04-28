import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 py-8 text-center mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="flex justify-center items-center gap-2 text-sm">
          {t('footer', 'builtWith')} <Heart size={16} className="text-red-500" /> {t('footer', 'forGoogle')}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {t('footer', 'empowering')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
