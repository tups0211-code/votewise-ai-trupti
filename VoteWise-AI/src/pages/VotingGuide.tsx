import React, { useState } from 'react';
import { BookOpen, Edit3, CreditCard, MapPin, Vote as VoteIcon, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getGeminiResponse } from '../lib/gemini';

const ExplainWithAI = ({ term }: { term: string }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleExplain = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (explanation) {
      setExplanation(null);
      return;
    }
    setLoading(true);
    const prompt = `Explain the election term "${term}" in 1 simple sentence for a beginner voter in India.`;
    const res = await getGeminiResponse(prompt, language);
    setExplanation(res);
    setLoading(false);
  };

  return (
    <span className="relative inline-flex items-center group">
      <span className="font-bold text-slate-900 border-b-2 border-purple-200 cursor-help" onClick={handleExplain}>
        {term}
        <Sparkles className="inline w-3 h-3 text-purple-500 ml-0.5 mb-1" />
      </span>
      <AnimatePresence>
        {(explanation || loading) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-900 rotate-45 border-l border-t border-slate-700"></div>
            <div className="relative flex gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              {loading ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </div>
              ) : (
                <p>{explanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

const ExplainSectionAI = ({ sectionText }: { sectionText: string }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleSummarize = async () => {
    if (explanation) {
      setExplanation(null);
      return;
    }
    setLoading(true);
    const prompt = `Summarize this election process in 2 very simple sentences for a beginner Indian voter: "${sectionText}"`;
    const res = await getGeminiResponse(prompt, language);
    setExplanation(res);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <button 
        onClick={handleSummarize}
        className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors ml-auto"
      >
        <Sparkles className="w-4 h-4" />
        {language === 'Hindi' ? 'AI से सारांश लें' : language === 'Marathi' ? 'AI सह सारांश घ्या' : 'Summarize with AI'}
      </button>
      <AnimatePresence>
        {(explanation || loading) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl flex gap-3 text-purple-900">
              <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> Generating summary...
                </div>
              ) : (
                <p className="font-medium text-sm leading-relaxed">{explanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VotingGuide = () => {
  const [openSection, setOpenSection] = useState<string | null>('register');
  const { t } = useLanguage();

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const guideSteps = [
    {
      id: 'register',
      title: t('guide', 's1Title'),
      icon: <Edit3 className="w-6 h-6" />,
      gradient: 'from-blue-500 to-indigo-500',
      content: (
        <div className="space-y-4 relative">
          <p className="text-lg">{t('guide', 's1Desc')}</p>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 text-lg">
            <li className="pl-2">{t('guide', 's1L1')}</li>
            <li className="pl-2">{t('guide', 's1L2')}</li>
            <li className="pl-2">{t('guide', 's1L3')}</li>
            <li className="pl-2">{t('guide', 's1L4')}</li>
          </ol>
          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
            <ExplainSectionAI sectionText={`${t('guide', 's1Desc')} ${t('guide', 's1L1')} ${t('guide', 's1L2')} ${t('guide', 's1L3')}`} />
          </div>
        </div>
      )
    },
    {
      id: 'check-id',
      title: t('guide', 's2Title'),
      icon: <CreditCard className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      content: (
        <div className="space-y-4 relative">
          <p className="text-lg">{t('guide', 's2Desc')}</p>
          <ul className="list-disc list-inside space-y-3 text-slate-700 text-lg">
            <li className="pl-2">{t('guide', 's2L1')}</li>
            <li className="pl-2"><ExplainWithAI term="EPIC" /> {t('guide', 's2L2').replace('EPIC', '')}</li>
            <li className="pl-2">{t('guide', 's2L3')}</li>
          </ul>
          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
            <ExplainSectionAI sectionText={`${t('guide', 's2Desc')} ${t('guide', 's2L1')} ${t('guide', 's2L2')}`} />
          </div>
        </div>
      )
    },
    {
      id: 'find-booth',
      title: t('guide', 's3Title'),
      icon: <MapPin className="w-6 h-6" />,
      gradient: 'from-orange-500 to-amber-500',
      content: (
        <div className="space-y-4 relative">
          <p className="text-lg">{t('guide', 's3Desc')}</p>
          <ul className="list-disc list-inside space-y-3 text-slate-700 text-lg">
            <li className="pl-2">{t('guide', 's3L1')}</li>
            <li className="pl-2">{t('guide', 's3L2')}</li>
            <li className="pl-2">{t('guide', 's3L3')}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'cast-vote',
      title: t('guide', 's4Title'),
      icon: <VoteIcon className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-500',
      content: (
        <div className="space-y-4 relative">
          <p className="text-lg">{t('guide', 's4Desc')}</p>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 text-lg">
            <li className="pl-2">{t('guide', 's4L1')}</li>
            <li className="pl-2">{t('guide', 's4L2')}</li>
            <li className="pl-2">{t('guide', 's4L3')}</li>
            <li className="pl-2"><ExplainWithAI term="EVM" /> {t('guide', 's4L4').replace('EVM', '')}</li>
          </ol>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900 pb-32 pt-24">
        {/* CSS Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-500 to-indigo-600 text-white mb-8 shadow-2xl shadow-purple-500/30 ring-4 ring-white/10"
          >
            <BookOpen size={40} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-sm"
          >
            {t('guide', 'title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{t('guide', 'title2')}</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 font-medium max-w-2xl mx-auto"
          >
            {t('guide', 'desc')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-20 space-y-6">
        {guideSteps.map((step, idx) => {
          const isOpen = openSection === step.id;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              key={step.id} 
              className={`bg-white rounded-[2rem] overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200' : 'shadow-lg hover:shadow-xl border border-slate-100'}`}
            >
              <button
                onClick={() => toggleSection(step.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 bg-white hover:bg-slate-50/50 transition-colors focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl text-white bg-gradient-to-br ${step.gradient} shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{step.title}</h3>
                </div>
                <div className={`p-2 rounded-full bg-slate-50 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-slate-100 text-slate-600' : ''}`}>
                  <ChevronDown size={24} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-8 md:p-10 bg-slate-50/50 text-slate-800 leading-relaxed">
                      {step.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VotingGuide;
