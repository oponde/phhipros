import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Video, MessageSquare, Trash2, X, AlertCircle } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { usePhhiprosDB } from '../../hooks/usePhhiprosDB';
import { User } from '../../types/study-online';
import { fmtDate, sessionStatus, saveVideoBlob, fmtSize, MAX_VIDEO_BYTES } from './utils';

interface TeacherDashboardProps {
  user: User;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const { db, addCourse, updateCourse, deleteCourse, addLiveSession, deleteLiveSession, updateSessionRequest } = usePhhiprosDB();
  const [activeTab, setActiveTab] = useState('courses');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const navItems = [
    { key: 'courses', label: 'My courses' },
    { key: 'create', label: 'Create course' },
    { key: 'live', label: 'Live sessions' },
    { key: 'requests', label: '1:1 requests' },
  ];

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setActiveTab('edit');
  };

  const confirmDelete = (id: string) => {
    setDeletingCourseId(id);
  };

  const executeDelete = () => {
    if (deletingCourseId) {
      deleteCourse(deletingCourseId);
      setDeletingCourseId(null);
    }
  };

  const confirmDeleteSession = (id: string) => {
    setDeletingSessionId(id);
  };

  const executeDeleteSession = () => {
    if (deletingSessionId) {
      deleteLiveSession(deletingSessionId);
      setDeletingSessionId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4EFE2]">
      <Sidebar user={user} items={navItems} activeKey={activeTab} onSelect={(key) => { setActiveTab(key); if(key !== 'edit') setEditingCourse(null); }} />
      
      <main className="flex-1 p-8 lg:p-12 max-w-6xl">
        {activeTab === 'courses' && <TeacherCourses db={db} user={user} onDelete={confirmDelete} onEdit={handleEdit} />}
        {activeTab === 'create' && <TeacherCreateCourse user={user} onPublish={(c: any) => { addCourse(c); setActiveTab('courses'); }} />}
        {activeTab === 'edit' && editingCourse && (
          <TeacherCreateCourse 
            user={user} 
            course={editingCourse}
            onPublish={(c: any) => { updateCourse(editingCourse.id, c); setEditingCourse(null); setActiveTab('courses'); }} 
          />
        )}
        {activeTab === 'live' && <TeacherLive db={db} user={user} onAdd={addLiveSession} onDelete={confirmDeleteSession} />}
        {activeTab === 'requests' && <TeacherRequests db={db} user={user} onUpdate={updateSessionRequest} />}
      </main>

      <AnimatePresence>
        {deletingCourseId && (
          <DeleteConfirmModal 
            onConfirm={executeDelete} 
            onCancel={() => setDeletingCourseId(null)} 
          />
        )}
        {deletingSessionId && (
          <CancellationConfirmModal 
            onConfirm={executeDeleteSession} 
            onCancel={() => setDeletingSessionId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CancellationConfirmModal({ onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-[#14231C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#F4EFE2] w-full max-w-sm p-8 rounded-sm shadow-2xl border-t-4 border-[#B23A2E] text-center"
      >
        <h3 className="font-serif text-2xl font-semibold text-[#14231C] mb-2">Cancel Session?</h3>
        <p className="text-[14px] text-[#5C6B5F] mb-8 leading-relaxed">
          Are you sure you want to cancel this live session? Enrolled students will no longer see this scheduled event.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border border-[rgba(20,35,28,0.14)] text-[#14231C] font-bold text-[14px] rounded-sm hover:bg-white">Keep it</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-[#B23A2E] text-[#F5F1E6] font-bold text-[14px] rounded-sm hover:bg-[#8D2D24]">Cancel Session</button>
        </div>
      </motion.div>
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
          This action is permanent. All lessons, enrolled student progress, and scheduled live sessions for this course will be removed.
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

function TeacherCourses({ db, user, onDelete, onEdit }: any) {
  const mine = db.courses.filter((c: any) => c.teacherId === user.id);
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">My courses</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">{mine.length} course{mine.length !== 1 ? 's' : ''} published under your name</div>
        </div>
      </div>

      {mine.length === 0 ? (
        <div className="p-12 text-center text-[#5C6B5F] border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm text-[14.5px] bg-white/50">
          You haven't uploaded a course yet. Head to "Create course" to publish your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mine.map((c: any) => {
            const enrolledCount = db.enrollments.filter((e: any) => e.courseId === c.id).length;
            return (
              <div key={c.id} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-5 hover:shadow-lg transition-shadow group">
                <span className="inline-block text-[10.5px] font-bold px-2 py-0.5 bg-[rgba(212,166,42,0.16)] text-[#8a6a10] rounded-sm mb-3 uppercase tracking-wider">{c.category}</span>
                <h3 className="font-serif text-lg font-semibold text-[#14231C] mb-2">{c.title}</h3>
                <p className="text-[13.5px] text-[#5C6B5F] line-clamp-2 mb-4 leading-relaxed">{c.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-[rgba(20,35,28,0.06)]">
                  <div className="text-[12.5px] text-[#5C6B5F]">{enrolledCount} students · {c.lessons.length} lessons</div>
                </div>
                <div className="pt-3 border-t border-[rgba(20,35,28,0.06)] flex gap-4">
                  <button 
                    onClick={() => onEdit(c)}
                    className="text-[12px] font-semibold text-[#14231C] hover:underline"
                  >
                    Edit course
                  </button>
                  <button 
                    onClick={() => onDelete(c.id)}
                    className="text-[12px] font-semibold text-[#B23A2E] hover:underline"
                  >
                    Delete course
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

function TeacherCreateCourse({ user, onPublish, course }: any) {
  const [title, setTitle] = useState(course?.title || '');
  const [desc, setDesc] = useState(course?.description || '');
  const [cat, setCat] = useState(course?.category || 'Mathematics');
  const [outcomes, setOutcomes] = useState(course?.outcomes?.join('\n') || '');
  const [lessons, setLessons] = useState<any[]>(course?.lessons || []);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const addLesson = () => {
    setLessons([...lessons, { title: '', content: '', link: '', videoName: '', videoSize: 0, _file: null }]);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const updateLesson = (index: number, field: string, value: any) => {
    const next = [...lessons];
    next[index][field] = value;
    setLessons(next);
  };

  const handlePublish = async () => {
    setError('');
    if (!title || !desc) {
      setError('Please add a course title and description.');
      return;
    }
    
    setIsPublishing(true);
    try {
      const processedLessons = [];
      for (const l of lessons.filter(l => l.title)) {
        const lesson: any = { title: l.title, content: l.content, link: l.link, videoName: l.videoName, videoSize: l.videoSize };
        if (l._file) {
          const videoId = 'vid' + Math.random().toString(36).slice(2, 9);
          await saveVideoBlob(videoId, l._file);
          lesson.videoId = videoId;
        }
        processedLessons.push(lesson);
      }

      onPublish({
        id: course?.id || ('c' + Math.random().toString(36).slice(2, 9)),
        teacherId: user.id,
        title,
        category: cat,
        description: desc,
        outcomes: outcomes.split('\n').filter((o: string) => o.trim()),
        lessons: processedLessons,
        published: true
      });
    } catch (e) {
      setError('Failed to save lesson videos. Please check your storage space.');
      setIsPublishing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">{course ? 'Edit course' : 'Create a course'}</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">{course ? `Updating ${course.title}` : 'Add lessons now, or publish first and add more later'}</div>
        </div>
      </div>

      <div className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-8 max-w-2xl space-y-6">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#5C6B5F] uppercase tracking-wider">Course Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-[#F4EFE2]/30"
            placeholder="e.g. GCE Biology Revision Intensive"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#5C6B5F] uppercase tracking-wider">Category</label>
          <select 
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-[#F4EFE2]/30"
          >
            <option>Mathematics</option>
            <option>Sciences</option>
            <option>Languages</option>
            <option>Business</option>
            <option>ICT</option>
            <option>Exam Prep</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#5C6B5F] uppercase tracking-wider">Description</label>
          <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-[#F4EFE2]/30 min-h-[100px]"
            placeholder="Detailed course overview..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#5C6B5F] uppercase tracking-wider">Key Learning Outcomes</label>
          <textarea 
            value={outcomes}
            onChange={(e) => setOutcomes(e.target.value)}
            className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-[#F4EFE2]/30 min-h-[100px]"
            placeholder="What will students learn? (One outcome per line)"
          />
          <div className="text-[11px] text-[#5C6B5F] mt-1">Enter each outcome on a new line. They will be displayed as a list in the course preview.</div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-bold text-[#5C6B5F] uppercase tracking-wider">Lessons</label>
            <button onClick={addLesson} className="text-[12.5px] font-bold text-[#14231C] underline">+ Add Lesson</button>
          </div>
          
          <div className="space-y-4">
            {lessons.map((l, i) => (
              <div key={i} className="p-4 border border-[rgba(20,35,28,0.14)] bg-[#F4EFE2]/20 rounded-sm">
                <div className="flex justify-between mb-3">
                  <span className="text-[13px] font-bold text-[#14231C]">Lesson {i + 1}</span>
                  <button onClick={() => removeLesson(i)} className="text-[#B23A2E] text-[12px] font-bold uppercase tracking-wider">Remove</button>
                </div>
                <div className="space-y-3">
                  <input 
                    placeholder="Lesson title" 
                    value={l.title}
                    onChange={(e) => updateLesson(i, 'title', e.target.value)}
                    className="w-full p-2 border border-[rgba(20,35,28,0.14)] rounded-sm text-[13.5px]"
                  />
                  <textarea 
                    placeholder="Lesson summary/content" 
                    value={l.content}
                    onChange={(e) => updateLesson(i, 'content', e.target.value)}
                    className="w-full p-2 border border-[rgba(20,35,28,0.14)] rounded-sm text-[13.5px] min-h-[60px]"
                  />
                  <input 
                    placeholder="External resource link (optional)" 
                    value={l.link}
                    onChange={(e) => updateLesson(i, 'link', e.target.value)}
                    className="w-full p-2 border border-[rgba(20,35,28,0.14)] rounded-sm text-[13.5px]"
                  />
                  <div>
                    <label className="text-[11px] font-bold text-[#5C6B5F] mb-1 block">VIDEO (MAX 50MB)</label>
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > MAX_VIDEO_BYTES) {
                            alert('Video is too large (Max 50MB)');
                            e.target.value = '';
                            return;
                          }
                          updateLesson(i, '_file', file);
                          updateLesson(i, 'videoName', file.name);
                          updateLesson(i, 'videoSize', file.size);
                        }
                      }}
                      className="text-[12px]"
                    />
                    {l.videoName && <div className="text-[11px] text-[#5C6B5F] mt-1">{l.videoName} · {fmtSize(l.videoSize)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="flex items-center gap-2 text-[#B23A2E] text-[13px] font-medium"><AlertCircle className="w-4 h-4" /> {error}</div>}

        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full bg-[#14231C] text-[#F5F1E6] py-3.5 rounded-sm font-bold text-[14px] hover:bg-[#1D2E24] disabled:opacity-50 transition-all"
        >
          {isPublishing ? (course ? 'Saving...' : 'Publishing...') : (course ? 'Save changes' : 'Publish course')}
        </button>
      </div>
    </motion.div>
  );
}

function TeacherLive({ db, user, onAdd, onDelete }: any) {
  const mine = db.courses.filter((c: any) => c.teacherId === user.id);
  const sessions = db.liveSessions.filter((s: any) => s.teacherId === user.id).sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Live sessions</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Schedule a Zoom or Meet class for one of your courses</div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#D4A62A] text-[#14231C] px-5 py-2.5 rounded-sm font-bold text-[14px] hover:bg-[#E8C866] transition-colors">+ Schedule Live Session</button>
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center text-[#5C6B5F] border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm text-[14.5px] bg-white/50">
          No live sessions scheduled yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => {
            const status = sessionStatus(s.datetime);
            const course = db.courses.find((c: any) => c.id === s.courseId);
            return (
              <div key={s.id} className={`bg-white border border-[rgba(20,35,28,0.14)] border-l-4 ${status === 'live' ? 'border-l-[#B23A2E]' : 'border-l-[#D4A62A]'} p-5 flex justify-between items-center rounded-sm`}>
                <div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 ${status === 'live' ? 'bg-[#B23A2E]/10 text-[#B23A2E]' : 'bg-[rgba(212,166,42,0.16)] text-[#8a6a10]'} rounded-sm mb-2 uppercase tracking-widest`}>
                    {status === 'live' ? 'LIVE NOW' : status.toUpperCase()}
                  </span>
                  <div className="font-serif text-lg font-semibold text-[#14231C]">{s.title}</div>
                  <div className="text-[13px] text-[#5C6B5F]">{course?.title} · {fmtDate(s.datetime)}</div>
                  <div className="mt-3 bg-[#14231C] text-[#F5F1E6] p-3 text-[13.5px] rounded-sm">
                    {s.platform}: <a href={s.zoomLink} target="_blank" rel="noopener" className="text-[#E8C866] font-bold underline hover:no-underline">{s.zoomLink}</a>
                  </div>
                </div>
                <button onClick={() => onDelete(s.id)} className="text-[#B23A2E] text-[13px] font-bold hover:underline">Cancel</button>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && <LiveModal courses={mine} teacherId={user.id} onClose={() => setShowModal(false)} onSave={onAdd} />}
      </AnimatePresence>
    </motion.div>
  );
}

function TeacherRequests({ db, user, onUpdate }: any) {
  const reqs = db.sessionRequests.filter((r: any) => r.teacherId === user.id).sort((a: any, b: any) => a.status === 'pending' ? -1 : 1);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">1:1 requests</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Students asking for private coaching sessions</div>
        </div>
      </div>

      {reqs.length === 0 ? (
        <div className="p-12 text-center text-[#5C6B5F] border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm text-[14.5px] bg-white/50">
          No coaching requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reqs.map((r: any) => {
            const student = db.users.find((u: any) => u.id === r.studentId);
            return (
              <RequestCard key={r.id} request={r} student={student} onUpdate={onUpdate} />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function RequestCard({ request, student, onUpdate }: any) {
  const [platform, setPlatform] = useState('Google Meet');
  const [link, setLink] = useState('');
  const [time, setTime] = useState('');

  const handleAccept = () => {
    if (!link || !time) {
      alert('Please provide a meeting link and time.');
      return;
    }
    onUpdate(request.id, { 
      status: 'accepted', 
      platform, 
      zoomLink: link, 
      datetime: new Date(time).toISOString() 
    });
  };

  return (
    <div className="bg-white border border-[rgba(20,35,28,0.14)] border-l-4 border-l-[#D4A62A] p-6 rounded-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${
            request.status === 'pending' ? 'bg-[#D4A62A]/15 text-[#8a6a10]' :
            request.status === 'accepted' ? 'bg-[#2f6b47]/10 text-[#2f6b47]' :
            'bg-[#B23A2E]/10 text-[#B23A2E]'
          }`}>{request.status}</span>
          <h4 className="font-bold text-[#14231C] mt-2 text-lg">{student?.name}</h4>
          <p className="text-[14px] text-[#5C6B5F] italic mt-1">"{request.message}"</p>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="mt-6 pt-5 border-t border-[rgba(20,35,28,0.06)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F]">PLATFORM</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-2 border border-[rgba(20,35,28,0.14)] rounded-sm text-[13px]">
                <option>Google Meet</option>
                <option>Zoom</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-bold text-[#5C6B5F]">MEETING LINK</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="w-full p-2 border border-[rgba(20,35,28,0.14)] rounded-sm text-[13px]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F]">DATE & TIME</label>
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border border-[rgba(20,35,28,0.14)] rounded-sm text-[13px]" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAccept} className="bg-[#14231C] text-[#F5F1E6] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-[#1D2E24]">Accept & Send Link</button>
            <button onClick={() => onUpdate(request.id, { status: 'declined' })} className="border border-[rgba(20,35,28,0.14)] text-[#B23A2E] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-[#B23A2E]/5">Decline</button>
          </div>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="mt-4 bg-[#14231C] text-[#F5F1E6] p-4 rounded-sm">
          <div className="text-[13.5px]">
            {request.platform} scheduled for <span className="font-bold text-[#E8C866]">{fmtDate(request.datetime)}</span>
          </div>
          <div className="mt-1">
            <a href={request.zoomLink} target="_blank" rel="noopener" className="text-[#E8C866] underline text-[13px] font-bold">{request.zoomLink}</a>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveModal({ courses, teacherId, onClose, onSave }: any) {
  const [newSession, setNewSession] = useState({
    courseId: courses[0]?.id || '',
    title: '',
    datetime: '',
    platform: 'Google Meet',
    zoomLink: '',
    meetingId: '',
    passcode: ''
  });

  const handleSave = () => {
    if (!newSession.title || !newSession.datetime || !newSession.zoomLink) {
      alert('Please fill in title, time, and meeting link.');
      return;
    }
    onSave({
      id: 'ls' + Math.random().toString(36).slice(2, 9),
      teacherId,
      ...newSession,
      datetime: new Date(newSession.datetime).toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#14231C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#F4EFE2] w-full max-w-lg p-8 rounded-sm shadow-2xl border-t-4 border-[#D4A62A]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-2xl font-semibold text-[#14231C]">Schedule Live Session</h3>
          <button onClick={onClose} className="p-1 hover:bg-[rgba(20,35,28,0.06)] rounded-full transition-colors"><X className="w-5 h-5 text-[#5C6B5F]" /></button>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Course</label>
            <select value={newSession.courseId} onChange={(e) => setNewSession({...newSession, courseId: e.target.value})} className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]">
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Session Title</label>
            <input value={newSession.title} onChange={(e) => setNewSession({...newSession, title: e.target.value})} placeholder="e.g. Live: Exam technique walkthrough" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Date & Time</label>
              <input type="datetime-local" value={newSession.datetime} onChange={(e) => setNewSession({...newSession, datetime: e.target.value})} className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Platform</label>
              <select value={newSession.platform} onChange={(e) => setNewSession({...newSession, platform: e.target.value as any})} className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]">
                <option>Google Meet</option>
                <option>Zoom</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Meeting Link</label>
            <input value={newSession.zoomLink} onChange={(e) => setNewSession({...newSession, zoomLink: e.target.value})} placeholder="https://..." className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Meeting ID (Optional)</label>
              <input value={newSession.meetingId} onChange={(e) => setNewSession({...newSession, meetingId: e.target.value})} placeholder="123 456 7890" className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Passcode (Optional)</label>
              <input value={newSession.passcode} onChange={(e) => setNewSession({...newSession, passcode: e.target.value})} className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={handleSave} className="flex-1 bg-[#D4A62A] text-[#14231C] py-3 rounded-sm font-bold text-[14px] hover:bg-[#E8C866]">Schedule Session</button>
            <button onClick={onClose} className="flex-1 border border-[rgba(20,35,28,0.14)] text-[#14231C] py-3 rounded-sm font-bold text-[14px] hover:bg-white">Cancel</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
