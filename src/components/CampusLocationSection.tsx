import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Phone,
  Mail,
  Clock,
  Compass,
  Building2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Bus,
  Shield,
  Layers
} from 'lucide-react';
import { StudentInquiryModal } from './StudentInquiryModal';

export interface CampusLocation {
  id: string;
  name: string;
  tagline: string;
  isMain: boolean;
  address: string;
  city: string;
  country: string;
  position: { lat: number; lng: number };
  zoom: number;
  phone: string;
  email: string;
  hours: string;
  transitInfo: string;
  image: string;

  facilities: string[];
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'main-kumba',
    name: 'Main Campus (Kumba)',
    tagline: 'Principal Academic & Health Sciences Headquarters',
    isMain: true,
    address: 'Alaska Street Junction, Buea Road, Cameroon',
    city: 'Kumba',
    country: 'Cameroon',
    position: { lat: 4.6360, lng: 9.4470 },
    zoom: 15,
    phone: '+237 673 575 151',
    email: 'phhipros.edu@gmail.com',
    hours: 'Mon – Fri: 7:30 AM – 6:30 PM | Sat: 8:00 AM – 2:00 PM',
    transitInfo: 'Direct access along Buea Road via Alaska Street Junction; Student shuttle & campus parking available.',
    image: '/src/assets/images/cameroon_campus_hero_1789756140943.jpg',

    facilities: [
      'Clinical Simulation Ward',
      'High-Performance IT Labs',
      '500-Seat Lecture Amphitheater',
      'Digital E-Library & Study Commons',
      'Student Union & Cafeteria'
    ]
  },
  {
    id: 'yaounde-annex',
    name: 'Yaoundé Academic & Research Annex',
    tagline: 'Clinical Practicum & Government Liaison Center',
    isMain: false,
    address: 'Avenue Winston Churchill, Bastos District, Yaoundé',
    city: 'Yaoundé',
    country: 'Cameroon',
    position: { lat: 3.8480, lng: 11.5021 },
    zoom: 15,
    phone: '+237 675 377 198',
    email: 'phhipros.edu@gmail.com',
    hours: 'Mon – Fri: 8:00 AM – 5:30 PM | Sat: 8:30 AM – 1:00 PM',
    transitInfo: 'Located 300m from Central Bastos Junction; Secure visitor and faculty parking available.',
    image: '/src/assets/images/research_black_students_phhipros_1789756789706.jpg',

    facilities: [
      'Diagnostic Pathology Lab',
      'MINESUP Accreditation Archive',
      'Collaborative Seminar Rooms',
      'Tele-Health Conference Suite'
    ]
  },
];

// Inner controller component to handle camera movements smoothly using the SDK hook
function MapCameraController({ targetLocation }: { targetLocation: CampusLocation }) {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;
    map.panTo(targetLocation.position);
    map.setZoom(targetLocation.zoom);
  }, [map, targetLocation]);

  return null;
}

export function CampusLocationSection() {
  const [selectedCampus, setSelectedCampus] = useState<CampusLocation>(CAMPUS_LOCATIONS[0]);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [mapLoadError, setMapLoadError] = useState<boolean>(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  React.useEffect(() => {
    const handleMapError = () => setMapLoadError(true);
    window.addEventListener('gmp-quota-exceeded', handleMapError);
    return () => window.removeEventListener('gmp-quota-exceeded', handleMapError);
  }, []);

  const handleSelectCampus = (campus: CampusLocation) => {
    setSelectedCampus(campus);
    setInfoWindowOpen(true);
  };

  const handleCopyAddress = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getGoogleMapsDirectionsUrl = (campus: CampusLocation) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${campus.name}, ${campus.address}`
    )}`;
  };

  const embedMapType = mapType === 'satellite' ? 'k' : mapType === 'hybrid' ? 'h' : 'm';
  const embedMapUrl = `https://maps.google.com/maps?q=${selectedCampus.position.lat},${selectedCampus.position.lng}+(${encodeURIComponent(selectedCampus.name)})&t=${embedMapType}&z=${selectedCampus.zoom}&ie=UTF8&iwloc=B&output=embed`;

  return (
    <section id="campus-location" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-700/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00384d]/5 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Compass className="w-3.5 h-3.5" />
            Geographical Locations & Campus Life
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold text-[#00384d] tracking-tight mb-4"
          >
            Visit Our <span className="text-red-700">Campuses</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed"
          >
            Discover our modern learning spaces, cutting-edge biomedical training labs, and
            welcoming community. Explore each campus on our interactive Google Map and plan your visit.
          </motion.p>
        </div>

        {/* Campus Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {CAMPUS_LOCATIONS.map((campus) => {
            const isSelected = selectedCampus.id === campus.id;
            return (
              <button
                key={campus.id}
                onClick={() => handleSelectCampus(campus)}
                type="button"
                className={`text-left p-5 rounded-2xl transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-red-600 shadow-lg shadow-red-900/5 ring-2 ring-red-600/20'
                    : 'bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                {campus.isMain && (
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-800 self-start mb-2">
                    Primary Campus
                  </span>
                )}
                {!campus.isMain && (
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 self-start mb-2">
                    {campus.city}, {campus.country}
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 flex items-center justify-between">
                    {campus.name}
                    {isSelected && <Sparkles className="w-4 h-4 text-red-600 shrink-0" />}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-3">{campus.tagline}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    {campus.city}
                  </span>
                  <span className="text-red-700 font-semibold group-hover:underline">
                    {isSelected ? 'Viewing on map' : 'View on map →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Map & Campus Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left / Top: Interactive Google Map */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-3 shadow-md border border-gray-200/80 flex-1 flex flex-col overflow-hidden">
              {/* Map Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-gray-700">Interactive Map View:</span>
                  <span className="text-gray-500 font-medium">{selectedCampus.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['roadmap', 'satellite', 'hybrid'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setMapType(mode)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        mapType === mode
                          ? 'bg-[#00384d] text-white shadow-xs'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Container with Explicit CSS Height as required by CF2 */}
              <div className="relative w-full h-[420px] md:h-[480px] rounded-2xl overflow-hidden border border-gray-200">
                {apiKey && !mapLoadError ? (
                  <APIProvider apiKey={apiKey}>
                    <Map
                      defaultCenter={selectedCampus.position}
                      defaultZoom={selectedCampus.zoom}
                      mapId="DEMO_MAP_ID"
                      mapTypeId={mapType}
                      gestureHandling="greedy"
                      disableDefaultUI={false}
                      className="w-full h-full"
                      style={{ width: '100%', height: '100%' }}
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    >
                      <MapCameraController targetLocation={selectedCampus} />

                      {/* Render markers for all campuses */}
                      {CAMPUS_LOCATIONS.map((loc) => {
                        const isLocActive = loc.id === selectedCampus.id;
                        return (
                          <AdvancedMarker
                            key={loc.id}
                            position={loc.position}
                            title={loc.name}
                            onClick={() => handleSelectCampus(loc)}
                          >
                            <Pin
                              background={isLocActive ? '#b91c1c' : '#00384d'}
                              borderColor="#ffffff"
                              glyphColor="#ffffff"
                              scale={isLocActive ? 1.25 : 1.0}
                            />
                          </AdvancedMarker>
                        );
                      })}

                      {/* InfoWindow on currently selected campus */}
                      {infoWindowOpen && (
                        <InfoWindow
                          position={selectedCampus.position}
                          onCloseClick={() => setInfoWindowOpen(false)}
                          headerContent={
                            <div className="font-bold text-sm text-[#00384d] pr-2">
                              {selectedCampus.name}
                            </div>
                          }
                        >
                          <div className="max-w-[260px] p-1 text-xs text-gray-700">
                            <img
                              src={selectedCampus.image}
                              alt={selectedCampus.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-24 object-cover rounded-lg mb-2 shadow-xs"
                            />
                            <p className="font-medium text-gray-800 mb-1">{selectedCampus.address}</p>
                            <p className="text-[11px] text-gray-500 mb-2">{selectedCampus.hours}</p>
                            <div className="flex gap-2 pt-1 border-t border-gray-100">
                              <a
                                href={getGoogleMapsDirectionsUrl(selectedCampus)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-1.5 px-2 rounded text-[11px] flex items-center justify-center gap-1 transition-colors"
                              >
                                <Navigation className="w-3 h-3" />
                                Directions
                              </a>
                              <a
                                href={`tel:${selectedCampus.phone}`}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-1.5 px-2 rounded text-[11px] flex items-center justify-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                Call
                              </a>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </APIProvider>
                ) : (
                  <iframe
                    key={`${selectedCampus.id}-${mapType}`}
                    title={`Google Map - ${selectedCampus.name}`}
                    src={embedMapUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                )}

                {/* Floating Quick Navigation Trigger */}
                <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                  <a
                    href={getGoogleMapsDirectionsUrl(selectedCampus)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00384d] hover:bg-[#002736] text-white shadow-lg px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-red-400" />
                    Get Live Directions
                  </a>
                  <button
                    onClick={() => handleCopyAddress(selectedCampus.address, selectedCampus.id)}
                    className="bg-white/95 hover:bg-white text-gray-800 shadow-lg px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-gray-200 transition-all"
                  >
                    {copiedId === selectedCampus.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Map Footer Helper */}
              <div className="pt-3 px-2 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  Click any pin or campus button to view detailed facilities.
                </span>
                <span className="font-mono text-gray-400 text-[10px]">
                  {selectedCampus.position.lat.toFixed(4)}° N, {selectedCampus.position.lng.toFixed(4)}° E
                </span>
              </div>
            </div>
          </div>

          {/* Right / Bottom: Campus Details & Visitor Hub */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200/80 flex-1 flex flex-col">
              {/* Campus Header & Photo Banner */}
              <div className="relative rounded-2xl overflow-hidden mb-6 h-40 shadow-xs border border-gray-100">
                <img
                  src={selectedCampus.image}
                  alt={selectedCampus.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-red-700 px-2 py-0.5 rounded text-white mb-1 inline-block">
                    {selectedCampus.city} Hub
                  </span>
                  <h3 className="text-lg font-bold leading-snug">{selectedCampus.name}</h3>
                </div>
              </div>

              {/* Contact Information List */}
              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex items-start gap-3 text-gray-700">
                  <div className="p-2 rounded-xl bg-red-50 text-red-700 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Address
                    </div>
                    <p className="font-semibold text-gray-900">{selectedCampus.address}</p>
                    <p className="text-xs text-gray-500">
                      {selectedCampus.city}, {selectedCampus.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-700">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#00384d] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Visiting & Office Hours
                    </div>
                    <p className="font-medium text-gray-800">{selectedCampus.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-700">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Transit & Accessibility
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{selectedCampus.transitInfo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${selectedCampus.phone}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-red-700" />
                    <span>{selectedCampus.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedCampus.email}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 truncate transition-colors"
                  >
                    <Mail className="w-4 h-4 text-red-700 shrink-0" />
                    <span className="truncate">{selectedCampus.email}</span>
                  </a>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={getGoogleMapsDirectionsUrl(selectedCampus)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Get Turn-by-Turn Directions
                </a>
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="bg-[#00384d] hover:bg-[#002736] text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-red-400" />
                  Book Campus Tour
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Facilities & Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Building2,
              title: 'Modern Architecture',
              desc: 'Air-conditioned lecture theaters and dedicated student study commons.'
            },
            {
              icon: Shield,
              title: '24/7 Campus Security',
              desc: 'Gated perimeter with round-the-clock security and verified student access.'
            },
            {
              icon: Bus,
              title: 'Student Shuttle',
              desc: 'Daily shuttle transport connecting student residential districts to campus.'
            },
            {
              icon: Layers,
              title: 'Digital High-Speed Wi-Fi',
              desc: 'Campus-wide fiber-optic connectivity for online research and e-learning.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal Integration for booking campus visits */}
      <StudentInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        defaultCategory="Campus & Admin Services"
        defaultSubject={`Campus Visit & Tour Request: ${selectedCampus.name}`}
      />
    </section>

  );
}
