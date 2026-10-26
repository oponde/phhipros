import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/study-online';

interface PhhiprosAuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const PhhiprosAuthContext = createContext<PhhiprosAuthContextType | undefined>(undefined);

export function PhhiprosAuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <PhhiprosAuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </PhhiprosAuthContext.Provider>
  );
}

export function usePhhiprosAuth() {
  const context = useContext(PhhiprosAuthContext);
  if (context === undefined) {
    throw new Error('usePhhiprosAuth must be used within a PhhiprosAuthProvider');
  }
  return context;
}
