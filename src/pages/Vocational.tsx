import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Zap, Hammer, Camera, ChefHat, Heart, ChevronRight, PenTool, Award, Clock } from 'lucide-react';

export default function Vocational() {
  const programs = [
    {
      category: "Creative & Design",
      items: [
        { name: "Fashion Design & Textile", code: "FDT", duration: "9 Months", level: "Certificate/Diploma" },
        { name: "Graphic Design & Multimedia", code: "GDM", duration: "6 Months", level: "Certificate" },
        { name: "Professional Photography", code: "PHO", duration: "4 Months", level: "Certificate" },
        { name: "Interior Decoration", code: "IND", duration: "6 Months", level: "Diploma" }
      ],
      icon: <Scissors className="w-6 h-6" />
    },
    {
      category: "Technical & Industrial",
      items: [
        { name: "Electrical Installation", code: "ELE", duration: "1 Year", level: "Professional Diploma" },
        { name: "Welding & Fabrication", code: "WLD", duration: "1 Year", level: "Professional Diploma" },
        { name: "Plumbing & Pipefitting", code: "PLB", duration: "9 Months", level: "Certificate" },
        { name: "Auto-Mechanics", code: "AUT", duration: "1 Year", level: "Professional Diploma" }
      ],
      icon: <Zap className="w-6 h-6" />
    },
    {
      category: "Service & Hospitality",
      items: [
        { name: "Culinary Arts & Catering", code: "CAT", duration: "6 Months", level: "Certificate" },
        { name: "Hotel Management", code: "HML", duration: "9 Months", level: "Diploma" },
        { name: "Beauty Therapy & Cosmetology", code: "BTC", duration: "6 Months", level: "Certificate" },
        { name: "Event Planning", code: "EVP", duration: "3 Months", level: "Certificate" }
      ],
      icon: <ChefHat className="w-6 h-6" />
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-[#00384d] py-24 px-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/images/vocational_fashion_design_phhipros_1789769297887.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00384d] to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 text-red-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <PenTool className="w-3 h-3" />
              Skills for the Future
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-none">
              Vocational <br />
              <span className="text-red-500 text-4xl md:text-5xl italic font-serif">Skill Acquisition</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Master practical, high-demand skills with PHHIPROS' intensive vocational programs. Fast-track your path to entrepreneurship and employment.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-900/40">
                Enroll Today
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-sm">
                View Gallery
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Vocational Section */}
      <section className="py-20 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: "100%", l: "Practical Based", d: "Hands-on training in real workshops." },
              { n: "3-12", l: "Month Courses", d: "Efficient, intensive skill mastery." },
              { n: "Startup", l: "Support", d: "Guidance on starting your business." },
              { n: "Industry", l: "Certification", d: "Recognized professional credentials." }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-red-700 mb-2">{s.n}</div>
                <div className="text-sm font-bold text-[#00384d] uppercase tracking-wider mb-2">{s.l}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {programs.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                      {cat.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-[#00384d]">{cat.category}</h2>
                  </div>
                  <div className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Professional Training
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cat.items.map((program, pIdx) => (
                    <div 
                      key={pIdx}
                      className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-red-200 hover:shadow-2xl hover:shadow-red-900/5 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-700 transition-colors">
                            <PenTool className="w-5 h-5" />
                          </div>
                          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter group-hover:text-red-300 transition-colors">
                            {program.code}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-[#00384d] mb-4 leading-tight group-hover:text-red-700 transition-colors">
                          {program.name}
                        </h4>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="text-red-700 font-bold">{program.level}</div>
                        </div>
                        <button className="w-full py-3 bg-gray-50 text-[#00384d] rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-red-700 group-hover:text-white transition-all">
                          Program Details <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Gallery Teaser */}
      <section className="py-24 px-4 bg-[#00384d] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Modern Workshops & <br />
                <span className="text-red-500">Industry Equipment</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                At PHHIPROS, we believe in learning by doing. Our vocational students have 24/7 access to fully equipped studios and workshops that mirror real-world industrial environments.
              </p>
              <ul className="space-y-4">
                {[
                  "Industrial Sewing Machines & Design Studios",
                  "Automotive Diagnostic Centers",
                  "Digital Multimedia & Graphics Labs",
                  "Professional Culinary Kitchens"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-700 rounded-full flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="/src/assets/images/phhipros_fashion_workshop_1789820216515.jpg" className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Industrial Sewing Machines" referrerPolicy="no-referrer" />
                <img src="/src/assets/images/phhipros_multimedia_lab_1789820230549.jpg" className="rounded-3xl h-48 w-full object-cover shadow-lg" alt="Digital Multimedia Lab" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="/src/assets/images/phhipros_culinary_kitchen_1789820245648.jpg" className="rounded-3xl h-48 w-full object-cover shadow-lg" alt="Professional Culinary Kitchen" referrerPolicy="no-referrer" />
                <img src="/src/assets/images/phhipros_automotive_center_1789820256972.jpg" className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Automotive Diagnostic Center" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Banner */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-100 rounded-[3rem] p-12 md:p-20 text-center">
          <h2 className="text-3xl font-bold text-[#00384d] mb-6">Ready to Master a Craft?</h2>
          <p className="text-gray-600 mb-10 text-lg">New intakes occur every 3 months. Applications for the next session are currently open.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-red-700 text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-800 transition-all">
              Apply for Admission
            </button>
            <button className="bg-white text-[#00384d] border border-gray-200 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all">
              Download Full Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
