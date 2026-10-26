import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle2, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { usePhhiprosDB } from '../hooks/usePhhiprosDB';
import { StudentInquiry } from '../types/study-online';
import { StudentInquiryModal } from './StudentInquiryModal';

const INTEREST_TOPICS: { label: string; category: StudentInquiry['category'] }[] = [
  { label: 'Admissions & 2026 Prospectus', category: 'Admissions' },
  { label: 'HND & Bachelor Degree Programs', category: 'Programs & Degrees' },
  { label: 'Tuition Plans & Scholarships', category: 'Tuition & Fees' },
  { label: 'Study Online & Distance Learning', category: 'Online Learning' },
  { label: 'Clinical & Industrial Internships', category: 'Internships & Clinical' },
  { label: 'General Campus Updates', category: 'General Inquiry' },
];

export function NewsletterInquirySection() {
  const { addInquiry } = usePhhiprosDB();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(INTEREST_TOPICS[0].label);
  const [inquiryNote, setInquiryNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address so our admissions desk can reach you.');
      return;
    }

    setIsSubmitting(true);

    const matchedTopic = INTEREST_TOPICS.find((t) => t.label === selectedTopic) || INTEREST_TOPICS[0];
    const generatedTicket = 'INQ-' + Math.floor(10000 + Math.random() * 90000);

    const newInquiry: StudentInquiry = {
      id: 'inq-' + Math.random().toString(36).slice(2, 9),
      ticketNumber: generatedTicket,
      name: trimmedName || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      phone: phone.trim() || 'Not provided',
      studentType: 'prospective',
      category: matchedTopic.category,
      subject: `Newsletter & Inquiry Subscription: ${selectedTopic}`,
      message: inquiryNote.trim()
        ? inquiryNote.trim()
        : `Subscribed to ${selectedTopic} updates and digital prospectus via the main page inquiry form.`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      addInquiry(newInquiry);
      setSubmittedTicket(generatedTicket);
      setIsSubmitting(false);
    }, 400);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setName('');
    setEmail('');
    setPhone('');
    setInquiryNote('');
    setErrorMsg(null);
  };

  return (
    <section
      id="newsletter-inquiry"
      className="bg-white border-t border-gray-200 py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#00384d] rounded-2xl p-8 md:p-12 lg:p-14 text-white border border-[#004a66]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Academic Updates & Direct Inquiry Pitch */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-red-300">
                <span>Admissions Bulletin</span>
                <span aria-hidden="true">·</span>
                <span>Student Inquiry Desk</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                Stay Informed on Admissions, Programs & Student Inquiries
              </h2>

              <p className="text-gray-200 text-base leading-relaxed max-w-xl">
                Subscribe to the official PHHIPROS academic newsletter and submit your program questions directly to our Kumba and Yaoundé admissions advisors. Receive the 2026 digital prospectus, scholarship deadlines, and personalized guidance.
              </p>

              <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
                <div>
                  <div className="font-bold text-white mb-0.5">Direct Advisor Follow-Up</div>
                  <p className="text-gray-300/90 leading-relaxed">
                    Every inquiry generates an official tracking number with a response within 24 business hours.
                  </p>
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">Need Detailed Assistance?</div>
                  <button
                    type="button"
                    onClick={() => setIsFullModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-red-300 hover:text-white font-semibold transition-colors mt-1 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Open Full Student Inquiry Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-300 pt-1 tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-red-400" />
                  <span>Hotline: +237 673 575 151 / +237 675 377 198</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <span>phhipros.edu@gmail.com</span>
                </span>
              </div>
            </div>

            {/* Right Column: Subscription & Quick Inquiry Capture Form */}
            <div className="lg:col-span-6">
              <div className="bg-white text-gray-900 rounded-xl p-6 md:p-8 border border-gray-100">
                {submittedTicket ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-4 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#00384d]">
                        Subscription & Inquiry Recorded
                      </h3>
                      <p className="text-xs font-mono font-semibold text-gray-600 tabular-nums">
                        Reference Ticket: {submittedTicket}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Thank you for connecting with PHHIPROS. We have registered <span className="font-semibold text-gray-900">{email}</span> for <span className="font-semibold text-gray-900">{selectedTopic}</span> and forwarded your inquiry to our admissions team.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-lg bg-[#00384d] hover:bg-[#002838] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFullModalOpen(true)}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-[#00384d] text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Open Detailed Inquiry Desk
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="border-b border-gray-100 pb-3 mb-1">
                      <h3 className="text-lg font-bold text-[#00384d]">
                        Subscribe & Send a Student Inquiry
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Get program brochures by email or ask an admissions question below.
                      </p>
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-800"
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="newsletter-name"
                          className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          id="newsletter-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ndamukong Boris"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newsletter-phone"
                          className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                          Phone / WhatsApp <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="newsletter-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+237 6XX XXX XXX"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none transition-all tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="newsletter-email"
                          className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                          Email Address <span className="text-red-700">*</span>
                        </label>
                        <input
                          id="newsletter-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newsletter-topic"
                          className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                          Area of Interest
                        </label>
                        <select
                          id="newsletter-topic"
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none transition-all"
                        >
                          {INTEREST_TOPICS.map((topic) => (
                            <option key={topic.label} value={topic.label}>
                              {topic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newsletter-question"
                        className="block text-xs font-semibold text-gray-700 mb-1"
                      >
                        Specific Question or Inquiry <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        id="newsletter-question"
                        rows={2}
                        value={inquiryNote}
                        onChange={(e) => setInquiryNote(e.target.value)}
                        placeholder="Ask about entry requirements, HND/Bachelor tuition installments, or campus accommodation..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting ? 'Registering Inquiry...' : 'Subscribe & Submit Inquiry'}
                      </span>
                    </button>

                    <p className="text-[11px] text-gray-500 text-center leading-normal">
                      We respect your privacy. Your contact details are used strictly for PHHIPROS academic communications and responding to your inquiry.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <StudentInquiryModal
        isOpen={isFullModalOpen}
        onClose={() => setIsFullModalOpen(false)}
      />
    </section>
  );
}
