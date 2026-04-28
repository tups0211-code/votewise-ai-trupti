import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ElectionTimeline = () => {
  const [activeStage, setActiveStage] = useState(1);
  const { t } = useLanguage();

  const timelineStages = [
    {
      id: 1,
      title: t('timeline', 'stage1Title') || 'Election Announced',
      description: t('timeline', 'stage1Desc') || 'The Election Commission formally announces the dates for polling, counting, and the model code of conduct comes into effect.',
      details: t('timeline', 'stage1Details') || 'During this stage, the election body publishes a notification detailing the constituencies going to polls and the overall schedule. Political parties begin finalizing their strategies.',
      color: 'from-blue-electric to-cyan-bright',
      bgColor: 'bg-blue-electric'
    },
    {
      id: 2,
      title: t('timeline', 'stage2Title') || 'Nominations',
      description: t('timeline', 'stage2Desc') || 'Candidates file their official nomination papers to contest the elections.',
      details: t('timeline', 'stage2Details') || 'Candidates must submit their forms along with required affidavits declaring their assets, criminal records (if any), and educational qualifications. There is a scrutiny period, followed by a window for withdrawal of nominations.',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500'
    },
    {
      id: 3,
      title: t('timeline', 'stage3Title') || 'Campaigning',
      description: t('timeline', 'stage3Desc') || 'Political parties and candidates actively campaign to reach out to voters.',
      details: t('timeline', 'stage3Details') || 'Campaigning involves rallies, door-to-door visits, manifestos, and media advertisements. It strictly stops 48 hours before the voting day to ensure a peaceful polling environment.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500'
    },
    {
      id: 4,
      title: t('timeline', 'stage4Title') || 'Voting Day',
      description: t('timeline', 'stage4Desc') || 'Registered voters cast their ballots at designated polling booths.',
      details: t('timeline', 'stage4Details') || 'Voters must carry valid identification. Electronic Voting Machines (EVMs) or ballot papers are used. The process is overseen by polling officers to ensure secrecy and fairness.',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500'
    },
    {
      id: 5,
      title: t('timeline', 'stage5Title') || 'Counting',
      description: t('timeline', 'stage5Desc') || 'Votes cast across all booths are counted under the supervision of returning officers.',
      details: t('timeline', 'stage5Details') || 'EVMs are opened in the presence of candidate representatives. The counting process is transparent and highly secure, usually taking a full day to complete.',
      color: 'from-emerald-accent to-teal-400',
      bgColor: 'bg-emerald-accent'
    },
    {
      id: 6,
      title: t('timeline', 'stage6Title') || 'Results',
      description: t('timeline', 'stage6Desc') || 'Official declaration of winning candidates and the formation of the new government.',
      details: t('timeline', 'stage6Details') || 'The candidate with the most votes in a constituency is declared the winner. The party or coalition with a majority of seats forms the government.',
      color: 'from-cyan-bright to-blue-400',
      bgColor: 'bg-cyan-bright'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/50 rounded-full text-indigo-dark text-xs font-bold tracking-widest uppercase mb-6"
        >
          <LayoutGrid size={14} className="text-blue-electric" /> {t('timeline', 'badge')}
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-slate-900"
        >
          {t('timeline', 'title')}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-normal"
        >
          {t('timeline', 'desc')}
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12">
        {/* Stepper Navigation */}
        <div className="w-full md:w-1/3 flex flex-col gap-3 relative">
          <div className="absolute left-[1.6rem] top-8 bottom-8 w-[2px] bg-slate-200 hidden md:block rounded-full"></div>
          {timelineStages.map((stage) => {
            const isActive = activeStage === stage.id;
            const isPast = activeStage > stage.id;
            
            return (
              <motion.button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stage.id * 0.1 }}
                className={`relative flex items-center text-left p-4 rounded-2xl transition-all duration-300 z-10 border ${
                  isActive ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-slate-200 scale-[1.02]' : 'bg-transparent hover:bg-white/60 border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex-shrink-0 mr-4 relative">
                  {isPast ? (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : isActive ? (
                    <div className="relative">
                      <div className={`absolute -inset-2 bg-gradient-to-r ${stage.color} rounded-full opacity-20 animate-pulse`}></div>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stage.color} text-white flex items-center justify-center text-sm font-black shadow-lg ring-4 ring-white relative z-10`}>
                        {stage.id}
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-sm font-bold shadow-sm">
                      {stage.id}
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className={`font-bold text-base transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    {stage.title}
                  </h3>
                </div>
                {isActive && (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            {timelineStages.map((stage) => (
              activeStage === stage.id && (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 relative h-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.color} shadow-sm flex items-center justify-center text-white font-bold text-lg`}>
                      {stage.id}
                    </div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('timeline', 'stage')} {stage.id} {t('timeline', 'of')} {timelineStages.length}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">{stage.title}</h2>
                  <p className="text-xl text-slate-600 mb-10 leading-relaxed">{stage.description}</p>
                  
                  <div className="mt-auto bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.bgColor}`}></div> {t('timeline', 'details')}
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-lg">{stage.details}</p>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ElectionTimeline;
