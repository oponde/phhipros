import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BookOpen, GraduationCap, BarChart3, Plus, Key, Trash2, X, ShieldCheck, FileText, Check, Clock as ClockIcon, Ban, HelpCircle, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { usePhhiprosDB } from '../../hooks/usePhhiprosDB';
import { User, StudentInquiry } from '../../types/study-online';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { db, addUser, deleteCourse, updateUserPassword, updateApplicationStatus, updateInquiryStatus, deleteInquiry } = usePhhiprosDB();
  const [activeTab, setActiveTab] = useState('overview');
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const pendingInquiriesCount = (db.inquiries || []).filter(i => i.status === 'pending').length;

  const navItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'create-user', label: 'Add teacher/student' },
    { key: 'courses', label: 'All courses' },
    { key: 'applications', label: 'Admissions' },
    { key: 'inquiries', label: pendingInquiriesCount > 0 ? `Inquiries (${pendingInquiriesCount})` : 'Inquiries' },
    { key: 'users', label: 'All users' },
  ];

  const confirmDelete = (id: string) => {
    setDeletingCourseId(id);
  };

  const executeDelete = () => {
    if (deletingCourseId) {
      deleteCourse(deletingCourseId);
      setDeletingCourseId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4EFE2]">
      <Sidebar user={user} items={navItems} activeKey={activeTab} onSelect={setActiveTab} />
      
      <main className="flex-1 p-8 lg:p-12 max-w-6xl">
        {activeTab === 'overview' && <AdminOverview db={db} />}
        {activeTab === 'create-user' && <AdminCreateUser onAdd={addUser} />}
        {activeTab === 'courses' && <AdminCourses db={db} onDelete={confirmDelete} />}
        {activeTab === 'applications' && <AdminApplications db={db} onUpdateStatus={updateApplicationStatus} />}
        {activeTab === 'inquiries' && <AdminInquiries db={db} onUpdateStatus={updateInquiryStatus} onDelete={deleteInquiry} />}
        {activeTab === 'users' && <AdminUsers db={db} onReset={updateUserPassword} />}
      </main>

      <AnimatePresence>
        {deletingCourseId && (
          <DeleteConfirmModal 
            onConfirm={executeDelete} 
            onCancel={() => setDeletingCourseId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-[#14231C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#F4EFE2] w-full max-w-sm p-8 rounded-sm shadow-2xl border-t-4 border-[#B23A2E] text-center"
      >
        <div className="w-16 h-16 bg-[#B23A2E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-[#B23A2E]" />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-[#14231C] mb-2">Delete Course?</h3>
        <p className="text-[14px] text-[#5C6B5F] mb-8 leading-relaxed">
          Administrator override: This action is permanent and will remove all student data associated with this course.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 border border-[rgba(20,35,28,0.14)] text-[#14231C] font-bold text-[14px] rounded-sm hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#B23A2E] text-[#F5F1E6] font-bold text-[14px] rounded-sm hover:bg-[#8D2D24] transition-colors"
          >
            Delete Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminOverview({ db }: any) {
  const pendingInqCount = (db.inquiries || []).filter((i: any) => i.status === 'pending').length;
  const stats = [
    { label: 'Teachers', count: db.users.filter((u: any) => u.role === 'teacher').length, icon: GraduationCap },
    { label: 'Students', count: db.users.filter((u: any) => u.role === 'student').length, icon: Users },
    { label: 'Courses', count: db.courses.length, icon: BookOpen },
    { label: 'Pending Inquiries', count: pendingInqCount, icon: HelpCircle },
  ];

  const upcomingSessions = db.liveSessions.filter((s: any) => new Date(s.datetime) > new Date());

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Platform overview</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Campus237 platform performance at a glance</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <s.icon className="w-5 h-5 text-[#D4A62A]" />
              <div className="text-[10px] font-bold text-[#5C6B5F] uppercase tracking-widest">{s.label}</div>
            </div>
            <div className="font-serif text-3xl font-semibold text-[#14231C]">{s.count}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-8 shadow-sm">
        <h3 className="font-bold text-[#14231C] mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
          Upcoming Live Sessions
          <span className="text-xs bg-[rgba(212,166,42,0.16)] text-[#8a6a10] px-2 py-0.5 rounded-sm">{upcomingSessions.length}</span>
        </h3>
        {upcomingSessions.length === 0 ? (
          <div className="text-sm text-[#5C6B5F] italic py-2">No live sessions scheduled currently.</div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.slice(0, 6).map((s: any) => (
              <div key={s.id} className="flex justify-between items-center text-sm border-b border-[rgba(20,35,28,0.06)] pb-3 last:border-0">
                <div>
                  <div className="font-bold text-[#14231C] text-[15px]">{s.title}</div>
                  <div className="text-[#5C6B5F] text-[12.5px] mt-0.5">by {db.users.find((u: any) => u.id === s.teacherId)?.name} · {s.platform}</div>
                </div>
                <div className="text-[#14231C] font-bold text-[13px] bg-[#F4EFE2] px-3 py-1 rounded-sm">
                  {new Date(s.datetime).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AdminCreateUser({ onAdd }: any) {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [lastCreated, setLastCreated] = useState<any>(null);

  const handleCreate = () => {
    if (!name || !email || !password) return;
    const newUser = {
      id: 'u' + Math.random().toString(36).slice(2, 9),
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      bio: role === 'teacher' ? bio : undefined,
      whatsapp: role === 'teacher' ? whatsapp : undefined
    };
    onAdd(newUser);
    setLastCreated(newUser);
    setName('');
    setEmail('');
    setPassword('');
    setBio('');
    setWhatsapp('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Add teacher or student</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Set credentials manually and share them with the user</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-8 space-y-6 shadow-sm">
          <div className="flex border border-[rgba(20,35,28,0.14)] rounded-sm overflow-hidden mb-2">
            <button onClick={() => setRole('teacher')} className={`flex-1 py-2.5 text-[13px] font-bold ${role === 'teacher' ? 'bg-[rgba(212,166,42,0.15)] text-[#14231C] border-b-2 border-[#D4A62A]' : 'text-[#5C6B5F]'}`}>Teacher</button>
            <button onClick={() => setRole('student')} className={`flex-1 py-2.5 text-[13px] font-bold ${role === 'student' ? 'bg-[rgba(212,166,42,0.15)] text-[#14231C] border-b-2 border-[#D4A62A]' : 'text-[#5C6B5F]'}`}>Student</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Njie Collins" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm text-[14px]" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Username / Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. njie.collins@campus237.cm" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm text-[14px]" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set initial password" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm text-[14px]" />
            </div>
            {role === 'teacher' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Short Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm text-[14px] min-h-[80px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">WhatsApp Number</label>
                  <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+237 6XX XXX XXX" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm text-[14px]" />
                </div>
              </>
            )}
            <button onClick={handleCreate} className="w-full bg-[#14231C] text-[#F5F1E6] py-3.5 rounded-sm font-bold text-[14px] hover:bg-[#1D2E24] transition-all">Create {role} account</button>
          </div>
        </div>

        <div>
          {lastCreated && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#14231C] text-[#F5F1E6] p-8 rounded-sm shadow-xl border-l-4 border-[#D4A62A]">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-[#E8C866]" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Account Created Successfully</h3>
              </div>
              <p className="text-[13.5px] text-[#F5F1E6]/70 mb-6 leading-relaxed">Share these credentials with {lastCreated.name}. They can now log in to their dashboard.</p>
              <div className="bg-white/5 p-4 rounded-sm space-y-3 font-mono text-[13.5px]">
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-[#F5F1E6]/50">Username</span> <span>{lastCreated.email}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-[#F5F1E6]/50">Password</span> <span className="font-bold text-[#E8C866]">{lastCreated.password}</span></div>
                <div className="flex justify-between"><span className="text-[#F5F1E6]/50">Role</span> <span className="uppercase font-bold">{lastCreated.role}</span></div>
              </div>
              <button onClick={() => setLastCreated(null)} className="mt-6 text-[12px] font-bold text-[#F5F1E6]/50 hover:text-white uppercase tracking-widest">Dismiss</button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AdminCourses({ db, onDelete }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">All courses</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Manage every course published on the platform</div>
        </div>
      </div>

      <div className="space-y-3">
        {db.courses.map((c: any) => {
          const teacher = db.users.find((u: any) => u.id === c.teacherId);
          return (
            <div key={c.id} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-5 flex justify-between items-center group shadow-sm">
              <div>
                <div className="font-serif text-lg font-semibold text-[#14231C]">{c.title}</div>
                <div className="text-[13px] text-[#5C6B5F] mt-0.5">by {teacher?.name} · {c.category}</div>
              </div>
              <button onClick={() => onDelete(c.id)} className="p-2.5 text-[#B23A2E] hover:bg-[#B23A2E]/5 rounded-full transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AdminApplications({ db, onUpdateStatus }: any) {
  const applications = db.applications || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Admission requests</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Review and process student applications ({applications.length})</div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm p-12 text-center">
          <div className="w-16 h-16 bg-[#F4EFE2] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#5C6B5F]" />
          </div>
          <h3 className="font-bold text-[#14231C] mb-1">No applications yet</h3>
          <p className="text-sm text-[#5C6B5F]">New student admission forms will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app: any) => (
            <div key={app.id} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[rgba(20,35,28,0.06)] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-xl font-bold text-[#14231C]">{app.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      app.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      app.status === 'accepted' ? 'bg-green-50 text-green-600 border border-green-200' :
                      'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="text-[13px] text-[#5C6B5F]">{app.email} · {app.phone}</div>
                </div>
                <div className="text-[11px] text-[#5C6B5F] font-bold uppercase tracking-tighter">
                  Received: {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="p-6 bg-[#F9F7F0]/30 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-[#5C6B5F] uppercase tracking-widest mb-1 block">Intended Program</label>
                  <div className="text-[14.5px] font-bold text-[#14231C]">{app.program}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5C6B5F] uppercase tracking-widest mb-1 block">Previous Education</label>
                  <div className="text-[14.5px] text-[#14231C]">{app.previousEducation}</div>
                </div>
                {app.message && (
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-[#5C6B5F] uppercase tracking-widest mb-1 block">Statement / Message</label>
                    <div className="text-[14px] text-[#5C6B5F] italic leading-relaxed">"{app.message}"</div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3">
                {app.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(app.id, 'rejected')}
                      className="flex items-center gap-2 px-4 py-2 text-[12px] font-bold text-[#B23A2E] hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <Ban className="w-4 h-4" /> Decline
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(app.id, 'accepted')}
                      className="flex items-center gap-2 px-4 py-2 text-[12px] font-bold bg-[#14231C] text-white hover:bg-[#1D2E24] rounded-sm transition-all shadow-md"
                    >
                      <Check className="w-4 h-4" /> Accept Student
                    </button>
                  </>
                )}
                {app.status !== 'pending' && (
                  <div className="text-xs font-bold text-[#5C6B5F] px-4 py-2 uppercase tracking-widest">
                    Status: {app.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AdminInquiries({ db, onUpdateStatus, onDelete }: any) {
  const inquiries: StudentInquiry[] = db.inquiries || [];
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || inq.category === filterCategory;
    if (!matchesStatus || !matchesCategory) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.subject.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q) ||
      inq.ticketNumber.toLowerCase().includes(q)
    );
  });

  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const inProgressCount = inquiries.filter(i => i.status === 'in_progress').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Student Inquiries</h2>
            {pendingCount > 0 && (
              <span className="bg-red-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <div className="text-[13.5px] text-[#5C6B5F]">
            Manage incoming student questions, academic advice requests, and tickets ({inquiries.length} total)
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 border border-[rgba(20,35,28,0.1)] rounded-lg">
          {[
            { id: 'all', label: `All (${inquiries.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'in_progress', label: `In Progress (${inProgressCount})` },
            { id: 'resolved', label: `Resolved (${resolvedCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === tab.id
                  ? 'bg-[#14231C] text-white shadow-sm'
                  : 'text-[#5C6B5F] hover:text-[#14231C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search by student name, email, subject, or ticket #..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[rgba(20,35,28,0.14)] rounded-sm text-sm text-[#14231C] outline-none focus:border-[#14231C]"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[rgba(20,35,28,0.14)] rounded-sm text-sm text-[#14231C] outline-none focus:border-[#14231C]"
          >
            <option value="all">All Categories</option>
            <option value="Admissions">Admissions</option>
            <option value="Tuition & Fees">Tuition & Fees</option>
            <option value="Online Learning">Online Learning</option>
            <option value="Programs & Degrees">Programs & Degrees</option>
            <option value="Internships & Clinical">Internships & Clinical</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-white border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm p-12 text-center">
          <div className="w-16 h-16 bg-[#F4EFE2] rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-[#5C6B5F]" />
          </div>
          <h3 className="font-bold text-[#14231C] mb-1">No inquiries found</h3>
          <p className="text-sm text-[#5C6B5F]">
            {query || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search criteria.'
              : 'Student questions submitted via the website FAQ will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredInquiries.map((inq: StudentInquiry) => {
            const formattedDate = new Date(inq.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const cleanPhone = inq.phone.replace(/[^0-9]/g, '');

            return (
              <div key={inq.id} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[rgba(20,35,28,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {inq.ticketNumber}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#14231C]">{inq.subject}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        inq.status === 'pending'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : inq.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {inq.status === 'in_progress' ? 'In Progress' : inq.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6B5F]">
                      <span className="font-semibold text-gray-800">{inq.name}</span>
                      <span>·</span>
                      <span className="capitalize">{inq.studentType}</span>
                      <span>·</span>
                      <span className="text-red-700 font-medium">{inq.category}</span>
                      <span>·</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Student Contact Affordances */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`mailto:${inq.email}?subject=Re: [${inq.ticketNumber}] ${encodeURIComponent(inq.subject)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#14231C] bg-[#F4EFE2] hover:bg-[#eae4d3] rounded transition-colors"
                      title="Reply via Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20PHHIPROS%20regarding%20ticket%20${inq.ticketNumber}:`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        WhatsApp
                      </a>
                    )}
                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      title="Call student"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  </div>
                </div>

                {/* Inquiry Message Body */}
                <div className="p-6 bg-[#F9F7F0]/40">
                  <div className="text-xs font-bold text-[#5C6B5F] uppercase tracking-wider mb-2">
                    Student Query Details
                  </div>
                  <p className="text-sm text-[#14231C] leading-relaxed whitespace-pre-wrap bg-white p-4 rounded border border-[rgba(20,35,28,0.06)]">
                    {inq.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#5C6B5F]">
                    <div><strong>Contact Email:</strong> {inq.email}</div>
                    <div><strong>Phone:</strong> {inq.phone}</div>
                  </div>
                </div>

                {/* Status Toggle Bar */}
                <div className="p-3 bg-gray-50 border-t border-[rgba(20,35,28,0.06)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-500">Update status:</span>
                    {inq.status !== 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'in_progress')}
                        className="px-2.5 py-1 text-amber-700 hover:bg-amber-100 rounded font-semibold transition-colors"
                      >
                        Set In Progress
                      </button>
                    )}
                    {inq.status !== 'resolved' && (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'resolved')}
                        className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                      </button>
                    )}
                    {inq.status !== 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'pending')}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 rounded font-medium transition-colors"
                      >
                        Re-open (Pending)
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onDelete(inq.id)}
                    className="text-gray-400 hover:text-red-700 p-1.5 transition-colors"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function AdminUsers({ db, onReset }: any) {
  const [showReset, setShowReset] = useState<User | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">All users</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Access control and account management</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {db.users.map((u: any) => (
          <div key={u.id} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-5 flex justify-between items-center shadow-sm">
            <div>
              <div className="font-bold text-[#14231C] text-[15px]">{u.name}</div>
              <div className="text-[12.5px] text-[#5C6B5F] uppercase tracking-widest font-bold mt-1">{u.role}</div>
              <div className="text-[13px] text-[#5C6B5F] mt-0.5">{u.email}</div>
            </div>
            {u.role !== 'admin' && (
              <button onClick={() => setShowReset(u)} className="p-2.5 text-[#14231C] hover:bg-[rgba(20,35,28,0.05)] rounded-full transition-colors">
                <Key className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showReset && (
          <ResetModal 
            user={showReset} 
            onClose={() => setShowReset(null)} 
            onConfirm={(pass: string) => {
              onReset(showReset.id, pass);
              setShowReset(null);
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResetModal({ user, onClose, onConfirm }: { user: User, onClose: () => void, onConfirm: (pass: string) => void }) {
  const [pass, setPass] = useState('');

  return (
    <div className="fixed inset-0 bg-[#14231C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#F4EFE2] w-full max-w-sm p-8 rounded-sm shadow-2xl border-t-4 border-[#D4A62A]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-2xl font-semibold text-[#14231C]">Reset Password</h3>
          <button onClick={onClose} className="p-1 hover:bg-[rgba(20,35,28,0.06)] rounded-full transition-colors"><X className="w-5 h-5 text-[#5C6B5F]" /></button>
        </div>

        <div className="mb-6">
          <div className="text-[14px] text-[#5C6B5F] mb-1">User</div>
          <div className="text-[16px] font-bold text-[#14231C]">{user.name} ({user.email})</div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">New Password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Set new password" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]" />
          </div>
          <div className="pt-2 flex gap-3">
            <button onClick={() => pass && onConfirm(pass)} disabled={!pass} className="flex-1 bg-[#14231C] text-[#F5F1E6] py-3 rounded-sm font-bold text-[14px] hover:bg-[#1D2E24] disabled:opacity-50">
              Save Password
            </button>
            <button onClick={onClose} className="flex-1 border border-[rgba(20,35,28,0.14)] text-[#14231C] py-3 rounded-sm font-bold text-[14px] hover:bg-white">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
