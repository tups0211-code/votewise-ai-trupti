import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, User, Building, MapPin, Calendar, CheckCircle, Volume2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CitizenHelpline = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [currentStep, setCurrentStep] = useState('dialing'); // dialing, menu, registration, booth, eligibility, help, goodbye
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setIsCalling(true);
    setCurrentStep('dialing');
    setTimeout(() => setCurrentStep('menu'), 2000);
  };

  const endCall = () => {
    setCurrentStep('goodbye');
    setTimeout(() => {
      setIsCalling(false);
      setCurrentStep('dialing');
    }, 1500);
  };

  const steps: Record<string, { text: string; sub: string; icon: any; options?: { key: string; label: string; next: string }[] }> = {
    dialing: {
      text: "Connecting to Helpline...",
      sub: "1800-VOTE-INFO",
      icon: <PhoneCall className="animate-pulse text-blue-500" size={48} />,
    },
    menu: {
      text: "Welcome to Citizen Information IVR",
      sub: "Please choose from the following options:",
      icon: <Volume2 className="text-slate-400" size={48} />,
      options: [
        { key: "1", label: "Voter Registration", next: "registration" },
        { key: "2", label: "Polling Booth Info", next: "booth" },
        { key: "3", label: "Eligibility Check", next: "eligibility" },
        { key: "4", label: "Voting Day Help", next: "help" },
      ]
    },
    registration: {
      text: "Voter Registration",
      sub: "To register, visit the National Voter Services Portal (NVSP). Press * to return.",
      icon: <User className="text-emerald-500" size={48} />,
    },
    booth: {
      text: "Polling Booth Locator",
      sub: "Check your local polling booth on our website or text your EPIC number to 1950. Press * to return.",
      icon: <MapPin className="text-blue-500" size={48} />,
    },
    eligibility: {
      text: "Eligibility Status",
      sub: "You must be 18+ and an Indian citizen to vote. Ensure your name is in the electoral roll. Press * to return.",
      icon: <CheckCircle className="text-indigo-500" size={48} />,
    },
    help: {
      text: "Live Assistance",
      sub: "All operators are currently busy. Your estimated wait time is 2 minutes. Press * to return.",
      icon: <Calendar className="text-orange-500" size={48} />,
    },
    goodbye: {
      text: "Call Disconnected",
      sub: "Thank you for using VoteWise Helpline.",
      icon: <PhoneOff className="text-red-500" size={48} />,
    }
  };

  const current = steps[currentStep];

  return (
    <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">Innovation Prototype</span>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Citizen HelpLine Simulation</h2>
          <p className="text-slate-500 max-w-md">Experience our proposed IVR-style voice assistant flow for offline accessibility.</p>
        </div>

        {!isCalling ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startCall}
            className="group relative flex items-center justify-center w-64 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-lg shadow-slate-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-electric to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-3">
              <Phone size={20} /> Call Citizen Helpline
            </span>
          </motion.button>
        ) : (
          <div className="w-full max-w-md bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-inner relative overflow-hidden">
             {/* Dynamic Waveform Simulation */}
             <div className="flex justify-center items-center gap-1 mb-8 h-8">
               {[...Array(12)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{ height: isCalling ? [8, 24, 12, 28, 8] : 8 }}
                   transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                   className="w-1 bg-blue-400 rounded-full"
                 />
               ))}
             </div>

             <div className="flex flex-col items-center min-h-[160px]">
               <div className="mb-6">{current.icon}</div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">{current.text}</h3>
               <p className="text-slate-500 text-sm leading-relaxed mb-6 px-4">{current.sub}</p>
               
               {current.options && (
                 <div className="grid grid-cols-2 gap-3 w-full">
                   {current.options.map(opt => (
                     <button
                       key={opt.key}
                       onClick={() => setCurrentStep(opt.next)}
                       className="py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-bold hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
                     >
                       Press {opt.key}: {opt.label}
                     </button>
                   ))}
                 </div>
               )}

               {currentStep !== 'menu' && currentStep !== 'dialing' && currentStep !== 'goodbye' && (
                 <button
                   onClick={() => setCurrentStep('menu')}
                   className="mt-6 text-blue-500 font-bold text-sm hover:underline"
                 >
                   Press * to return to menu
                 </button>
               )}
             </div>

             <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                   <Mic size={18} className="text-slate-500" />
                 </div>
                 <div className="text-left">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Call</p>
                   <p className="text-sm font-mono font-bold text-slate-700">{formatTime(timer)}</p>
                 </div>
               </div>
               <button
                 onClick={endCall}
                 className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
               >
                 <PhoneOff size={24} />
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenHelpline;
