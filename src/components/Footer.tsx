import { useState } from 'react';
import { EditableText } from './EditableText';
import { SiteContent } from '../types';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Mail, Phone, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePhhiprosDB } from '../hooks/usePhhiprosDB';

interface Props {
  content: SiteContent['footer'];
  onUpdate: (val: Partial<SiteContent['footer']>) => void;
}

export function Footer({ content, onUpdate }: Props) {
  const { addInquiry } = usePhhiprosDB();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerJoined, setFooterJoined] = useState(false);

  const scrollToCampusMap = (e: React.MouseEvent) => {
    const el = document.getElementById('campus-location');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFooterJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = footerEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    addInquiry({
      id: 'inq-' + Math.random().toString(36).slice(2, 9),
      ticketNumber: 'INQ-' + Math.floor(10000 + Math.random() * 90000),
      name: trimmed.split('@')[0],
      email: trimmed,
      phone: 'Not provided',
      studentType: 'prospective',
      category: 'General Inquiry',
      subject: 'Footer Newsletter Subscription',
      message: 'Subscribed to PHHIPROS updates via the footer newsletter form.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setFooterJoined(true);
    setFooterEmail('');
  };

  return (
    <footer className="bg-[#00384d] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/src/assets/images/phhipros_official_logo_1789821636476.jpg" 
                alt="PHHIPROS Logo" 
                className="w-16 h-16 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">PHHIPROS</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 -mt-1">Paul Herbert Institute</span>
              </div>
            </div>
            <EditableText
              value={content.about}
              onChange={(val) => onUpdate({ about: val })}
              className="text-sm text-gray-300 leading-relaxed mb-6"
              multiline
            />
            <div className="flex gap-4">
              <a href="https://web.facebook.com/search/top/?q=phhipros" target="_blank" rel="noopener noreferrer" className="hover:text-red-400"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-400"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-400"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-400"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-400"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              {content.links.map((link, idx) => (
                <li key={idx}>
                  {link.url.startsWith('/') ? (
                    <Link to={link.url} className="hover:text-white hover:underline transition-all">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.url} className="hover:text-white hover:underline transition-all">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a 
                  href="/#campus-location" 
                  onClick={scrollToCampusMap}
                  className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold transition-all"
                >
                  <Compass className="w-4 h-4" />
                  Campus Location & Maps
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">Our Campuses</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">Main Campus (Kumba)</strong>
                  <span>Alaska Street Junction, Buea Road, Cameroon</span>
                </div>
              </li>

              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <span>phhipros.edu@gmail.com</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <div className="text-white text-xs font-semibold mb-0.5">Telephone Hotline</div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-300">
                    <a href="tel:+237673575151" className="hover:text-white transition-colors">+237 673 575 151</a>
                    <span>/</span>
                    <a href="tel:+237675377198" className="hover:text-white transition-colors">+237 675 377 198</a>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-white/10">
              <a
                href="/#campus-location"
                onClick={scrollToCampusMap}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-700/80 hover:bg-red-700 text-white text-xs font-bold transition-all w-full justify-center group"
              >
                <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                Open Interactive Campus Map
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">Stay updated with the latest from PHHIPROS.</p>
            {footerJoined ? (
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed to PHHIPROS updates!</span>
              </div>
            ) : (
              <form onSubmit={handleFooterJoin} className="flex">
                <input
                  type="email"
                  required
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-white/10 border border-white/20 rounded-l px-4 py-2 text-sm w-full outline-none focus:bg-white/20 text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-r text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400 font-medium uppercase tracking-widest">
          <p>© 2026 Paul Herbert Higher Institute of Professional Studies</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Accessibility</a>
            <a href="#" className="hover:text-white">Modern Slavery Statement</a>
            <a href="#" className="hover:text-white">Freedom of Information</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
