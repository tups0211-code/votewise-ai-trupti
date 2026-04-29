import React, { useState } from 'react';
import { MapPin, Search, Navigation, Info, LocateFixed, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLanguage } from '../contexts/LanguageContext';

const mockBooths = [
  { id: 1, name: 'St. Mary High School', address: '123 Education Rd, City Center', distance: '0.8 km', type: 'Primary' },
  { id: 2, name: 'Community Hall Block B', address: '45 Residential Ave, South Wing', distance: '1.2 km', type: 'Secondary' },
  { id: 3, name: 'City Municipal Office', address: '88 Admin Circle, Downtown', distance: '2.5 km', type: 'Secondary' },
];

const PollingBooth = () => {
  const [pinCode, setPinCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [booths, setBooths] = useState<any[]>(mockBooths);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { t } = useLanguage();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      try {
        const query = `[out:json];(node["amenity"~"school|college|townhall|community_centre"](around:5000,${lat},${lon});way["amenity"~"school|college|townhall|community_centre"](around:5000,${lat},${lon}););out center 5;`;
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
          const realBooths = data.elements.map((el: any, index: number) => {
            const elLat = el.lat || el.center?.lat;
            const elLon = el.lon || el.center?.lon;
            const distance = calculateDistance(lat, lon, elLat, elLon);
            return {
              id: el.id,
              name: el.tags?.name || `Local Polling Center ${index + 1}`,
              address: `${el.tags?.['addr:street'] || el.tags?.['addr:city'] || el.tags?.['addr:suburb'] || 'Nearby Region'}`,
              distance: `${distance} km`,
              type: index === 0 ? 'Primary' : 'Secondary',
              lat: elLat,
              lon: elLon
            };
          }).sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));
          
          setBooths(realBooths);
          setPinCode('Current Location');
          setSearched(true);
        } else {
          alert("No polling locations found nearby. Showing default mock data.");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        alert("Failed to fetch real locations. Please try again or use PIN code.");
      } finally {
        setIsLoadingLocation(false);
      }
    }, () => {
      alert("Unable to retrieve your location");
      setIsLoadingLocation(false);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 6 || isNaN(Number(pinCode))) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    const seed = parseInt(pinCode.substring(0, 3)) + parseInt(pinCode.substring(3));
    
    const possibleNames = [
      'St. Mary High School', 'Community Hall Block B', 'City Municipal Office',
      'Govt. Boys School', 'Zilla Parishad Primary School', 'Public Library',
      'Community Center', 'Gram Panchayat Office', 'New Age College',
      'Vidya Mandir School', 'Town Hall', 'Municipal Sports Complex'
    ];
    
    const possibleStreets = [
      'Education Rd', 'Residential Ave', 'Admin Circle', 
      'Station Road', 'Main Bazaar', 'Temple Street',
      'Gandhi Marg', 'Patel Avenue', 'Link Road',
      'College Road', 'Market Street', 'Civil Lines'
    ];

    const newBooths = [];
    for (let i = 0; i < 3; i++) {
      const nameIdx = (seed + i * 7) % possibleNames.length;
      const streetIdx = (seed + i * 3) % possibleStreets.length;
      const distance = ((seed % (i + 3)) * 0.4 + 0.5 + (i * 0.3)).toFixed(1);
      
      newBooths.push({
        id: i + 1,
        name: possibleNames[nameIdx],
        address: `${(seed % 100) + i * 15} ${possibleStreets[streetIdx]}, Area ${pinCode}`,
        distance: `${distance} km`,
        type: i === 0 ? 'Primary' : 'Secondary'
      });
    }
    
    setBooths(newBooths);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pt-32 pb-24">
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[0%] left-[-10%] w-[60%] h-[60%] bg-blue-electric/10 rounded-full mix-blend-multiply filter blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-electric mb-6"
          >
            <MapPin size={32} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            {t('polling', 'title')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl max-w-2xl mx-auto font-normal"
          >
            {t('polling', 'desc')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-grow relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-electric to-cyan-bright rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input
                  type="text"
                  placeholder={t('polling', 'placeholder')}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full pl-16 pr-14 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-electric focus:border-transparent text-xl font-medium transition-all"
                  aria-label="PIN Code"
                />
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={isLoadingLocation}
                  className="absolute right-4 p-2 text-slate-400 hover:text-blue-electric transition-colors focus:outline-none"
                  title="Use My Location"
                >
                  {isLoadingLocation ? <Loader2 size={24} className="animate-spin" /> : <LocateFixed size={24} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-electric transition-colors flex items-center justify-center gap-2 flex-shrink-0"
            >
              {t('polling', 'btn')}
            </button>
          </form>

          <AnimatePresence>
            {searched ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    {t('polling', 'results')} <span className="px-2 py-1 bg-slate-100 rounded text-slate-900">{pinCode}</span>
                  </h3>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {booths.map((booth, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={booth.id} 
                      >
                        <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} perspective={1000} scale={1.01} transitionSpeed={2000} gyroscope={true}>
                          <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-electric/30 transition-all duration-300 gap-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer">
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-extrabold text-slate-900 text-xl">{booth.name}</h4>
                                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm ${booth.type === 'Primary' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {booth.type}
                                </span>
                              </div>
                              <p className="text-slate-500 flex items-center gap-2 text-base">
                                <MapPin size={16} className="text-slate-400" /> {booth.address}
                              </p>
                            </div>
                            <div className="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-6">
                              <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('polling', 'distance')}</span>
                                <span className="text-xl font-black text-slate-800">
                                  {booth.distance}
                                </span>
                              </div>
                              <button 
                                className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors text-slate-600" 
                                aria-label="Get Directions"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (booth.lat && booth.lon) {
                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lon}`, '_blank');
                                  } else {
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booth.name + ' ' + booth.address)}`, '_blank');
                                  }
                                }}
                              >
                                <Navigation size={20} />
                              </button>
                            </div>
                          </div>
                        </Tilt>
                      </motion.div>
                    ))}
                  </div>

                  {/* Google Maps Embed Section */}
                  <div className="h-[500px] rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative group">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm">
                      Interactive Map View
                    </div>
                    <iframe
                      title="Google Maps Booth Locator"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(booths[0]?.name + ' ' + booths[0]?.address || 'New Delhi')}&zoom=14`}
                    ></iframe>
                    <div className="absolute inset-0 bg-slate-900/5 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-sm flex gap-3 items-start">
                  <Info className="flex-shrink-0 text-slate-400 mt-0.5" size={18} />
                  <p>{t('polling', 'mock')}</p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-slate-100 mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-lg font-medium">{t('polling', 'enter')}</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default PollingBooth;
