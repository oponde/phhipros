import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Send, ArrowRight, MessageSquare, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STUDENT_FAQS } from '../data/studentFaqData';
import { StudentInquiryModal } from './StudentInquiryModal';

export function StudentFAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pick top 5 featured questions
  const featuredFaqs = STUDENT_FAQS.slice(0, 5);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Callout */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Student Inquiries & FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#00384d] mb-4 tracking-tight leading-tight">
                Got Questions? We Have Clear Answers.
              </h2>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                Whether you are deciding on your HND program, planning tuition installments, or setting up your online learning credentials, here are the most frequent inquiries from students.
              </p>

              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00384d] text-white flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#00384d] text-sm">Need Personalized Guidance?</h4>
                    <p className="text-xs text-gray-500">Connect with an admissions advisor today</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Submit your custom inquiry and receive an official reply with admission guides within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Inquiry
                  </button>
                  <Link
                    to="/faq"
                    className="flex-1 bg-white hover:bg-gray-100 text-[#00384d] border border-gray-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    View All FAQs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Accredited Programs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Installment Options</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>24/7 Portal Support</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-3.5">
            {featuredFaqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-[#00384d]/30 shadow-sm bg-gray-50/30' : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`p-1.5 rounded-lg bg-gray-100 text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-red-50 text-red-700' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
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
                        <div className="px-5 pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100/60 mt-1">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="pt-3 text-right">
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-800 transition-colors"
              >
                Explore all 14 student inquiries & answers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <StudentInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
