import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, ExternalLink, Calendar, MessageSquare, X, Sparkles, Cpu, Send, Bot, CheckCircle2, HelpCircle, BookOpen, Trash2, RefreshCw } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { usePhhiprosDB } from '../../hooks/usePhhiprosDB';
import { User, Course, Lesson } from '../../types/study-online';
import { fmtDate, sessionStatus, waLink, loadVideoBlob, fmtSize } from './utils';

interface StudentDashboardProps {
  user: User;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const { db, addEnrollment, addSessionRequest } = usePhhiprosDB();
  const [activeTab, setActiveTab] = useState('browse');
  const [category, setCategory] = useState('All');

  const navItems = [
    { key: 'browse', label: 'Browse courses' },
    { key: 'mine', label: 'My courses' },
    { key: 'live', label: 'Live classes' },
    { key: 'oneone', label: 'Reach a teacher' },
  ];

  const enrolledCourseIds = db.enrollments.filter(e => e.studentId === user.id).map(e => e.courseId);

  return (
    <div className="flex min-h-screen bg-[#F4EFE2]">
      <Sidebar user={user} items={navItems} activeKey={activeTab} onSelect={setActiveTab} />
      
      <main className="flex-1 p-8 lg:p-12 max-w-6xl">
        {activeTab === 'browse' && <BrowseCourses db={db} user={user} enrolledIds={enrolledCourseIds} category={category} setCategory={setCategory} onEnroll={addEnrollment} />}
        {activeTab === 'mine' && <MyCourses db={db} user={user} />}
        {activeTab === 'live' && <LiveClasses db={db} user={user} enrolledIds={enrolledCourseIds} />}
        {activeTab === 'oneone' && <ReachTeacher db={db} user={user} onSend={addSessionRequest} />}
      </main>
    </div>
  );
}

function BrowseCourses({ db, user, enrolledIds, category, setCategory, onEnroll }: any) {
  const categories = ['All', ...new Set(db.courses.map((c: any) => c.category))];
  const list = db.courses.filter((c: any) => c.published && (category === 'All' || c.category === category));
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  const handleEnroll = (course: Course) => {
    onEnroll({ studentId: user.id, courseId: course.id, paid: true });
    setPreviewCourse(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Browse courses</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Taught live and self-paced by teachers across the platform</div>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]">
          {categories.map((c: any) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c: any) => {
          const teacher = db.users.find((u: any) => u.id === c.teacherId);
          const already = enrolledIds.includes(c.id);
          return (
            <div 
              key={c.id} 
              onClick={() => setPreviewCourse(c)}
              className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-5 hover:shadow-lg transition-all cursor-pointer group"
            >
              <span className="inline-block text-[10.5px] font-bold px-2 py-0.5 bg-[rgba(212,166,42,0.16)] text-[#8a6a10] rounded-sm mb-3 uppercase tracking-wider">{c.category}</span>
              <h3 className="font-serif text-lg font-semibold text-[#14231C] mb-2 group-hover:text-[#D4A62A] transition-colors">{c.title}</h3>
              <p className="text-[13.5px] text-[#5C6B5F] line-clamp-3 mb-3 leading-relaxed">{c.description}</p>
              <div className="text-[12.5px] text-[#5C6B5F] mb-4">by {teacher?.name}</div>
              
              <div className="flex justify-between items-center pt-4 border-t border-[rgba(20,35,28,0.06)]">
                <span className="text-[11px] font-bold text-[#14231C]/40 uppercase tracking-widest">Click to preview</span>
                {already ? (
                  <span className="text-[11px] font-bold px-2 py-1 bg-[rgba(20,35,28,0.08)] text-[#5C6B5F] rounded-sm">ENROLLED</span>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEnroll(c); }} 
                    className="bg-[#14231C] text-[#F5F1E6] px-4 py-2 rounded-sm font-bold text-[13px] hover:bg-[#1D2E24]"
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {previewCourse && (
          <PreviewModal 
            course={previewCourse} 
            teacher={db.users.find((u: any) => u.id === previewCourse.teacherId)}
            isEnrolled={enrolledIds.includes(previewCourse.id)}
            onClose={() => setPreviewCourse(null)}
            onEnroll={() => handleEnroll(previewCourse)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PreviewModal({ course, teacher, isEnrolled, onClose, onEnroll }: any) {
  return (
    <div className="fixed inset-0 bg-[#14231C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#F4EFE2] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-sm shadow-2xl border-t-4 border-[#D4A62A] flex flex-col"
      >
        <div className="p-6 border-b border-[rgba(20,35,28,0.14)] flex justify-between items-start bg-white">
          <div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-[rgba(212,166,42,0.16)] text-[#8a6a10] rounded-sm mb-2 uppercase tracking-wider">{course.category}</span>
            <h3 className="font-serif text-2xl font-semibold text-[#14231C]">{course.title}</h3>
            <div className="text-[13px] text-[#5C6B5F] mt-1">with <span className="font-bold">{teacher?.name}</span></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[rgba(20,35,28,0.06)] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#5C6B5F]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-[#14231C] uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D4A62A]" /> About this course
            </h4>
            <div className="prose prose-sm max-w-none text-[#5C6B5F] leading-relaxed">
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[12px] font-bold text-[#14231C] uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" /> What you will learn
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(course.outcomes && course.outcomes.length > 0) ? course.outcomes.map((o: string, i: number) => (
                <div key={i} className="flex gap-3 items-start bg-white p-3 rounded-sm border border-[rgba(20,35,28,0.06)] shadow-sm">
                  <div className="mt-1 w-4 h-4 bg-[rgba(212,166,42,0.2)] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-[#D4A62A] rounded-full"></div>
                  </div>
                  <span className="text-[13.5px] text-[#14231C] leading-tight">{o}</span>
                </div>
              )) : (
                <div className="col-span-2 text-[13.5px] text-[#5C6B5F] italic">No specific outcomes listed, but look at the curriculum below!</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[12px] font-bold text-[#14231C] uppercase tracking-widest flex items-center gap-2">
              <Play className="w-4 h-4 text-[#D4A62A]" /> Curriculum ({course.lessons.length} lessons)
            </h4>
            <div className="space-y-2">
              {course.lessons.map((l: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/50 border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm">
                  <span className="font-serif font-bold text-[#D4A62A] text-sm w-5">{i + 1}</span>
                  <span className="text-[13.5px] text-[#14231C] font-medium">{l.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[rgba(20,35,28,0.14)] bg-white flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 text-[13px] text-[#5C6B5F]">
            {isEnrolled ? 'You are already enrolled in this course.' : 'Enroll now to get instant access to all lessons and AI features.'}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:px-6 py-3 border border-[rgba(20,35,28,0.14)] text-[#14231C] font-bold text-[14px] rounded-sm hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {!isEnrolled && (
              <button 
                onClick={onEnroll}
                className="flex-1 sm:px-8 py-3 bg-[#14231C] text-[#F5F1E6] font-bold text-[14px] rounded-sm hover:bg-[#D4A62A] hover:text-[#14231C] transition-all shadow-lg"
              >
                Enroll Today
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MyCourses({ db, user }: any) {
  const enrolled = db.enrollments.filter((e: any) => e.studentId === user.id).map((e: any) => db.courses.find((c: any) => c.id === e.courseId)).filter(Boolean);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(enrolled[0]?.id || null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">My courses</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">{enrolled.length} course{enrolled.length !== 1 ? 's' : ''} enrolled</div>
        </div>
      </div>

      {enrolled.length === 0 ? (
        <div className="p-12 text-center text-[#5C6B5F] border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm text-[14.5px] bg-white/50">
          You haven't enrolled in any courses yet. Explore the marketplace to start learning.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {enrolled.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`px-4 py-2 rounded-sm text-[13px] font-bold transition-all border ${
                  selectedCourseId === c.id
                    ? 'bg-[#14231C] text-[#F5F1E6] border-[#14231C]'
                    : 'bg-white text-[#5C6B5F] border-[rgba(20,35,28,0.14)] hover:bg-[rgba(20,35,28,0.05)]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {enrolled.map((c: any) => {
            if (selectedCourseId !== c.id) return null;
            return (
              <div key={c.id} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm overflow-hidden">
                <CourseViewer db={db} course={c} />
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function CourseViewer({ db, course }: { db: any, course: Course }) {
  const [activeTab, setActiveTab] = useState('lessons');
  const teacher = db.users.find((u: any) => u.id === course.teacherId);

  const tabs = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'ai-search', label: 'AI Search', icon: Sparkles },
    { id: 'ai-quiz', label: 'AI Questionnaire (15)', icon: Cpu },
  ];

  return (
    <div>
      <div className="p-6 bg-[rgba(20,35,28,0.02)] border-b border-[rgba(20,35,28,0.14)]">
        <span className="inline-block text-[10.5px] font-bold px-2 py-0.5 bg-[rgba(212,166,42,0.16)] text-[#8a6a10] rounded-sm mb-2 uppercase tracking-wider">{course.category}</span>
        <h3 className="font-serif text-2xl font-semibold text-[#14231C] mb-1">{course.title}</h3>
        <div className="text-[13px] text-[#5C6B5F]">Taught by {teacher?.name}</div>
      </div>

      <div className="flex border-b border-[rgba(20,35,28,0.14)] bg-white overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[13.5px] font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#D4A62A] text-[#14231C] bg-[rgba(212,166,42,0.05)]'
                : 'border-transparent text-[#5C6B5F] hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            {course.lessons.length === 0 ? (
              <div className="text-[13.5px] text-[#5C6B5F] italic py-8 text-center">No lessons uploaded yet.</div>
            ) : (
              course.lessons.map((l: any, i: number) => (
                <LessonRow key={i} lesson={l} index={i} />
              ))
            )}
          </div>
        )}

        {activeTab === 'ai-search' && <AIChat course={course} />}
        {activeTab === 'ai-quiz' && <AIQuestionnaire course={course} />}
      </div>
    </div>
  );
}

function AIChat({ course }: { course: Course }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    `Summarize the key takeaways from ${course.title}`,
    "What are the most important concepts in this course?",
    "Explain how this subject applies to professional work.",
    "Can you give me a study plan based on the lessons?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const context = `Course: ${course.title}\nDescription: ${course.description}\n\nLessons:\n${course.lessons.map((l, i) => `${i+1}. ${l.title}: ${l.content}`).join('\n')}`;

  const handleSend = async (text: string = input) => {
    const userMsg = text.trim();
    if (!userMsg || isTyping) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMsg, 
          context,
          history: messages.slice(-10) // Send last 5 exchanges
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.text || 'Sorry, I encountered an error.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Could not connect to the AI service.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[650px] border border-[rgba(20,35,28,0.14)] rounded-sm bg-[#F9F7F0] shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-[rgba(20,35,28,0.14)] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[rgba(212,166,42,0.16)] rounded-sm relative">
            <Sparkles className="w-5 h-5 text-[#8a6a10]" />
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"
              title="Grounding active"
            />
          </div>
          <div>
            <div className="font-bold text-[#14231C] text-[15px] flex items-center gap-2">
              Dynamic Academic Tutor
              <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold border border-green-200">RELIABLE</span>
            </div>
            <div className="text-[11px] text-[#5C6B5F] uppercase tracking-widest font-bold flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5" /> Analyzing {course.lessons.length} Lessons
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={clearChat}
            className="p-2 text-[#5C6B5F] hover:text-red-600 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
            <div className="bg-white p-6 rounded-full shadow-lg border-t-4 border-[#D4A62A]">
              <Bot className="w-16 h-16 text-[#D4A62A]" />
            </div>
            <div className="space-y-3">
              <div className="text-[22px] font-serif font-bold text-[#14231C]">Academic Study Assistant</div>
              <div className="text-[15px] text-[#5C6B5F] max-w-sm mx-auto leading-relaxed italic">
                I've analyzed your course materials. Ask me anything to deepen your understanding.
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-left px-4 py-2 text-[13px] bg-white border border-[rgba(20,35,28,0.14)] rounded-full hover:border-[#D4A62A] hover:bg-[rgba(212,166,42,0.05)] transition-all text-[#14231C] font-medium shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                msg.role === 'user' ? 'bg-[#D4A62A] text-[#14231C]' : 'bg-[#14231C] text-[#F5F1E6]'
              }`}>
                {msg.role === 'user' ? 'ME' : 'AI'}
              </div>
              <div className={`p-4 rounded-xl text-[14.5px] leading-relaxed shadow-md ${
                msg.role === 'user' 
                  ? 'bg-[#14231C] text-[#F5F1E6] rounded-tr-none' 
                  : 'bg-white border border-[rgba(20,35,28,0.14)] text-[#14231C] rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-[#14231C] text-[#F5F1E6] text-xs font-bold shadow-md">
                AI
              </div>
              <div className="bg-white border border-[rgba(20,35,28,0.14)] p-4 rounded-xl rounded-tl-none text-[13px] flex flex-col gap-2 shadow-md">
                <div className="flex items-center gap-2 text-[#D4A62A] font-bold uppercase tracking-widest text-[10px]">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Synthesizing Course Content...
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-[#D4A62A] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#D4A62A] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#D4A62A] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-[rgba(20,35,28,0.14)]">
        <div className="flex gap-2 bg-[#F9F7F0] p-1.5 rounded-sm border border-[rgba(20,35,28,0.14)] focus-within:border-[#D4A62A] transition-colors shadow-inner">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 p-3 bg-transparent text-[14.5px] outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-[#14231C] text-[#F5F1E6] px-6 py-2 rounded-sm hover:bg-[#1D2E24] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-[#5C6B5F] uppercase tracking-tighter opacity-60">
          <span className="flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> AUTHORITATIVE COURSE GROUNDING</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> FACT-CHECKED AGAINST LESSONS</span>
          <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5" /> POWERED BY GEMINI 3.6</span>
        </div>
      </div>
    </div>
  );
}

function AIQuestionnaire({ course }: { course: Course }) {
  const [questions, setQuestions] = useState<{ question: string, answer: string, showAnswer?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const context = `Course: ${course.title}\n\nLessons:\n${course.lessons.map((l, i) => `${i+1}. ${l.title}: ${l.content}`).join('\n')}`;

  const generate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      alert('Error generating questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = (index: number) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, showAnswer: !q.showAnswer } : q));
  };

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white border border-[rgba(20,35,28,0.14)] rounded-sm">
        <Cpu className="w-12 h-12 text-[#D4A62A] mx-auto mb-4" />
        <h4 className="font-serif text-xl font-semibold text-[#14231C] mb-2">Knowledge Check</h4>
        <p className="text-[14px] text-[#5C6B5F] max-w-sm mx-auto mb-8 leading-relaxed">
          Let the AI analyze your course lessons and generate 15 challenging questions to test your understanding.
        </p>
        <button
          onClick={generate}
          disabled={isLoading}
          className="bg-[#D4A62A] text-[#14231C] px-8 py-3 rounded-sm font-bold text-[14px] hover:bg-[#E8C866] transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#14231C]/20 border-t-[#14231C] rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            'Generate 15 Questions'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-[#14231C] uppercase tracking-widest text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#D4A62A]" /> Assessment generated
        </h4>
        <button onClick={generate} className="text-[12px] font-bold text-[#5C6B5F] hover:text-[#14231C] underline">Regenerate</button>
      </div>
      
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm overflow-hidden shadow-sm">
            <div className="p-5 flex gap-4">
              <div className="font-serif text-[#D4A62A] font-bold text-lg leading-none">{i + 1}</div>
              <div className="flex-1">
                <p className="text-[15px] font-medium text-[#14231C] leading-relaxed mb-4">{q.question}</p>
                <button
                  onClick={() => toggleAnswer(i)}
                  className="flex items-center gap-2 text-[12.5px] font-bold text-[#D4A62A] hover:text-[#14231C] transition-colors"
                >
                  {q.showAnswer ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                  {q.showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                
                <AnimatePresence>
                  {q.showAnswer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-[rgba(20,35,28,0.03)] border-l-4 border-[#14231C] text-[14px] text-[#5C6B5F] leading-relaxed">
                        <div className="font-bold text-[#14231C] mb-1">Correct Answer:</div>
                        {q.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonRow({ lesson, index }: { lesson: Lesson, index: number }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    if (!lesson.videoId) return;
    setIsLoading(true);
    try {
      const blob = await loadVideoBlob(lesson.videoId);
      if (blob) {
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        alert('Video file not found in local storage.');
      }
    } catch (e) {
      alert('Could not load video.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 p-4 border-b border-[rgba(20,35,28,0.06)] last:border-0 items-start">
      <div className="font-serif text-[#D4A62A] font-bold text-lg leading-none">{index + 1}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#14231C] text-[15px]">{lesson.title}</div>
        <div className="text-[13.5px] text-[#5C6B5F] mt-1 leading-relaxed">{lesson.content}</div>
        
        <div className="flex flex-wrap gap-4 mt-3">
          {lesson.link && (
            <a href={lesson.link} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#14231C] hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> Resource link
            </a>
          )}
          {lesson.videoId && !videoUrl && (
            <button 
              onClick={handlePlay}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#14231C] hover:underline disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> {isLoading ? 'Loading video...' : `Play Video (${fmtSize(lesson.videoSize || 0)})`}
            </button>
          )}
        </div>

        {videoUrl && (
          <div className="mt-4 bg-black aspect-video rounded-sm overflow-hidden">
            <video src={videoUrl} controls className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
}

function LiveClasses({ db, user, enrolledIds }: any) {
  const sessions = db.liveSessions.filter((s: any) => enrolledIds.includes(s.courseId)).sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Live classes</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Join your teacher directly over Zoom when it's time</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center text-[#5C6B5F] border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm text-[14.5px] bg-white/50">
          No live sessions scheduled for your courses right now.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => {
            const status = sessionStatus(s.datetime);
            const course = db.courses.find((c: any) => c.id === s.courseId);
            const teacher = db.users.find((u: any) => u.id === s.teacherId);
            return (
              <div key={s.id} className={`bg-white border border-[rgba(20,35,28,0.14)] border-l-4 ${status === 'live' ? 'border-l-[#B23A2E]' : 'border-l-[#D4A62A]'} p-5 flex flex-col md:flex-row md:justify-between md:items-center rounded-sm gap-4`}>
                <div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 ${status === 'live' ? 'bg-[#B23A2E]/10 text-[#B23A2E]' : 'bg-[rgba(212,166,42,0.16)] text-[#8a6a10]'} rounded-sm mb-2 uppercase tracking-widest`}>
                    {status === 'live' ? 'LIVE NOW' : status.toUpperCase()}
                  </span>
                  <div className="font-serif text-lg font-semibold text-[#14231C]">{s.title}</div>
                  <div className="text-[13px] text-[#5C6B5F]">{course?.title} · <span className="font-bold">{teacher?.name}</span> · {fmtDate(s.datetime)}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {status !== 'ended' ? (
                    <a href={s.zoomLink} target="_blank" rel="noopener" className={`px-4 py-2 rounded-sm font-bold text-[13px] ${s.platform === 'Zoom' ? 'bg-[#D4A62A] text-[#14231C]' : 'bg-[#1A73E8] text-white'}`}>
                      Join via {s.platform}
                    </a>
                  ) : (
                    <span className="text-[12.5px] text-[#5C6B5F] font-bold">Session ended</span>
                  )}
                  {teacher?.whatsapp && (
                    <a href={waLink(teacher.whatsapp, `Hi ${teacher.name}, about the live class: ${s.title}.`)} target="_blank" rel="noopener" className="bg-[#25D366] text-[#0b2e17] px-4 py-2 rounded-sm font-bold text-[13px]">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function ReachTeacher({ db, user, onSend }: any) {
  const teachers = db.users.filter((u: any) => u.role === 'teacher');
  const myReqs = db.sessionRequests.filter((r: any) => r.studentId === user.id);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message) {
      alert('Please write a message.');
      return;
    }
    onSend({
      id: 'r' + Math.random().toString(36).slice(2, 9),
      studentId: user.id,
      teacherId: selectedTeacherId,
      message,
      status: 'pending'
    });
    setMessage('');
    alert('Request sent to teacher!');
  };

  const selectedTeacher = teachers.find((t: any) => t.id === selectedTeacherId);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-8 border-b border-[rgba(20,35,28,0.14)] pb-5">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#14231C]">Reach a teacher directly</h2>
          <div className="text-[13.5px] text-[#5C6B5F] mt-1">Request a 1:1 Zoom session outside of class time</div>
        </div>
      </div>

      <div className="bg-white border border-[rgba(20,35,28,0.14)] rounded-sm p-8 max-w-lg mb-10">
        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">Teacher</label>
            <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px]">
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name} — {t.bio}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5C6B5F] uppercase tracking-widest">What do you need help with?</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Be specific — it helps your teacher prepare." className="w-full p-3 border border-[rgba(20,35,28,0.14)] rounded-sm bg-white text-[14px] min-h-[100px]" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleSend} className="bg-[#D4A62A] text-[#14231C] px-5 py-3 rounded-sm font-bold text-[14px] hover:bg-[#E8C866] transition-colors">Send request</button>
            {selectedTeacher?.whatsapp && (
              <a href={waLink(selectedTeacher.whatsapp, message || `Hi ${selectedTeacher.name}, I have a question.`)} target="_blank" rel="noopener" className="bg-[#25D366] text-[#0b2e17] px-5 py-3 rounded-sm font-bold text-[14px] flex items-center justify-center gap-2">
                Message on WhatsApp
              </a>
            )}
          </div>
          <div className="text-[12px] text-[#5C6B5F] italic">Use the request form for a scheduled Zoom session, or WhatsApp for a quick question.</div>
        </div>
      </div>

      <h3 className="font-bold text-[#14231C] uppercase tracking-widest text-xs mb-6">Your requests</h3>
      <div className="space-y-3">
        {myReqs.length === 0 ? (
          <div className="p-10 text-center text-[#5C6B5F] border border-dashed border-[rgba(20,35,28,0.14)] rounded-sm text-[14px]">No requests sent yet.</div>
        ) : (
          myReqs.map((r: any) => {
            const t = teachers.find((te: any) => te.id === r.teacherId);
            return (
              <div key={r.id} className="bg-white border border-[rgba(20,35,28,0.14)] p-5 rounded-sm flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${
                    r.status === 'pending' ? 'bg-[#D4A62A]/15 text-[#8a6a10]' :
                    r.status === 'accepted' ? 'bg-[#2f6b47]/10 text-[#2f6b47]' :
                    'bg-[#B23A2E]/10 text-[#B23A2E]'
                  }`}>{r.status}</span>
                  <div className="font-bold text-[#14231C] mt-2">To {t?.name}</div>
                  <div className="text-[13.5px] text-[#5C6B5F] mt-1 italic">"{r.message}"</div>
                </div>
                {r.status === 'accepted' && (
                  <div className="bg-[#14231C] text-[#F5F1E6] p-4 rounded-sm self-start md:self-center">
                    <div className="text-[13px] mb-1">Scheduled for <span className="font-bold text-[#E8C866]">{fmtDate(r.datetime)}</span></div>
                    <a href={r.zoomLink} target="_blank" rel="noopener" className="text-[#E8C866] underline font-bold text-[13px]">{r.zoomLink}</a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

