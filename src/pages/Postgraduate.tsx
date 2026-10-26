import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Award, ChevronRight, Briefcase, Microscope, Database, Sparkles } from 'lucide-react';

export default function Postgraduate() {
  const programs = [
    {
      category: "Executive MBA & Management",
      items: [
        { name: "Executive MBA", code: "EMBA", duration: "18 Months", level: "Master's" },
        { name: "Strategic Management", code: "MGT-P", duration: "2 Years", level: "Master's" },
        { name: "Project Management", code: "PRM", duration: "1 Year", level: "Postgrad Diploma" },
        { name: "Global Logistics & Supply Chain", code: "LSC", duration: "2 Years", level: "Master's" }
      ]
    },
    {
      category: "Advanced Technology",
      items: [
        { name: "Cybersecurity & Risk Management", code: "CYB", duration: "2 Years", level: "Master's" },
        { name: "Data Science & AI", code: "DSAI", duration: "2 Years", level: "Master's" },
        { name: "Cloud Computing Architect", code: "CCA", duration: "18 Months", level: "Master's" }
      ]
    },
    {
      category: "Professional Research",
      items: [
        { name: "Public Health Administration", code: "PHA", duration: "2 Years", level: "Master's" },
        { name: "International Relations", code: "INR", duration: "2 Years", level: "Master's" }
      ]
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-[#00384d] py-32 px-4 text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/src/assets/images/postgraduate_graduation_hero_1789829994884.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00384d] via-[#00384d]/90 to-transparent"></div>
        
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-red-700/10 skew-x-12 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 -skew-x-12 -translate-x-1/2 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 text-red-400 font-bold mb-4 uppercase tracking-[0.25em] text-xs px-3 py-1 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3 h-3" />
              Advanced Excellence
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Postgraduate <br />
              <span className="text-red-500">Excellence</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Elevate your career with PHHIPROS' advanced postgraduate programs. Designed for professionals seeking to lead in a globalized economy.
            </p>
            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <button className="bg-red-700 hover:bg-red-800 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-red-900/30 text-lg">
                View Admissions
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-2xl font-bold transition-all backdrop-blur-md">
                Research Portal
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Grid */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Briefcase className="w-6 h-6 text-red-700" />, title: "Industry Linked", desc: "Curriculums co-developed with global industry leaders." },
              { icon: <Microscope className="w-6 h-6 text-red-700" />, title: "Research Hub", desc: "Access to state-of-the-art research facilities and grants." },
              { icon: <Database className="w-6 h-6 text-red-700" />, title: "Digital First", desc: "Advanced learning management systems for executive flexibility." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#00384d] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-[#00384d] mb-4">Postgraduate Catalog</h2>
              <p className="text-gray-600">Explore our specialized master's and professional diploma programs designed for the modern workforce.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-gray-100 text-[#00384d] text-xs font-bold rounded-full">ALL PROGRAMS</span>
              <span className="px-4 py-2 bg-white text-gray-400 text-xs font-bold rounded-full border border-gray-100">RESEARCH ONLY</span>
            </div>
          </div>

          <div className="space-y-20">
            {programs.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-2 h-8 bg-red-700 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-[#00384d] tracking-tight">{cat.category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.items.map((program, pIdx) => (
                    <div 
                      key={pIdx}
                      className="group p-8 bg-white border border-gray-100 rounded-3xl hover:border-red-200 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Award className="w-24 h-24 text-red-700" />
                      </div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <div className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-md tracking-widest uppercase">
                            {program.code}
                          </div>
                          <div className="text-xs font-bold text-red-700 uppercase tracking-widest">{program.level}</div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-[#00384d] mb-4 group-hover:text-red-700 transition-colors leading-tight">
                          {program.name}
                        </h4>
                        
                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                          <div className="flex items-center gap-2 text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-sm font-semibold">{program.duration}</span>
                          </div>
                          <button className="flex items-center gap-2 text-[#00384d] font-bold text-sm group-hover:translate-x-2 transition-transform">
                            Details <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Call to Action */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-[#00384d] rounded-[4rem] p-16 md:p-24 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-700/20 rounded-full blur-3xl"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Invest in your <br />future leadership</h2>
              <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Applications for the upcoming executive intake are now open. Speak with our professional admissions advisors today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-red-700 text-white px-12 py-5 rounded-2xl font-bold hover:bg-red-800 transition-all shadow-lg shadow-black/20">
                  Request Information
                </button>
                <button className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Contact Admissions
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
