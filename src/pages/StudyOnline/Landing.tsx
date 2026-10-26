import React, { useState } from 'react';
import { usePhhiprosAuth } from '../../contexts/PhhiprosAuthContext';
import { usePhhiprosDB } from '../../hooks/usePhhiprosDB';
import { UserRole, Course } from '../../types/study-online';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, CheckCircle2, Play, Users, Calendar } from 'lucide-react';

export function Landing() {
  const { setUserId } = usePhhiprosAuth();
  const { db, addUser } = usePhhiprosDB();
  const [authRole, setAuthRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  const [selectedProgram, setSelectedProgram] = useState<Course | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);

  const handleLogin = () => {
    const u = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password && u.role === authRole);
    if (!u) {
      setError('No matching account. Check your details or sign up.');
      return;
    }
    setUserId(u.id);
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      setError('Fill in every field.');
      return;
    }
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      setError('That email is already registered.');
      return;
    }
    const newUser = {
      id: 'u' + Math.random().toString(36).slice(2, 9),
      name,
      email: email.toLowerCase().trim(),
      password,
      role: authRole,
      bio,
      whatsapp
    };
    addUser(newUser);
    setUserId(newUser.id);
  };

  const handleProgramEnroll = (course: Course) => {
    setSelectedProgram(course);
    setAuthRole('student');
    setAuthMode('signup');
    setShowRegModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#14231C] text-[#F5F1E6]">
      <div className="flex justify-between items-center py-7 px-[6vw] border-b border-[rgba(245,241,230,0.16)]">
        <div className="font-serif text-2xl font-bold flex items-baseline gap-0.5">
          PHHIPROS<span className="text-[#E8C866]">237</span>
        </div>
        <div className="text-[12.5px] text-[rgba(245,241,230,0.6)] hidden md:block">
          Study with your own teachers — live, on Zoom, or on your time
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 p-[6vw] items-center">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-5">
            The classroom follows the teacher, not the building.
          </h1>
          <p className="text-lg leading-relaxed text-[rgba(245,241,230,0.78)] mb-9">
            Teachers upload courses once and reach students anywhere in the country. When it's time to meet face to face, join them live over Zoom — no separate app, no confusion about where class is happening.
          </p>
          <div className="flex gap-9">
            <div>
              <div className="font-serif text-3xl text-[#E8C866]">{db.courses.filter(c => c.published).length}</div>
              <div className="text-[12.5px] text-[rgba(245,241,230,0.6)]">Courses live</div>
            </div>
            <div>
              <div className="font-serif text-3xl text-[#E8C866]">{db.users.filter(u => u.role === 'teacher').length}</div>
              <div className="text-[12.5px] text-[rgba(245,241,230,0.6)]">Teachers</div>
            </div>
            <div>
              <div className="font-serif text-3xl text-[#E8C866]">{db.liveSessions.length}</div>
              <div className="text-[12.5px] text-[rgba(245,241,230,0.6)]">Zoom sessions scheduled</div>
            </div>
          </div>
        </div>

        <div className="bg-[#F4EFE2] text-[#1B2620] rounded-[2px] p-8 border-t-4 border-[#D4A62A] shadow-2xl relative">
          <div className="flex border border-[rgba(20,35,28,0.14)] mb-5">
            {(['student', 'teacher', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => { setAuthRole(role); setAuthMode('login'); setError(''); }}
                className={`flex-1 py-2.5 px-1.5 text-[13.5px] font-semibold transition-colors ${
                  authRole === role 
                    ? 'text-[#1B2620] bg-[rgba(212,166,42,0.14)] border-b-2 border-[#D4A62A]' 
                    : 'text-[#5C6B5F] border-b-2 border-transparent'
                }`}
              >
                I'm a {role}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {authMode === 'signup' && authRole !== 'admin' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Njie Collins"
                    className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
                  />
                </div>
                {authRole === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Short Bio (What you teach)</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Chemistry tutor in Kumba, GCE O/A-Level focus"
                        className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A] min-h-[70px] resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+237 6XX XXX XXX"
                        className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
                      />
                    </div>
                  </>
                )}
              </>
            ) : null}

            <div>
              <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
              />
            </div>

            {error && <div className="text-[#B23A2E] text-[13px] font-medium">{error}</div>}

            <button
              onClick={authMode === 'login' ? handleLogin : handleSignup}
              className={`w-full py-3 px-5 rounded-[2px] font-semibold text-sm transition-all ${
                authRole === 'admin' || authMode === 'login' 
                  ? 'bg-[#14231C] text-[#F5F1E6] hover:bg-[#1D2E24]' 
                  : 'bg-[#D4A62A] text-[#14231C] hover:bg-[#E8C866]'
              }`}
            >
              {authMode === 'login' ? `Log in as ${authRole}` : `Create ${authRole} account`}
            </button>

            {authRole !== 'admin' && (
              <div className="mt-4 text-[13px] text-[#5C6B5F] text-center">
                {authMode === 'login' ? "New here? " : "Already have an account? "}
                <button 
                  onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}
                  className="font-semibold text-[#1B2620] underline hover:no-underline"
                >
                  {authMode === 'login' ? `Create a ${authRole} account` : "Log in"}
                </button>
              </div>
            )}

            {authMode === 'login' && (
              <div className="mt-5 pt-4 border-t border-dashed border-[rgba(20,35,28,0.14)]">
                <div className="text-[11.5px] text-[#5C6B5F] mb-2 uppercase tracking-widest font-bold">Quick Demo Access</div>
                <div className="flex flex-wrap gap-2">
                  {authRole === 'teacher' && (
                    <button 
                      onClick={() => setUserId('u1')}
                      className="py-1.5 px-3 border border-[rgba(20,35,28,0.14)] text-[12.5px] font-medium rounded-[2px] hover:bg-[rgba(20,35,28,0.05)] transition-colors"
                    >
                      Demo: Fon Emmanuel
                    </button>
                  )}
                  {authRole === 'student' && (
                    <button 
                      onClick={() => setUserId('u3')}
                      className="py-1.5 px-3 border border-[rgba(20,35,28,0.14)] text-[12.5px] font-medium rounded-[2px] hover:bg-[rgba(20,35,28,0.05)] transition-colors"
                    >
                      Demo: Achu Blessing
                    </button>
                  )}
                  {authRole === 'admin' && (
                    <button 
                      onClick={() => setUserId('admin')}
                      className="py-1.5 px-3 border border-[rgba(20,35,28,0.14)] text-[12.5px] font-medium rounded-[2px] hover:bg-[rgba(20,35,28,0.05)] transition-colors"
                    >
                      Demo: Admin Panel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Programs Section */}
      <div className="bg-[#F4EFE2] py-24 px-[6vw]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-serif text-4xl font-semibold text-[#14231C] mb-3">Popular Programs</h2>
              <p className="text-[#5C6B5F] max-w-xl">Join thousands of students across Cameroon learning from top-rated teachers in these featured courses.</p>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#D4A62A] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Featured Today
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {db.courses.filter(c => c.published).slice(0, 3).map(course => {
              const teacher = db.users.find(u => u.id === course.teacherId);
              return (
                <div key={course.id} className="bg-white rounded-sm border border-[rgba(20,35,28,0.1)] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                  <div className="p-7 flex-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-[rgba(212,166,42,0.16)] text-[#8a6a10] rounded-sm mb-4 uppercase tracking-wider">{course.category}</span>
                    <h3 className="font-serif text-xl font-bold text-[#14231C] mb-3 group-hover:text-[#D4A62A] transition-colors">{course.title}</h3>
                    <p className="text-[14px] text-[#5C6B5F] leading-relaxed line-clamp-3 mb-6">{course.description}</p>
                    
                    <div className="flex items-center gap-3 pt-6 border-t border-[rgba(20,35,28,0.06)]">
                      <div className="w-8 h-8 bg-[#14231C] text-[#F5F1E6] rounded-full flex items-center justify-center font-serif text-xs font-bold uppercase">
                        {teacher?.name.charAt(0)}
                      </div>
                      <div className="text-[12.5px] text-[#5C6B5F]">by <span className="font-bold text-[#14231C]">{teacher?.name}</span></div>
                    </div>
                  </div>
                  <div className="p-7 bg-[#F9F7F0] border-t border-[rgba(20,35,28,0.06)]">
                    <button 
                      onClick={() => handleProgramEnroll(course)}
                      className="w-full bg-[#14231C] text-[#F5F1E6] py-3 rounded-sm font-bold text-[14px] hover:bg-[#D4A62A] hover:text-[#14231C] transition-all"
                    >
                      Enroll Today
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRegModal && selectedProgram && (
          <div className="fixed inset-0 bg-[#14231C]/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#F4EFE2] w-full max-w-lg rounded-sm shadow-2xl border-t-4 border-[#D4A62A] overflow-hidden"
            >
              <div className="p-6 border-b border-[rgba(20,35,28,0.14)] flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#14231C]">Student Registration</h3>
                  <div className="text-[12px] text-[#5C6B5F] mt-0.5">Enrolling in: <span className="font-bold text-[#D4A62A]">{selectedProgram.title}</span></div>
                </div>
                <button onClick={() => setShowRegModal(false)} className="p-2 hover:bg-[rgba(20,35,28,0.06)] rounded-full transition-colors">
                  <X className="w-5 h-5 text-[#5C6B5F]" />
                </button>
              </div>

              <div className="p-8 space-y-5">
                <div className="bg-[#D4A62A]/10 border border-[#D4A62A]/20 p-4 rounded-sm flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#D4A62A] flex-shrink-0 mt-0.5" />
                  <div className="text-[13px] text-[#14231C]">
                    Create your student account below to get instant access to the course material and scheduled Zoom sessions.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Njie Collins"
                    className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C6B5F] mb-1.5 uppercase tracking-wider">Choose Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full py-2.5 px-3 border border-[rgba(20,35,28,0.14)] rounded-[2px] bg-white text-[14.5px] outline-none focus:ring-1 focus:ring-[#D4A62A]"
                  />
                </div>

                {error && <div className="text-[#B23A2E] text-[13px] font-medium">{error}</div>}

                <button
                  onClick={handleSignup}
                  className="w-full py-4 bg-[#14231C] text-[#F5F1E6] font-bold text-[14px] rounded-sm hover:bg-[#D4A62A] hover:text-[#14231C] transition-all shadow-lg mt-4"
                >
                  Confirm Registration & Enroll
                </button>

                <p className="text-[11px] text-[#5C6B5F] text-center mt-2">
                  By registering, you agree to Phhipros237 terms of service and student guidelines.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

