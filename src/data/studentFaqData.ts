export interface FAQItem {
  id: string;
  category: 'Admissions & Requirements' | 'Tuition & Payment Plans' | 'Study Online & E-Learning' | 'HND & Bachelor Programs' | 'Internships & Clinical' | 'Campus & Admin Services';
  question: string;
  answer: string;
  highlight?: boolean;
  tags: string[];
}

export const STUDENT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Admissions & Requirements',
    highlight: true,
    question: 'What are the minimum entry requirements for HND and Degree programs?',
    answer: 'For Higher National Diploma (HND) programs, candidates must possess at least 2 papers in the Cameroon GCE Advanced Level (excluding Religious Studies) or a recognized Baccalauréat (A, C, D, TI, or F). For professional Bachelor\'s top-up degrees, applicants must hold a valid HND, BTS, or an equivalent 2-year university diploma in a related discipline.',
    tags: ['GCE A-Level', 'Baccalauréat', 'HND Entry', 'Top-up Degree']
  },
  {
    id: 'faq-2',
    category: 'Admissions & Requirements',
    question: 'Can candidates with French-system Baccalauréat enroll in English-medium programs?',
    answer: 'Yes! PHHIPROS is a fully bilingual institution. Students from Francophone backgrounds with Baccalauréat are warmly welcomed and can attend bilingual transition workshops and intensive English language foundation courses in their first semester.',
    tags: ['Bilingual', 'Francophone', 'Baccalauréat', 'English Support']
  },
  {
    id: 'faq-3',
    category: 'Admissions & Requirements',
    question: 'What supporting documents are required to complete the admission file?',
    answer: 'Your admission dossier must include: certified copies of your GCE O-Level and A-Level slips (or Baccalauréat certificate & transcript), a certified copy of your birth certificate, 4 passport-size photographs (4x4), a medical fitness certificate, and proof of application fee payment.',
    tags: ['Application Documents', 'Admission Dossier', 'Certificates']
  },
  {
    id: 'faq-4',
    category: 'Tuition & Payment Plans',
    highlight: true,
    question: 'Can tuition fees be paid in flexible installments?',
    answer: 'Yes. PHHIPROS provides a 3-installment payment plan designed to ease financial planning for students and guardians. An initial deposit is paid upon registration (typically 40%), followed by the second installment before First Semester examinations (30%), and the final balance before Second Semester finals (30%).',
    tags: ['Installments', 'Tuition Fees', 'Payment Schedule', 'Flexibility']
  },
  {
    id: 'faq-5',
    category: 'Tuition & Payment Plans',
    question: 'Which payment methods are accepted for school fees and registration?',
    answer: 'We accept secure payments through official university bank accounts (Ecobank, Afriland First Bank, UBA), as well as verified MTN Mobile Money and Orange Money institutional merchant codes. Receipts must be uploaded or presented to the Finance Office for validation.',
    tags: ['Bank Transfer', 'MTN MoMo', 'Orange Money', 'Finance Office']
  },
  {
    id: 'faq-6',
    category: 'Tuition & Payment Plans',
    question: 'Are there scholarship opportunities or academic discount schemes available?',
    answer: 'Merit-based scholarships are awarded to students who achieve exceptional GPA standing in their level exams. In addition, we offer early-bird enrollment fee rebates and sibling discounts for families with multiple students enrolled at PHHIPROS.',
    tags: ['Scholarships', 'Discounts', 'Merit Award', 'Financial Aid']
  },
  {
    id: 'faq-7',
    category: 'Study Online & E-Learning',
    highlight: true,
    question: 'How does the Study Online platform work for remote students?',
    answer: 'The PHHIPROS Study Online portal allows students to attend scheduled live interactive classes via Google Meet / Zoom, access downloadable lecture notes and past exam papers, submit assignments, and request one-on-one tutorial sessions with lecturers.',
    tags: ['E-Learning', 'Google Meet', 'Live Sessions', 'Remote Study']
  },
  {
    id: 'faq-8',
    category: 'Study Online & E-Learning',
    question: 'Can I access course materials offline or with low internet bandwidth?',
    answer: 'Yes! All lecture slides, PDF study guides, and lesson summaries are compressed for lightweight downloading. Video lectures also offer audio-only summaries and downloadable transcripts to ensure seamless learning even during periods of slow internet.',
    tags: ['Low Bandwidth', 'Offline Materials', 'Audio Lectures', 'Mobile Access']
  },
  {
    id: 'faq-9',
    category: 'Study Online & E-Learning',
    question: 'How are online exams and continuous assessments (CA) administered?',
    answer: 'Continuous assessments, timed quizzes, and project submissions are completed directly through the student portal. Supervised final semester exams can be written either at designated regional exam centers or on campus under university proctoring standards.',
    tags: ['Online Exams', 'Assessments', 'Continuous Assessment', 'Proctoring']
  },
  {
    id: 'faq-10',
    category: 'HND & Bachelor Programs',
    question: 'Are PHHIPROS diplomas recognized by the Ministry of Higher Education (MINESUP)?',
    answer: 'Yes. All Higher National Diploma (HND) certifications are authorized and supervised by the Cameroon Ministry of Higher Education (MINESUP). Our Bachelor of Technology (B.Tech) and Master degrees are awarded in academic mentorship with accredited state universities.',
    tags: ['Accreditation', 'MINESUP', 'State University', 'Official Diploma']
  },
  {
    id: 'faq-11',
    category: 'HND & Bachelor Programs',
    question: 'What is the duration of the HND and Bachelor’s degree programs?',
    answer: 'The HND is a 2-year intensive professional program (4 semesters) including mandatory industry internship. A Bachelor’s degree is a 1-year top-up program following successful completion of an HND or BTS.',
    tags: ['Program Duration', 'HND 2 Years', 'Bachelor Top-Up']
  },
  {
    id: 'faq-12',
    category: 'Internships & Clinical',
    highlight: true,
    question: 'Does the institute organize internships and clinical placements for medical students?',
    answer: 'Yes. PHHIPROS has formal partnership agreements with regional reference hospitals, district healthcare centers, corporate firms, and IT hubs across Cameroon. Our Internship Placement Office actively coordinates hospital rotations for Nursing and Medical Lab students and ensures supervisory evaluations.',
    tags: ['Hospital Rotations', 'Nursing Placement', 'Internships', 'Clinical Training']
  },
  {
    id: 'faq-13',
    category: 'Campus & Admin Services',
    question: 'How do I request an official academic transcript or recommendation letter?',
    answer: 'Students and alumni can submit a transcript request through our Student Inquiries desk or directly via the Registrar’s Office. Standard academic transcripts are processed within 3 to 5 business days after validation of academic records.',
    tags: ['Academic Transcripts', 'Recommendation Letter', 'Registrar Office']
  },
  {
    id: 'faq-14',
    category: 'Campus & Admin Services',
    question: 'Is student hostel accommodation available near the campus?',
    answer: 'While PHHIPROS does not operate on-campus dormitories, our Student Welfare Department maintains a verified list of safe, accredited private student hostels and residences within a 5-10 minute walking distance of the campus.',
    tags: ['Accommodation', 'Hostels', 'Housing', 'Student Welfare']
  }
];

export const FAQ_CATEGORIES = [
  'All',
  'Admissions & Requirements',
  'Tuition & Payment Plans',
  'Study Online & E-Learning',
  'HND & Bachelor Programs',
  'Internships & Clinical',
  'Campus & Admin Services'
] as const;
