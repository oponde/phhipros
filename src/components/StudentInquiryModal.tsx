import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, MessageSquare, Phone, Mail, Clock, HelpCircle } from 'lucide-react';
import { usePhhiprosDB } from '../hooks/usePhhiprosDB';
import { StudentInquiry } from '../types/study-online';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: StudentInquiry['category'];
  defaultSubject?: string;
}

export function StudentInquiryModal({ isOpen, onClose, defaultCategory, defaultSubject }: Props) {
  const { addInquiry } = usePhhiprosDB();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentType: 'prospective' as StudentInquiry['studentType'],
    category: (defaultCategory || 'Admissions') as StudentInquiry['category'],
    subject: defaultSubject || '',
    message: ''
  });
  const [ticketNum, setTicketNum] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedTicket = 'INQ-' + Math.floor(10000 + Math.random() * 90000);
    const inquiry: StudentInquiry = {
      id: 'inq-' + Math.random().toString(36).slice(2, 9),
      ticketNumber: generatedTicket,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      studentType: formData.studentType,
      category: formData.category,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      addInquiry(inquiry);
      setTicketNum(generatedTicket);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      studentType: 'prospective',
      category: 'Admissions',
      subject: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-[#00384d]/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8 z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#00384d]">Student Inquiry Desk</h3>
                <p className="text-xs text-gray-500">Ask any question to our academic and admissions advisors</p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-700"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-[#00384d] mb-1">Inquiry Submitted Successfully</h4>
                <div className="inline-block bg-gray-100 text-gray-800 text-xs font-mono font-bold px-3 py-1 rounded-md mb-4">
                  Reference Ticket: {ticketNum}
                </div>
                <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-800">{formData.name}</span>. An academic advisor has received your request and will follow up via email (<span className="text-gray-800 font-medium">{formData.email}</span>) or phone within 24 hours.
                </p>

                <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4 text-left mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong>Office Response Hours:</strong> Monday – Friday, 8:00 AM – 5:00 PM (GMT+1). Urgent inquiries may also be forwarded directly to WhatsApp.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/237673575151"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open WhatsApp Chat
                  </a>
                  <button
                    onClick={handleResetAndClose}
                    className="bg-[#00384d] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#002b3b] transition-all"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm transition-all text-gray-800"
                      placeholder="e.g. Marie Claire"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      I am a...
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm bg-white transition-all text-gray-800"
                      value={formData.studentType}
                      onChange={(e) => setFormData({ ...formData, studentType: e.target.value as any })}
                    >
                      <option value="prospective">Prospective Student</option>
                      <option value="current">Current Enrolled Student</option>
                      <option value="parent">Parent or Guardian</option>
                      <option value="alumni">Graduate / Alumni</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm transition-all text-gray-800"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone or WhatsApp
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm transition-all text-gray-800"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm bg-white transition-all text-gray-800"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    >
                      <option value="Admissions">Admissions & Requirements</option>
                      <option value="Tuition & Fees">Tuition & Payment Plans</option>
                      <option value="Online Learning">Study Online & E-Learning</option>
                      <option value="Programs & Degrees">Programs & Degrees</option>
                      <option value="Internships & Clinical">Internships & Clinical Placements</option>
                      <option value="General Inquiry">General Inquiry / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm transition-all text-gray-800"
                      placeholder="e.g. HND Nursing entry requirements"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Question / Inquiry Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00384d] focus:border-transparent outline-none text-sm transition-all resize-none text-gray-800"
                    placeholder="Provide specific details about your query so our team can provide a precise response..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-700 hover:bg-red-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Inquiry...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Student Inquiry
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2.5">
                    Your inquiry is tracked with a ticket number. A student counselor will reply via email or phone within 24 business hours.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
