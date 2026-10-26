import React, { useEffect } from 'react';
import { PhhiprosAuthProvider, usePhhiprosAuth } from '../../contexts/PhhiprosAuthContext';
import { usePhhiprosDB } from '../../hooks/usePhhiprosDB';
import { Landing } from './Landing';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentDashboard } from './StudentDashboard';
import { AdminDashboard } from './AdminDashboard';
import { useLocation } from 'react-router-dom';

function StudyOnlineContent() {
  const { userId } = usePhhiprosAuth();
  const { db } = usePhhiprosDB();
  const location = useLocation();

  const user = db.users.find(u => u.id === userId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!user) {
    return <Landing />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard user={user} />;
  }

  if (user.role === 'student') {
    return <StudentDashboard user={user} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} />;
  }

  return <Landing />;
}

export function StudyOnline() {
  return (
    <PhhiprosAuthProvider>
      <div className="pt-20 min-h-screen bg-[#EAE3D2] font-sans selection:bg-[#D4A62A] selection:text-[#14231C]">
        <StudyOnlineContent />
      </div>
    </PhhiprosAuthProvider>
  );
}
