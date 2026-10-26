import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Stethoscope, Briefcase, MessageSquare, Monitor, Scissors, HelpCircle } from 'lucide-react';
import { AdmissionModal } from '../components/AdmissionModal';

const programData = [
  {
    category: "MEDICAL AND BIOMEDICAL SCIENCES",
    icon: <Stethoscope className="w-8 h-8 text-red-600" />,
    programs: [
      "NURSING",
      "MIDWIFERY",
      "MEDICAL LABORATORY TECHNOLOGY",
      "PHARMACY TECHNOLOGY",
      "PHYSIOTHERAPY",
      "MEDICAL IMAGING TECHNOLOGY"
    ]
  },
  {
    category: "MANAGEMENT",
    icon: <Briefcase className="w-8 h-8 text-blue-600" />,
    programs: [
      "HUMAN RESOURCE MANAGEMENT",
      "LOGISTIC AND TRANSPORT MANAGEMENT",
      "INFORMATION SYSTEM MANAGEMENT",
      "TOURISM AND MANAGEMENT",
      "CATTERY, HOTEL, RESTAURANT MANAGEMENT",
      "TOURISM AND TRAVEL AGENCY MANAGEMENT"
    ]
  },
  {
    category: "COMMUNICATION",
    icon: <MessageSquare className="w-8 h-8 text-green-600" />,
    programs: [
      "JOURNALISM",
      "ADVERTISING AND PUBLIC RELATION",
      "CORPORATE COMMUNICATION"
    ]
  },
  {
    category: "COMPUTER ENGINEERING",
    icon: <Monitor className="w-8 h-8 text-purple-600" />,
    programs: [
      "SOFTWARE ENGINEERING",
      "HARDWARE ENGINEERING"
    ]
  },
  {
    category: "VOCATIONAL STUDIES",
    icon: <Scissors className="w-8 h-8 text-amber-600" />,
    programs: [
      "BEAUTIFUL AND COSMETICS",
      "RENEWABLE ENERGY (SOLAR INSTALLATION)",
      "FASHION AND DESIGNS",
      "FOOD PROCESSING",
      "ARCHITECTURE DESIGN",
      "PHOTOSHOP AND GRAPHIC DESIGN",
      "PROFESSIONAL EXCEL PRACTICE",
      "VIDEO EDITING",
      "CARTOON DESING AND ANIMATION"
    ]
  }
];

export default function Programs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-[#00384d] mb-6">Our Programs</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover a wide range of professional programs designed to prepare you for a successful global career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programData.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h2 className="text-xl font-bold text-[#00384d] leading-tight">{cat.category}</h2>
              </div>
              
              <ul className="space-y-3">
                {cat.programs.map((program, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-3 text-gray-600 group/item">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                    <span className="text-[14.5px] font-medium leading-tight">{program}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-[#00384d] rounded-[2rem] text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to take the next step?</h2>
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
              Our admissions team is here to help you choose the right program for your career goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-red-700 hover:bg-red-800 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg text-lg cursor-pointer"
              >
                Apply Now
              </button>
              <Link
                to="/faq"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-sm text-lg flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                Student Inquiries & FAQ
              </Link>
            </div>
          </div>
        </motion.div>

        <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
