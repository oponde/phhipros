import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { SiteContent } from '../types';

interface Props {
  content: SiteContent['hero'];
  onUpdate: (val: Partial<SiteContent['hero']>) => void;
}

export function Hero({ content, onUpdate }: Props) {
  return (
    <section className="relative min-h-[500px] md:h-[600px] overflow-hidden bg-gray-900 flex items-center py-20 md:py-0">
      <div className="absolute inset-0 z-0">
        <EditableImage
          src={content.imageUrl}
          onChange={(url) => onUpdate({ imageUrl: url })}
          className="w-full h-full object-cover"
          alt="University Campus"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 md:from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white text-center md:text-left mx-auto md:mx-0"
        >
          <EditableText
            value={content.title}
            onChange={(val) => onUpdate({ title: val })}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
          />
          <EditableText
            value={content.subtitle}
            onChange={(val) => onUpdate({ subtitle: val })}
            className="text-base md:text-xl text-gray-200 mb-10 leading-relaxed"
            multiline
          />

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/programs" className="bg-red-700 hover:bg-red-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-md font-bold transition-all shadow-lg transform hover:-translate-y-1 text-sm md:text-base inline-block">
              <EditableText
                value={content.ctaText}
                onChange={(val) => onUpdate({ ctaText: val })}
              />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-3 h-3 rounded-full border-2 border-white ${i === 0 ? 'bg-white' : 'bg-transparent'}`} />
        ))}
      </div>
    </section>
  );
}
