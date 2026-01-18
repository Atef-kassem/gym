import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Shift {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
  isActive: boolean;
  branch?: {
    id: number;
    name: string;
  };
}

interface ShiftSession {
  id: number;
  shiftId: number;
  branchId?: number;
  userId: number;
  sessionDate: string;
  startTime: string;
  endTime?: string;
  expectedStartTime: string;
  expectedEndTime: string;
  openingBalance: number;
  closingBalance?: number;
  expectedClosingBalance?: number;
  cashDifference?: number;
  totalSales?: number;
  totalCash?: number;
  totalCard?: number;
  totalWallet?: number;
  totalTransfer?: number;
  totalDiscount?: number;
  totalTax?: number;
  transactionsCount?: number;
  status: 'open' | 'closed' | 'auto_closed';
  closedBy?: number;
  notes?: string;
  closingNotes?: string;
  shift?: Shift;
  branch?: {
    id: number;
    arabicName: string;
    englishName: string;
  };
  user?: {
    id: number;
    arabicName: string;
    email: string;
  };
}

interface ShiftContextType {
  selectedShift: Shift | null;
  setSelectedShift: (shift: Shift | null) => void;
  clearShift: () => void;
  currentSession: ShiftSession | null;
  setCurrentSession: (session: ShiftSession | null) => void;
  clearSession: () => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

interface ShiftProviderProps {
  children: ReactNode;
}

export const ShiftProvider: React.FC<ShiftProviderProps> = ({ children }) => {
  const [selectedShift, setSelectedShiftState] = useState<Shift | null>(() => {
    // محاولة استرجاع الوردية من localStorage
    const savedShift = localStorage.getItem('selectedShift');
    return savedShift ? JSON.parse(savedShift) : null;
  });

  const [currentSession, setCurrentSessionState] = useState<ShiftSession | null>(() => {
    // محاولة استرجاع جلسة الوردية من localStorage
    const savedSession = localStorage.getItem('currentShiftSession');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const setSelectedShift = (shift: Shift | null) => {
    setSelectedShiftState(shift);
    if (shift) {
      localStorage.setItem('selectedShift', JSON.stringify(shift));
    } else {
      localStorage.removeItem('selectedShift');
    }
  };

  const clearShift = () => {
    setSelectedShiftState(null);
    localStorage.removeItem('selectedShift');
  };

  const setCurrentSession = (session: ShiftSession | null) => {
    setCurrentSessionState(session);
    if (session) {
      localStorage.setItem('currentShiftSession', JSON.stringify(session));
      // تحديث الوردية المختارة أيضاً
      if (session.shift) {
        setSelectedShift(session.shift);
      }
    } else {
      localStorage.removeItem('currentShiftSession');
    }
  };

  const clearSession = () => {
    setCurrentSessionState(null);
    localStorage.removeItem('currentShiftSession');
  };

  return (
    <ShiftContext.Provider value={{ 
      selectedShift, 
      setSelectedShift, 
      clearShift,
      currentSession,
      setCurrentSession,
      clearSession
    }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};

