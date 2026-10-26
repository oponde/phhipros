import React from 'react';
import { motion } from 'motion/react';
import { Target, History, Users, Award, ShieldCheck, Globe } from 'lucide-react';

export default function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      icon: <Target className="w-8 h-8 text-red-700" />,
      title: "Our Mission",
      description: "To empower individuals through high-quality professional education, fostering innovation, and preparing the next generation of global leaders."
    },
    {
      icon: <History className="w-8 h-8 text-red-700" />,
      title: "Our History",
      description: "Founded with a vision to bridge the gap between academic theory and professional practice, PHHIPROS has grown into a beacon of excellence in professional studies."
    },
    {
      icon: <Users className="w-8 h-8 text-red-700" />,
      title: "Community First",
      description: "We pride ourselves on our diverse, inclusive community where students from all backgrounds thrive and support each other's growth."
    }
  ];

  const features = [
    { icon: <Award className="w-5 h-5" />, text: "Accredited Programs" },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Industry Recognized" },
    { icon: <Globe className="w-5 h-5" />, text: "Global Partnerships" }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#00384d] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-700 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              About <span className="text-red-500">PHHIPROS</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Excellence in Professional Education. Innovation in Research. Dedication to Student Success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-[#00384d]">
                Transforming Lives Through <br />
                <span className="text-red-700 italic">Professional Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The Paul Herbert Higher Institute of Professional Studies (PHHIPROS) is more than just an educational institution; it's a launchpad for careers and a hub for innovation. Our approach combines rigorous academic standards with real-world application, ensuring our graduates are not just educated, but ready to lead.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-red-700">{f.icon}</div>
                    <span className="text-xs font-bold text-[#00384d] uppercase tracking-wider">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="/src/assets/images/cameroon_campus_hero_1789756140943.jpg" 
                  alt="PHHIPROS Campus" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-red-700/10 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-[#00384d]/10 rounded-full blur-3xl -z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#00384d] mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-red-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
                <h3 className="text-xl font-bold text-[#00384d] mb-4">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-[#00384d] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: "15k+", l: "Graduates" },
              { n: "50+", l: "Programs" },
              { n: "120+", l: "Faculty" },
              { n: "98%", l: "Job Rate" }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl font-bold mb-2">{s.n}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
