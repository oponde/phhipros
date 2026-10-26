import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SectionGrid } from './components/SectionGrid';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { EditProvider, useEdit } from './contexts/EditContext';
import { INITIAL_CONTENT, SiteContent } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { db, doc, getDocFromServer, setDoc, onSnapshot, handleFirestoreError, OperationType } from './lib/firebase';
import { StudyOnline } from './pages/StudyOnline';
import About from './pages/About';
import Undergraduate from './pages/Undergraduate';
import Postgraduate from './pages/Postgraduate';
import Vocational from './pages/Vocational';
import Programs from './pages/Programs';
import FAQ from './pages/FAQ';
import { StudentFAQSection } from './components/StudentFAQSection';
import { CampusLocationSection } from './components/CampusLocationSection';
import { NewsletterInquirySection } from './components/NewsletterInquirySection';
import { WhatsAppButton } from './components/WhatsAppButton';
import { FacebookButton } from './components/FacebookButton';

function AppContent() {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const { isEditing, user } = useEdit();
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Google Maps Platform Quota Defense Listener
  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Validate Firestore connection on boot & sync site content
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'site', 'content'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error('Please check your Firebase configuration.');
        }
      }
    }
    testConnection();

    const unsub = onSnapshot(
      doc(db, 'site', 'content'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<SiteContent>;
          setContent((prev) => ({
            hero: { ...prev.hero, ...(data.hero || {}) },
            sections: Array.isArray(data.sections) && data.sections.length > 0 ? data.sections : prev.sections,
            footer: { ...prev.footer, ...(data.footer || {}) },
          }));
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'site/content');
        } catch {
          // Keep default INITIAL_CONTENT rendered if Firestore read fails
        }
      }
    );
    return () => unsub();
  }, []);

  const handleHeroUpdate = (updates: Partial<SiteContent['hero']>) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, ...updates }
    }));
  };

  const handleSectionUpdate = (sectionId: string, itemId: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
              )
            }
          : s
      )
    }));
  };

  const handleSectionTitleUpdate = (sectionId: string, title: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, title } : s)
    }));
  };

  const handleFooterUpdate = (updates: Partial<SiteContent['footer']>) => {
    setContent(prev => ({
      ...prev,
      footer: { ...prev.footer, ...updates }
    }));
  };

  const saveContent = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        ...content,
        updatedAt: new Date(), // Rules will validate with request.time
        updatedBy: user.uid
      };
      await setDoc(doc(db, 'site', 'content'), payload);
      setIsSaving(false);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3000);
    } catch (error) {
      setIsSaving(false);
      handleFirestoreError(error, OperationType.WRITE, 'site/content');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-900">
        {/* Google Maps Platform Quota Defense Notice */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <Navbar />
        <ScrollToTop />
        <WhatsAppButton />
        <FacebookButton />

        <Routes>
          <Route path="/" element={
            <main>
              {/* Sync Status for Editor */}
              {isEditing && (
                <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 sticky top-[116px] z-40">
                  <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold text-amber-900">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-amber-600 animate-pulse" />
                      DRAFT MODE: Changes are stored locally until you click "Save All Changes"
                    </div>
                  </div>
                </div>
              )}
              <Hero content={content.hero} onUpdate={handleHeroUpdate} />

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 right-8 z-[100]"
                  >
                    <button
                      onClick={saveContent}
                      disabled={isSaving}
                      className="bg-[#00384d] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:bg-[#004a66] transition-all disabled:opacity-70 group"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving changes...
                        </>
                      ) : showSavedMsg ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          Changes saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Save All Changes
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {content.sections.map((section) => (
                <SectionGrid
                  key={section.id}
                  section={section}
                  onUpdate={handleSectionUpdate}
                  onUpdateSectionTitle={handleSectionTitleUpdate}
                />
              ))}

              {/* Student Inquiries & FAQ Section */}
              <StudentFAQSection />

              {/* Interactive Campus Geographical Location & Maps Section */}
              <CampusLocationSection />

              <section className="bg-gray-50 py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl font-bold text-[#00384d] mb-6">Experience PHHIPROS</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                      Discover why PHHIPROS is the leading choice for professional education and research excellence.
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                      { label: 'Ranked 1st', sub: 'for Student Satisfaction' },
                      { label: 'Global Impact', sub: 'Research Excellence' },
                      { label: 'Top 10', sub: 'for Career Prospects' }
                    ].map((stat, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                      >
                        <div className="text-3xl font-bold text-red-700 mb-1">{stat.label}</div>
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.sub}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Newsletter Subscription & Student Inquiry Capture Component */}
              <NewsletterInquirySection />
            </main>
          } />
          <Route path="/study-online" element={<StudyOnline />} />
          <Route path="/about" element={<About />} />
          <Route path="/undergraduate" element={<Undergraduate />} />
          <Route path="/postgraduate" element={<Postgraduate />} />
          <Route path="/vocational" element={<Vocational />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>

        <Footer content={content.footer} onUpdate={handleFooterUpdate} />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <EditProvider>
      <AppContent />
    </EditProvider>
  );
}
