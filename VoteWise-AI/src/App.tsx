import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ElectionTimeline from './pages/ElectionTimeline';
import EligibilityChecker from './pages/EligibilityChecker';
import VotingGuide from './pages/VotingGuide';
import PollingBooth from './pages/PollingBooth';
import ChatBot from './components/ChatBot';
import PledgeModal from './components/PledgeModal';
import { useState } from 'react';

function App() {
  const [isPledgeOpen, setIsPledgeOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar onPledgeClick={() => setIsPledgeOpen(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/timeline" element={<ElectionTimeline />} />
            <Route path="/eligibility" element={<EligibilityChecker />} />
            <Route path="/guide" element={<VotingGuide />} />
            <Route path="/polling-booth" element={<PollingBooth />} />
          </Routes>
        </main>
        <PledgeModal isOpen={isPledgeOpen} onClose={() => setIsPledgeOpen(false)} />
        <ChatBot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
