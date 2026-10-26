import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { SiteContent } from '../types';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Props {
  section: SiteContent['sections'][0];
  onUpdate: (sectionId: string, itemId: string, field: string, value: string) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
}

export function SectionGrid({ section, onUpdate, onUpdateSectionTitle }: Props) {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-between items-end mb-12 border-b-2 border-gray-100 pb-6"
      >
        <h2 className="text-3xl font-bold text-[#00384d]">
          <EditableText
            value={section.title}
            onChange={(val) => onUpdateSectionTitle(section.id, val)}
          />
        </h2>
        <a href="#" className="text-red-700 font-bold flex items-center gap-1 hover:underline">
          View all {section.title} <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {section.items.map((item, index) => {
          const isAcademicProgram = section.id === 'study';
          
          if (isAcademicProgram) {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <Link 
                  to={item.link || '#'} 
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col justify-end p-8"
                >
                  <div className="absolute inset-0 z-0">
                    <EditableImage
                      src={item.imageUrl || ''}
                      onChange={(val) => onUpdate(section.id, item.id, 'imageUrl', val)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/100 transition-colors" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      <EditableText
                        value={item.title}
                        onChange={(val) => onUpdate(section.id, item.id, 'title', val)}
                      />
                    </h3>
                    <EditableText
                      value={item.description}
                      onChange={(val) => onUpdate(section.id, item.id, 'description', val)}
                      className="text-gray-300 text-sm line-clamp-2"
                      multiline
                    />
                    <div className="mt-4 flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
                      Explore Program <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          }

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
            >
              {item.imageUrl && (
                <div className="h-56 overflow-hidden">
                  <EditableImage
                    src={item.imageUrl}
                    onChange={(val) => onUpdate(section.id, item.id, 'imageUrl', val)}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex-grow">
                {section.type === 'news' && (
                  <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    September 18, 2026
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#00384d] mb-3 group-hover:text-red-700 transition-colors">
                  <EditableText
                    value={item.title}
                    onChange={(val) => onUpdate(section.id, item.id, 'title', val)}
                  />
                </h3>
                <EditableText
                  value={item.description}
                  onChange={(val) => onUpdate(section.id, item.id, 'description', val)}
                  className="text-gray-600 leading-relaxed text-sm mb-6"
                  multiline
                />
              </div>
              <div className="px-6 pb-6 mt-auto">
                 {item.link ? (
                   <Link to={item.link} className="text-sm font-bold text-[#00384d] group-hover:text-red-700 flex items-center gap-2">
                     Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                   </Link>
                 ) : (
                   <button className="text-sm font-bold text-[#00384d] group-hover:text-red-700 flex items-center gap-2">
                     Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                   </button>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
