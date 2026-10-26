import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, GraduationCap, ChevronRight, Award, Clock, Users, HelpCircle } from 'lucide-react';
import { AdmissionModal } from '../components/AdmissionModal';
import { StudentInquiryModal } from '../components/StudentInquiryModal';

export default function Undergraduate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const programs = [
    {
      category: "Business & Management",
      items: [
        { name: "Accounting", code: "ACC", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Banking and Finance", code: "BAF", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Management", code: "MGT", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Marketing", code: "MKT", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Human Resource Management", code: "HRM", duration: "3 Years", level: "HND/Bachelor" }
      ]
    },
    {
      category: "Technology & Engineering",
      items: [
        { name: "Software Engineering", code: "SWE", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Computer Science", code: "CSC", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Network & Security", code: "NWS", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Telecommunications", code: "TEL", duration: "3 Years", level: "HND/Bachelor" }
      ]
    },
    {
      category: "Health & Social Sciences",
      items: [
        { name: "Nursing", code: "NSG", duration: "3 Years", level: "HND/Bachelor" },
        { name: "Medical Laboratory Sciences", code: "MLS", duration: "3 Years", level: "HND/Bachelor" }
      ]
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-[#00384d] py-32 px-4 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/src/assets/images/undergraduate_hero_bg_1789829787792.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00384d] via-[#00384d]/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-red-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">
              <GraduationCap className="w-4 h-4" />
              Academic Programs
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-none">
              HND/Bachelor <br />
              <span className="text-gray-300">Degree Programs</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              PHHIPROS offers world-class HND and Bachelor's degree programs designed to equip students with professional excellence and practical skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
              >
                Apply Now
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-sm">
                Download Brochure
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-32 space-y-6">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-[#00384d] mb-6">Why Study at PHHIPROS?</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Award className="w-5 h-5 text-red-700" />, title: "Accredited", desc: "Recognized by MINESUP" },
                      { icon: <Users className="w-5 h-5 text-red-700" />, title: "Expert Faculty", desc: "Industry leading tutors" },
                      { icon: <Clock className="w-5 h-5 text-red-700" />, title: "Flexibility", desc: "Full-time and Online modes" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="flex-shrink-0">{item.icon}</div>
                        <div>
                          <div className="font-bold text-[#00384d] text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-700 rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Admissions Open</h3>
                  <p className="text-red-100 text-sm mb-6">Secure your spot for the next academic session. Applications are currently being processed.</p>
                  <button className="w-full bg-white text-red-700 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors">
                    Check Requirements
                  </button>
                </div>
              </div>
            </div>

            {/* Programs List */}
            <div className="lg:col-span-8 space-y-12">
              {programs.map((cat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-[#00384d]">{cat.category}</h2>
                    <div className="flex-grow h-px bg-gray-100"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {cat.items.map((program, pIdx) => (
                      <motion.div 
                        key={pIdx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pIdx * 0.05 }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-6 mb-4 sm:mb-0">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-red-50 transition-colors">
                            <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-red-700 transition-colors" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{program.code}</div>
                            <h4 className="text-lg font-bold text-[#00384d] group-hover:text-red-700 transition-colors">{program.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <div className="text-xs font-bold text-gray-500 uppercase">{program.level}</div>
                            <div className="text-sm font-semibold text-[#00384d]">{program.duration}</div>
                          </div>
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graduation Call to Action */}
      <section className="bg-gray-50 py-24 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold mb-8">
            <CheckCircle2 className="w-4 h-4" />
            98% Graduate Employment Rate
          </div>
          <h2 className="text-4xl font-bold text-[#00384d] mb-6">Ready to start your journey?</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join thousands of students who have transformed their lives at PHHIPROS. Our admissions team is ready to guide you through the process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00384d] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#004a66] transition-all cursor-pointer"
            >
              Start Application
            </button>
            <button 
              onClick={() => setIsInquiryOpen(true)}
              className="bg-white text-[#00384d] border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer"
            >
              Submit Student Inquiry
            </button>
            <Link
              to="/faq"
              className="bg-red-50 text-red-700 border border-red-200 px-6 py-4 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              View FAQs
            </Link>
          </div>
        </div>
      </section>

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <StudentInquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} defaultCategory="Admissions" />
    </div>
  );
}
