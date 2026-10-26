export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  bio?: string;
  whatsapp?: string;
}

export interface Lesson {
  title: string;
  content: string;
  link?: string;
  videoId?: string;
  videoName?: string;
  videoSize?: number;
}

export interface Course {
  id: string;
  teacherId: string;
  title: string;
  category: string;
  description: string;
  outcomes?: string[];
  lessons: Lesson[];
  published: boolean;
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  paid: boolean;
}

export interface LiveSession {
  id: string;
  courseId: string;
  teacherId: string;
  title: string;
  datetime: string;
  platform: string;
  zoomLink: string;
  meetingId?: string;
  passcode?: string;
  notes?: string;
}

export interface SessionRequest {
  id: string;
  studentId: string;
  teacherId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  platform?: string;
  zoomLink?: string;
  datetime?: string;
}

export interface AdmissionApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  previousEducation: string;
  message?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface StudentInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentType: 'prospective' | 'current' | 'parent' | 'alumni';
  category: 'Admissions' | 'Tuition & Fees' | 'Online Learning' | 'Programs & Degrees' | 'Internships & Clinical' | 'Campus & Admin Services' | 'General Inquiry';
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  ticketNumber: string;
}

export interface PhhiprosDB {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  liveSessions: LiveSession[];
  sessionRequests: SessionRequest[];
  applications: AdmissionApplication[];
  inquiries?: StudentInquiry[];
}
