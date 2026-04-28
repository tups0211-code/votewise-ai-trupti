import React, { useState, useEffect } from 'react';
import { Share2, Download, Award, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PledgeModal: React.FC<PledgeModalProps> = ({ isOpen, onClose }) => {
  const [pledged, setPledged] = useState(false);
  const { t, language } = useLanguage();
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="relative pt-12 px-8 pb-8 text-center z-10">
          <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full animate-pulse opacity-20"></div>
            <Award className="w-10 h-10 text-yellow-500" />
          </div>

          {!pledged ? (
            <>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">{t('pledge', 'title')}</h2>
              <p className="text-slate-600 mb-8 font-medium">
                {t('pledge', 'desc')}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">JD</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-600">SM</div>
                  <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-600">AK</div>
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {language === 'Hindi' ? (
                    <> <span className="font-bold text-slate-900">14,204</span> नागरिकों में शामिल हों </>
                  ) : language === 'Marathi' ? (
                    <> <span className="font-bold text-slate-900">14,204</span> नागरिकांमध्ये सामील व्हा </>
                  ) : (
                    <> Join <span className="font-bold text-slate-900">14,204</span> citizens </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setPledged(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-1"
              >
                {t('pledge', 'btn')}
              </button>
            </>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center mb-4 text-green-500">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{t('pledge', 'completeTitle')}</h2>
              <p className="text-slate-600 mb-8 font-medium">
                {t('pledge', 'completeDesc')}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    try {
                      const canvas = document.createElement('canvas');
                      canvas.width = 800;
                      canvas.height = 800;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;

                      // Background
                      const gradient = ctx.createLinearGradient(0, 0, 800, 800);
                      gradient.addColorStop(0, '#1E1B4B');
                      gradient.addColorStop(1, '#3B82F6');
                      ctx.fillStyle = gradient;
                      ctx.fillRect(0, 0, 800, 800);

                      // Inner Badge Circle
                      ctx.beginPath();
                      ctx.arc(400, 400, 320, 0, 2 * Math.PI);
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                      ctx.fill();
                      ctx.lineWidth = 15;
                      ctx.strokeStyle = '#22D3EE';
                      ctx.stroke();

                      // Text
                      ctx.fillStyle = '#FFFFFF';
                      ctx.textAlign = 'center';
                      ctx.font = 'bold 40px sans-serif';
                      ctx.fillText('VOTEWISE AI', 400, 250);
                      
                      ctx.font = 'black 60px sans-serif';
                      ctx.fillStyle = '#10B981';
                      ctx.fillText(t('pledge', 'badgeLine1'), 400, 400);
                      ctx.fillText(t('pledge', 'badgeLine2'), 400, 500);

                      ctx.fillStyle = '#94A3B8';
                      ctx.font = '24px sans-serif';
                      ctx.fillText(new Date().toLocaleDateString(), 400, 600);

                      // Download
                      const link = document.createElement('a');
                      link.download = 'VoteWise_Pledge_Badge.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    } catch (e) {
                      console.error("Error generating badge", e);
                      alert("Failed to generate badge.");
                    }
                  }}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={18} /> {t('pledge', 'badgeBtn')}
                </button>
                <button
                  onClick={async () => {
                    const shareData = {
                      title: 'VoteWise AI - I Pledged to Vote!',
                      text: t('pledge', 'shareText'),
                      url: window.location.href,
                    };
                    try {
                      if (navigator.share) {
                        await navigator.share(shareData);
                      } else {
                        await navigator.clipboard.writeText(shareData.url);
                        alert(t('pledge', 'copiedMsg'));
                      }
                    } catch (err: any) {
                      if (err.name !== 'AbortError') {
                        console.error("Error sharing:", err);
                      }
                    }
                  }}
                  className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={18} /> {t('pledge', 'shareBtn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PledgeModal;
