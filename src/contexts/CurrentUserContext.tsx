import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  mobile: string;
  nationalId: string;
  role: string;
  department: string;
  position: string;
  branch: string;
  supervisor: string;
  hireDate: string;
  salary: number;
  status: string;
  lastLogin: string;
}

interface CurrentUserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const defaultUser: User = {
      id: "1",
      name: "أحمد محمد العتيبي",
      nameEn: "Ahmed Mohammed Al-Otaibi",
      email: "ahmed.otaibi@dagliwa.com",
      phone: "+966112345678",
      mobile: "+966501234567",
      nationalId: "1234567890",
      role: "admin",
      department: "الإدارة العامة",
      position: "مدير عام",
      branch: "الفرع الرئيسي - الرياض",
      supervisor: "",
      hireDate: "2020-01-15",
      salary: 15000,
      status: "active",
      lastLogin: new Date().toLocaleString("ar-SA"),
    };
    setCurrentUser(defaultUser);
  }, []);

  const isAuthenticated = currentUser !== null;

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, isAuthenticated }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return context;
}
