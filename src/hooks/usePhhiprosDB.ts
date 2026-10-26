import { useState, useEffect } from 'react';
import { PhhiprosDB, User, Course, Enrollment, LiveSession, SessionRequest, AdmissionApplication, StudentInquiry } from '../types/study-online';

function futureDate(daysOffset: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
}

const INITIAL_INQUIRIES: StudentInquiry[] = [
  {
    id: 'inq-1',
    ticketNumber: 'INQ-78210',
    name: 'Brenda Nsong',
    email: 'brenda.nsong@gmail.com',
    phone: '+237 675 432 109',
    studentType: 'prospective',
    category: 'Admissions',
    subject: 'Entry requirements for HND Nursing with French Baccalaureate',
    message: 'Hello Admissions Office, I obtained my Baccalauréat D last year with honors. I would like to confirm if I need an English proficiency test before enrolling in the HND Nursing program.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'inq-2',
    ticketNumber: 'INQ-43190',
    name: 'Kelvin Tanyi',
    email: 'kelvin.tanyi@yahoo.com',
    phone: '+237 691 223 344',
    studentType: 'prospective',
    category: 'Tuition & Fees',
    subject: 'Installment payment schedule for Software Engineering B.Tech',
    message: 'Good day, could you please send the breakdown of tuition fee installments and accepted payment channels (MTN MoMo or direct bank transfer) for the 2026 academic year?',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString()
  },
  {
    id: 'inq-3',
    ticketNumber: 'INQ-20984',
    name: 'Etonde Prisca',
    email: 'etonde.prisca@student.cm',
    phone: '+237 680 998 877',
    studentType: 'current',
    category: 'Online Learning',
    subject: 'Accessing archived live session recordings on low bandwidth',
    message: 'Is it possible to download audio-only versions of Dr. Fon’s vector mathematics lectures for offline review when network connection is unstable?',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  }
];

const INITIAL_DB: PhhiprosDB = {
  users: [
    { id: 'u1', name: 'Fon Emmanuel', email: 'fon.emmanuel@phhipros237.cm', password: 'demo123', role: 'teacher', bio: 'GCE Further Maths tutor, Buea. 9 years prepping A-Level candidates.', whatsapp: '+237677123456' },
    { id: 'u2', name: 'Ngo Rebecca', email: 'ngo.rebecca@phhipros237.cm', password: 'demo123', role: 'teacher', bio: 'French & Communication coach, Douala. Focus on oral fluency.', whatsapp: '+237699887766' },
    { id: 'u3', name: 'Achu Blessing', email: 'achu.blessing@student.cm', password: 'demo123', role: 'student' },
    { id: 'u4', name: 'Etonde Prisca', email: 'etonde.prisca@student.cm', password: 'demo123', role: 'student' },
    { id: 'admin', name: 'Platform Admin', email: 'admin@phhipros237.cm', password: 'admin123', role: 'admin' }
  ],
  courses: [
    {
      id: 'c1', teacherId: 'u1', title: 'GCE A-Level Further Mathematics', category: 'Mathematics',
      description: 'Full syllabus coverage for GCE A-Level Further Maths: vectors, mechanics, complex numbers, and past-paper drills.',
      outcomes: [
        'Master 3D vector equations and geometric proofs',
        'Solve complex mechanics problems involving impulse and momentum',
        'Apply De Moivre\'s theorem to trigonometric identities',
        'Analyze Argand diagrams for complex number regions'
      ],
      lessons: [
        { title: 'Vectors in 3D — foundations', content: 'Introduces position vectors, direction ratios, and the vector equation of a line, with worked GCE-style examples.', link: '' },
        { title: 'Complex numbers: Argand diagrams', content: "Covers modulus-argument form and De Moivre's theorem with exam technique for Paper 2.", link: '' },
        { title: 'Mechanics: momentum and impulse', content: 'Collision problems, conservation of momentum, and impulse-time graphs.', link: '' }
      ], published: true
    },
    {
      id: 'c2', teacherId: 'u1', title: 'O-Level Mathematics Bootcamp', category: 'Mathematics',
      description: 'Free revision bootcamp covering algebra, mensuration, and statistics for GCE O-Level candidates.',
      outcomes: [
        'Simplify complex algebraic fractions with confidence',
        'Solve quadratic equations using multiple methods',
        'Interpret and construct statistical data visualizations',
        'Translate word problems into mathematical equations'
      ],
      lessons: [
        { title: 'Algebraic fractions and equations', content: 'Simplifying, solving, and word-problem translation.', link: '' }
      ], published: true
    },
    {
      id: 'c3', teacherId: 'u2', title: 'Practical French Communication', category: 'Languages',
      description: 'Conversational French for everyday and workplace situations, with weekly live speaking practice.',
      outcomes: [
        'Navigate market transactions in French fluently',
        'Introduce yourself professionally in a French workplace',
        'Master common Cameroonian-French colloquialisms',
        'Conduct basic business negotiations in French'
      ],
      lessons: [
        { title: 'Greetings and introductions', content: 'Formal vs informal registers, and common Cameroonian-French code-switching patterns.', link: '' },
        { title: 'Ordering and negotiating at the market', content: 'Vocabulary and dialogue practice for market transactions.', link: '' }
      ], published: true
    }
  ],
  enrollments: [
    { studentId: 'u3', courseId: 'c1', paid: true },
    { studentId: 'u3', courseId: 'c2', paid: true },
    { studentId: 'u4', courseId: 'c3', paid: true }
  ],
  liveSessions: [
    { id: 'ls1', courseId: 'c1', teacherId: 'u1', title: 'Live: Complex Numbers Q&A', datetime: futureDate(2), platform: 'Google Meet', zoomLink: 'https://meet.google.com/xyz-mnop-qrs', meetingId: '', passcode: '', notes: 'Bring your Paper 2 past papers.' },
    { id: 'ls2', courseId: 'c3', teacherId: 'u2', title: 'Live: Speaking Practice Circle', datetime: futureDate(-1), platform: 'Zoom', zoomLink: 'https://zoom.us/j/9998887777', meetingId: '999 888 7777', passcode: 'parle', notes: '' }
  ],
  sessionRequests: [
    { id: 'r1', studentId: 'u3', teacherId: 'u1', message: 'Could we go over mechanics past questions one-on-one before the exam?', status: 'accepted', platform: 'Google Meet', zoomLink: 'https://meet.google.com/mno-pqrs-tuv', datetime: futureDate(3) },
    { id: 'r2', studentId: 'u4', teacherId: 'u2', message: 'I would like extra help with verb conjugation.', status: 'pending', platform: '', zoomLink: '', datetime: '' }
  ],
  applications: [],
  inquiries: INITIAL_INQUIRIES
};

export function usePhhiprosDB() {
  const [db, setDb] = useState<PhhiprosDB>(() => {
    const saved = localStorage.getItem('phhipros237_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_DB,
          ...parsed,
          inquiries: parsed.inquiries && parsed.inquiries.length > 0 ? parsed.inquiries : INITIAL_INQUIRIES,
          applications: parsed.applications || []
        };
      } catch (e) {
        return INITIAL_DB;
      }
    }
    return INITIAL_DB;
  });

  useEffect(() => {
    localStorage.setItem('phhipros237_db', JSON.stringify(db));
  }, [db]);

  const addUser = (user: User) => setDb(prev => ({ ...prev, users: [...prev.users, user] }));
  const addCourse = (course: Course) => setDb(prev => ({ ...prev, courses: [...prev.courses, course] }));
  const updateCourse = (id: string, updates: Partial<Course>) => setDb(prev => ({
    ...prev,
    courses: prev.courses.map(c => c.id === id ? { ...c, ...updates } : c)
  }));
  const deleteCourse = (id: string) => setDb(prev => ({
    ...prev,
    courses: prev.courses.filter(c => c.id !== id),
    enrollments: prev.enrollments.filter(e => e.courseId !== id),
    liveSessions: prev.liveSessions.filter(s => s.courseId !== id)
  }));
  const addEnrollment = (e: Enrollment) => setDb(prev => ({ ...prev, enrollments: [...prev.enrollments, e] }));
  const addLiveSession = (s: LiveSession) => setDb(prev => ({ ...prev, liveSessions: [...prev.liveSessions, s] }));
  const deleteLiveSession = (id: string) => setDb(prev => ({ ...prev, liveSessions: prev.liveSessions.filter(s => s.id !== id) }));
  const addSessionRequest = (r: SessionRequest) => setDb(prev => ({ ...prev, sessionRequests: [...prev.sessionRequests, r] }));
  const updateSessionRequest = (id: string, updates: Partial<SessionRequest>) => setDb(prev => ({
    ...prev,
    sessionRequests: prev.sessionRequests.map(r => r.id === id ? { ...r, ...updates } : r)
  }));
  const updateUserPassword = (id: string, newPass: string) => setDb(prev => ({
    ...prev,
    users: prev.users.map(u => u.id === id ? { ...u, password: newPass } : u)
  }));
  const addApplication = (app: AdmissionApplication) => setDb(prev => ({
    ...prev,
    applications: [...(prev.applications || []), app]
  }));
  const updateApplicationStatus = (id: string, status: AdmissionApplication['status']) => setDb(prev => ({
    ...prev,
    applications: prev.applications.map(a => a.id === id ? { ...a, status } : a)
  }));
  const addInquiry = (inquiry: StudentInquiry) => setDb(prev => ({
    ...prev,
    inquiries: [inquiry, ...(prev.inquiries || [])]
  }));
  const updateInquiryStatus = (id: string, status: StudentInquiry['status']) => setDb(prev => ({
    ...prev,
    inquiries: (prev.inquiries || []).map(inq => inq.id === id ? { ...inq, status } : inq)
  }));
  const deleteInquiry = (id: string) => setDb(prev => ({
    ...prev,
    inquiries: (prev.inquiries || []).filter(inq => inq.id !== id)
  }));

  return {
    db,
    addUser,
    addCourse,
    deleteCourse,
    updateCourse,
    addEnrollment,
    addLiveSession,
    deleteLiveSession,
    addSessionRequest,
    updateSessionRequest,
    updateUserPassword,
    addApplication,
    updateApplicationStatus,
    addInquiry,
    updateInquiryStatus,
    deleteInquiry
  };
}
