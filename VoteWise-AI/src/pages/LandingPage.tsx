import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, UserCheck, BookOpen, MapPin, ArrowRight, Sparkles, Box, LayoutGrid } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const { t } = useLanguage();

  const features = [
    {
      title: t('nav', 'timeline'),
      description: t('hero', 'featuresDesc'), // Reusing for simplicity, or ideally a specific desc
      icon: <Calendar className="w-6 h-6 text-blue-electric" />,
      link: '/timeline',
      hoverBorder: 'hover:border-blue-electric/50',
      shadowColor: 'hover:shadow-blue-electric/20'
    },
    {
      title: t('nav', 'eligibility'),
      description: t('eligibility', 'desc'),
      icon: <UserCheck className="w-6 h-6 text-emerald-accent" />,
      link: '/eligibility',
      hoverBorder: 'hover:border-emerald-accent/50',
      shadowColor: 'hover:shadow-emerald-accent/20'
    },
    {
      title: t('nav', 'guide'),
      description: t('guide', 'desc'),
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      link: '/guide',
      hoverBorder: 'hover:border-purple-500/50',
      shadowColor: 'hover:shadow-purple-500/20'
    },
    {
      title: t('nav', 'polling'),
      description: t('polling', 'desc'),
      icon: <MapPin className="w-6 h-6 text-orange-500" />,
      link: '/polling-booth',
      hoverBorder: 'hover:border-orange-500/50',
      shadowColor: 'hover:shadow-orange-500/20'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-indigo-dark pt-40 pb-32 lg:pt-52 lg:pb-48 text-white flex items-center justify-center isolate">
        
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-electric/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[80%] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-cyan-bright/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+Cjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]"></div>
        </div>

        {/* Floating 3D Elements using Framer Motion Parallax */}
        <motion.div style={{ y: y1 }} className="absolute hidden lg:flex top-32 left-20 w-24 h-24 glass-panel rounded-2xl items-center justify-center animate-float">
          <Box className="w-10 h-10 text-cyan-bright" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute hidden lg:flex bottom-40 right-20 w-32 h-32 glass-panel rounded-full items-center justify-center animate-float-delayed">
          <LayoutGrid className="w-12 h-12 text-purple-400" />
        </motion.div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-bright text-xs font-bold tracking-widest uppercase mb-8 shadow-2xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('hero', 'badge')}</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              {t('hero', 'title1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-blue-electric drop-shadow-sm">
                {t('hero', 'title2')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
              {t('hero', 'desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
              <Link to="/timeline" className="group px-8 py-4 bg-white text-indigo-dark rounded-2xl font-bold text-base transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 transform hover:-translate-y-1">
                {t('hero', 'btn1')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/guide" className="px-8 py-4 glass-panel text-white rounded-2xl font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                {t('hero', 'btn2')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fading edge */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-slate-50 relative -mt-10 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
            >
              {t('hero', 'featuresTitle')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto"
            >
              {t('hero', 'featuresDesc')}
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Link 
                  to={feature.link} 
                  className={`group flex flex-col h-full bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.shadowColor} ${feature.hoverBorder}`}
                >
                  <div className="flex flex-col h-full flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-electric transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    
                    <div className="mt-10 mt-auto flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-electric transition-colors uppercase tracking-widest">
                      {t('hero', 'explore')} 
                      <ArrowRight size={16} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
