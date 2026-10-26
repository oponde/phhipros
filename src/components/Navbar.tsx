import { Search, Menu, User, LogOut, ExternalLink, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useEdit } from '../contexts/EditContext';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { isEditing, setIsEditing, user, login, logout, loading, isLoggingIn } = useEdit();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isMobileProgramsOpen, setIsMobileProgramsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProgramsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProgramsOpen(false);
  }, [location.pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { 
      label: 'Programs', 
      path: '/programs',
      dropdown: [
        { label: 'Our Programs', path: '/programs' },
        { label: 'HND/Bachelor', path: '/undergraduate' },
        { label: 'Postgraduate', path: '/postgraduate' },
        { label: 'Vocational', path: '/vocational' },
      ]
    },
    { label: 'Campuses', path: '/#campus-location' },
    { label: 'Study Online', path: '/study-online', external: true },
    { label: 'FAQ', path: '/faq' },
    { label: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top utility bar */}
      <div className="bg-[#00384d] text-white py-1.5 px-4 text-[10px] md:text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden sm:flex gap-4">
            <a href="#" className="hover:underline">Current Students</a>
            <a href="#" className="hover:underline">Staff</a>
            <a href="#" className="hover:underline">Alumni</a>
          </div>
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            {!loading && (
              <>

                
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden xs:flex items-center gap-1.5 text-gray-300">
                      <img src={user.photoURL || ''} alt="" className="w-5 h-5 rounded-full border border-white/20" />
                      <span className="max-w-[80px] md:max-w-[100px] truncate">{user.displayName}</span>
                    </div>
                    <button onClick={logout} className="flex items-center gap-1 hover:text-red-400 transition-colors whitespace-nowrap">
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Sign out</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={login} 
                    disabled={isLoggingIn}
                    className={`flex items-center gap-1 hover:text-gray-300 ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''} whitespace-nowrap`}
                  >
                    <User className={`w-3.5 h-3.5 ${isLoggingIn ? 'animate-pulse' : ''}`} />
                    {isLoggingIn ? 'Signing in...' : 'Sign in'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img 
              src="/src/assets/images/phhipros_official_logo_1789821636476.jpg" 
              alt="PHHIPROS Logo" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[#00384d] group-hover:text-red-700 transition-colors">PHHIPROS</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-semibold text-gray-500 -mt-1">Paul Herbert Institute</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 font-semibold text-[#00384d] text-[15px]">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group/nav" ref={link.dropdown ? dropdownRef : null}>
                {link.dropdown ? (
                  <button
                    onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                    onMouseEnter={() => setIsProgramsOpen(true)}
                    className={`hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer py-2 ${
                      isProgramsOpen || location.pathname.includes(link.path) || link.dropdown.some(d => location.pathname === d.path)
                        ? 'text-red-700' 
                        : ''
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProgramsOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    onClick={(e) => {
                      if (link.path === '/#campus-location' && location.pathname === '/') {
                        e.preventDefault();
                        document.getElementById('campus-location')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`hover:text-red-700 transition-colors flex items-center gap-1 py-2 ${
                      location.pathname === link.path ? 'text-red-700 border-b-2 border-red-700' : ''
                    }`}
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3 opacity-60" />}
                  </Link>
                )}

                {link.dropdown && (
                  <AnimatePresence>
                    {isProgramsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseLeave={() => setIsProgramsOpen(false)}
                        className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl mt-1 py-2 z-50 overflow-hidden"
                      >
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                              location.pathname === subItem.path ? 'text-red-700 font-bold bg-red-50/50' : 'text-gray-700'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-4 pr-10 py-1.5 border rounded-full text-sm w-40 md:w-64 focus:ring-2 focus:ring-[#00384d] outline-none"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#00384d]" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[#00384d]">PHHIPROS</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">Navigation</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-8 px-6">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {link.dropdown ? (
                        <>
                          <button
                            onClick={() => setIsMobileProgramsOpen(!isMobileProgramsOpen)}
                            className={`w-full flex items-center justify-between py-4 px-4 rounded-xl text-lg font-bold transition-all ${
                              location.pathname.includes(link.path) || link.dropdown.some(d => location.pathname === d.path)
                                ? 'bg-red-50 text-red-700' 
                                : 'text-[#00384d] hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              {link.label}
                            </span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${isMobileProgramsOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isMobileProgramsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-6 pr-2 space-y-1 mt-1"
                              >
                                {link.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between py-3 px-4 rounded-lg text-base font-semibold transition-all ${
                                      location.pathname === subItem.path 
                                        ? 'text-red-700 bg-red-50/50' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    {subItem.label}
                                    <ChevronRight className="w-4 h-4 opacity-30" />
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={(e) => {
                            setIsMenuOpen(false);
                            if (link.path === '/#campus-location' && location.pathname === '/') {
                              e.preventDefault();
                              setTimeout(() => {
                                document.getElementById('campus-location')?.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                            }
                          }}
                          className={`flex items-center justify-between py-4 px-4 rounded-xl text-lg font-bold transition-all ${
                            location.pathname === link.path 
                              ? 'bg-red-50 text-red-700' 
                              : 'text-[#00384d] hover:bg-gray-50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {link.label}
                            {link.external && <ExternalLink className="w-4 h-4 opacity-40" />}
                          </span>
                          <ChevronRight className={`w-5 h-5 ${location.pathname === link.path ? 'opacity-100' : 'opacity-20'}`} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <button className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl text-sm font-bold text-[#00384d]">
                      <Search className="w-4 h-4" />
                      Search Programs
                    </button>
                    <button className="flex items-center gap-3 py-3 px-4 bg-[#00384d] rounded-xl text-sm font-bold text-white">
                      <User className="w-4 h-4" />
                      Student Portal
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-bold">
                  PHHIPROS Academic Platform
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
