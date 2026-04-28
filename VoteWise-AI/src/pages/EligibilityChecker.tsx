import React, { useState } from 'react';
import { UserCheck, AlertCircle, Info, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeEligibility } from '../lib/gemini';

const EligibilityChecker = () => {
  const [age, setAge] = useState<string>('');
  const [result, setResult] = useState<'empty' | 'eligible' | 'ineligible' | 'invalid'>('empty');
  const [explanation, setExplanation] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { language, t } = useLanguage();

  const checkEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age.trim()) return;
    
    setIsAnalyzing(true);
    setResult('empty');
    
    const analysis = await analyzeEligibility(age, language);
    
    setResult(analysis.status as any);
    setExplanation(analysis.explanation);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pt-32 pb-24">
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-accent/10 rounded-full mix-blend-multiply filter blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-electric/10 rounded-full mix-blend-multiply filter blur-[100px]"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 text-emerald-accent mb-6"
          >
            <UserCheck size={32} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            {t('eligibility', 'title')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl max-w-xl mx-auto"
          >
            {t('eligibility', 'desc')}
          </motion.p>
        </div>

        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={2000} gyroscope={true}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8"
          >
            <form onSubmit={checkEligibility} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="age" className="sr-only">Enter your age</label>
                <input
                  type="text"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('eligibility', 'placeholder')}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-accent focus:border-emerald-accent transition-all text-xl font-medium"
                  aria-label="Situation input"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-emerald-accent transition-colors flex-shrink-0 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />} 
                {isAnalyzing ? '...' : t('eligibility', 'btn')}
              </button>
            </form>
          </motion.div>
        </Tilt>

        <AnimatePresence mode="wait">
          {result !== 'empty' && (
            <motion.div
              key={result}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`rounded-[2rem] p-8 md:p-10 border shadow-sm relative overflow-hidden ${
                result === 'eligible' ? 'bg-emerald-50/50 border-emerald-100' :
                result === 'ineligible' ? 'bg-orange-50/50 border-orange-100' :
                'bg-red-50/50 border-red-100'
              }`}
            >
              {result === 'eligible' && (
                <div>
                  <div className="flex items-center gap-4 text-emerald-800 font-extrabold text-3xl mb-4">
                    <CheckCircle2 size={36} className="text-emerald-500" />
                    {t('eligibility', 'eligible')}
                  </div>
                  <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-emerald-200/50 mb-8">
                    <Sparkles className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <p className="text-emerald-800 text-lg font-medium">{explanation}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50">
                    <h4 className="font-bold text-emerald-900 mb-4 text-sm uppercase tracking-wider">{t('eligibility', 'nextSteps')}</h4>
                    <ul className="space-y-3 text-emerald-800 text-base">
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div> {t('eligibility', 'step1')}</li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div> {t('eligibility', 'step2')}</li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div> {t('eligibility', 'step3')}</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {result === 'ineligible' && (
                <div>
                  <div className="flex items-center gap-4 text-orange-800 font-extrabold text-3xl mb-4">
                    <Info size={36} className="text-orange-500" />
                    {t('eligibility', 'ineligible')}
                  </div>
                  <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-orange-200/50 mb-8">
                    <Sparkles className="text-orange-500 shrink-0 mt-1" size={20} />
                    <p className="text-orange-800 text-lg font-medium">{explanation}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100/50">
                    <h4 className="font-bold text-orange-900 mb-4 text-sm uppercase tracking-wider">{t('eligibility', 'now')}</h4>
                    <ul className="space-y-3 text-orange-800 text-base">
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></div> {t('eligibility', 'now1')}</li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></div> {t('eligibility', 'now2')}</li>
                    </ul>
                  </div>
                </div>
              )}

              {result === 'invalid' && (
                <div>
                  <div className="flex items-center gap-4 text-red-800 font-bold text-xl mb-3">
                    <AlertCircle size={28} className="text-red-500 shrink-0" />
                    {t('eligibility', 'invalid')}
                  </div>
                  <p className="text-red-700 ml-11">{explanation}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EligibilityChecker;
