import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  CreditCard,
  Laptop,
  GraduationCap,
  HeartHandshake,
  Building2,
  X
} from 'lucide-react';
import { STUDENT_FAQS, FAQ_CATEGORIES, FAQItem } from '../data/studentFaqData';
import { StudentInquiryModal } from '../components/StudentInquiryModal';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'All': <HelpCircle className="w-4 h-4" />,
  'Admissions & Requirements': <BookOpen className="w-4 h-4" />,
  'Tuition & Payment Plans': <CreditCard className="w-4 h-4" />,
  'Study Online & E-Learning': <Laptop className="w-4 h-4" />,
  'HND & Bachelor Programs': <GraduationCap className="w-4 h-4" />,
  'Internships & Clinical': <HeartHandshake className="w-4 h-4" />,
  'Campus & Admin Services': <Building2 className="w-4 h-4" />,
};

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-4', 'faq-7']);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});

  const toggleAccordion = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFeedback = (id: string, type: 'yes' | 'no') => {
    setFeedbackGiven(prev => ({ ...prev, [id]: type }));
  };

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return STUDENT_FAQS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const inQuestion = item.question.toLowerCase().includes(query);
      const inAnswer = item.answer.toLowerCase().includes(query);
      const inTags = item.tags.some(tag => tag.toLowerCase().includes(query));
      return inQuestion || inAnswer || inTags;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 selection:bg-red-100 selection:text-red-900">
      {/* Header Banner */}
      <section className="bg-[#00384d] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-300 text-xs font-semibold tracking-wide uppercase mb-4 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Student Support & Knowledge Base
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Student Inquiries & FAQ Center
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Find answers regarding admissions, tuition installment plans, study online credentials, examinations, and clinical placements.
            </p>

            {/* Live Search Bar */}
            <div className="max-w-2xl mx-auto relative shadow-xl rounded-2xl bg-white p-2 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search questions by keyword (e.g., tuition, HND, nursing, installments)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-gray-800 placeholder-gray-400 text-sm md:text-base outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {FAQ_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#00384d] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/70'
                }`}
              >
                {CATEGORY_ICONS[category] || <HelpCircle className="w-4 h-4" />}
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 text-xs text-gray-500 gap-2 border-b border-gray-200/80 mb-6">
          <div>
            Showing <strong className="text-gray-800 font-bold">{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'question' : 'questions'}
            {selectedCategory !== 'All' && <span> in <strong className="text-[#00384d] font-bold">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<span className="text-red-700 font-bold">{searchQuery}</span>"</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenIds(filteredFaqs.map(f => f.id))}
              className="hover:text-[#00384d] font-semibold transition-colors"
            >
              Expand All
            </button>
            <span>·</span>
            <button
              onClick={() => setOpenIds([])}
              className="hover:text-[#00384d] font-semibold transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No matching questions found</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  We couldn't find an existing answer matching "{searchQuery}". You can submit this as an inquiry to our student advisors.
                </p>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Ask an Academic Advisor
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                const feedback = feedbackGiven[faq.id];

                return (
                  <motion.div
                    key={faq.id}
                    layout
                    className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen ? 'border-[#00384d]/30 shadow-sm' : 'border-gray-200/80 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                          <span className="font-semibold text-red-700">{faq.category}</span>
                          {faq.highlight && (
                            <>
                              <span>·</span>
                              <span className="text-amber-700 font-bold">Frequently Asked</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-red-50 text-red-700' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-6 pt-1 border-t border-gray-100">
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                              {faq.answer}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 mb-4">
                              <span className="font-semibold text-gray-400 mr-1">Related:</span>
                              {faq.tags.map((tag, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSearchQuery(tag)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[11px] transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>

                            {/* Helpfulness Feedback */}
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                              <span>Was this helpful?</span>
                              {feedback ? (
                                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                                  <Check className="w-3.5 h-3.5" /> Thank you for your feedback!
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleFeedback(faq.id, 'yes')}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 transition-colors"
                                  >
                                    <ThumbsUp className="w-3 h-3" /> Yes
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(faq.id, 'no')}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-gray-50 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 transition-colors"
                                  >
                                    <ThumbsDown className="w-3 h-3" /> No
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Sidebar Inquiry Desk */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm sticky top-32">
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#00384d] mb-2">Have a Specific Inquiry?</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                If your question is not covered in our FAQ knowledge base, submit a direct inquiry. An admissions or academic advisor will review your case and contact you within 24 hours.
              </p>

              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mb-4 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Student Inquiry
              </button>

              <a
                href="https://wa.me/237673575151"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm text-center"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Quick WhatsApp Helpdesk
              </a>

              <hr className="my-6 border-gray-100" />

              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                Student Advisory Channels
              </h4>
              <ul className="space-y-3.5 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">Admissions Email</div>
                    <a href="mailto:phhipros.edu@gmail.com" className="hover:underline text-gray-500">
                      phhipros.edu@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">Telephone Hotline</div>
                    <div className="flex flex-wrap items-center gap-1.5 font-medium text-gray-700">
                      <a href="tel:+237673575151" className="hover:text-red-700 hover:underline transition-colors">+237 673 575 151</a>
                      <span className="text-gray-400">/</span>
                      <a href="tel:+237675377198" className="hover:text-red-700 hover:underline transition-colors">+237 675 377 198</a>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">Support Hours</div>
                    <span>Mon – Fri: 8:00 AM – 5:00 PM (GMT+1)</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Submission Modal */}
      <StudentInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </div>
  );
}
