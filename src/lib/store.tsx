'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  Profile,
  Lead,
  TestAttempt,
  StudentDocument,
  DoubtItem,
  Course,
} from '@/types';
import {
  mockCurrentUser,
  mockCourses,
  mockLeads,
  mockStudentDocuments,
  mockDoubts,
} from './mock-data';

export interface LiveTestSession {
  testId: string;
  testTitle: string;
  startedAt: string;
  isLive: boolean;
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: Profile;
  courses: Course[];
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'leadCode' | 'createdAt' | 'leadScore'>) => void;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;
  documents: StudentDocument[];
  addDocument: (doc: Omit<StudentDocument, 'id' | 'uploadedAt' | 'version'>) => void;
  updateDocStatus: (id: string, status: StudentDocument['status'], note?: string) => void;
  doubts: DoubtItem[];
  addDoubt: (doubt: Omit<DoubtItem, 'id' | 'createdAt' | 'status' | 'studentName'>) => void;
  testAttempts: TestAttempt[];
  recordTestAttempt: (attempt: TestAttempt) => void;
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  studentLoggedIn: boolean;
  setStudentLoggedIn: (val: boolean) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
  registerStudent: (data: { firstName: string; lastName: string; email: string; phone: string; targetExam: string }) => void;
  liveTestSession: LiveTestSession | null;
  startLiveTest: (testId: string, testTitle: string) => void;
  endLiveTest: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<Profile>(mockCurrentUser);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [documents, setDocuments] = useState<StudentDocument[]>(mockStudentDocuments);
  const [doubts, setDoubts] = useState<DoubtItem[]>(mockDoubts);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [studentLoggedIn, setStudentLoggedIn] = useState<boolean>(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [liveTestSession, setLiveTestSession] = useState<LiveTestSession | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setCurrentUser((prev) => ({
      ...prev,
      role: role,
      firstName: role === 'admin' ? 'Admin' : role === 'counsellor' ? 'Elena' : role === 'faculty' ? 'Dr. Sarah' : 'Arham',
      lastName: role === 'admin' ? 'SuperUser' : role === 'counsellor' ? 'Vance' : role === 'faculty' ? 'Jenkins' : 'Farooq',
    }));
    if (role === 'admin') {
      setAdminLoggedIn(true);
    } else if (role === 'student') {
      setStudentLoggedIn(true);
    }
  };

  const startLiveTest = (testId: string, testTitle: string) => {
    setLiveTestSession({
      testId,
      testTitle,
      startedAt: new Date().toISOString(),
      isLive: true,
    });
  };

  const endLiveTest = () => {
    setLiveTestSession(null);
  };

  const registerStudent = (data: { firstName: string; lastName: string; email: string; phone: string; targetExam: string }) => {
    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      role: 'student',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: 'United States',
      targetExam: data.targetExam,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newProfile);
    setStudentLoggedIn(true);
    setRole('student');
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'leadCode' | 'createdAt' | 'leadScore'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `ld-${Date.now()}`,
      leadCode: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      leadScore: 75,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage } : l))
    );
  };

  const addDocument = (docData: Omit<StudentDocument, 'id' | 'uploadedAt' | 'version'>) => {
    const newDoc: StudentDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      version: 1,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const updateDocStatus = (id: string, status: StudentDocument['status'], note?: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              rejectionReason: note || d.rejectionReason,
              reviewedBy: 'Staff Reviewer',
            }
          : d
      )
    );
  };

  const addDoubt = (doubtData: Omit<DoubtItem, 'id' | 'createdAt' | 'status' | 'studentName'>) => {
    const newDoubt: DoubtItem = {
      ...doubtData,
      id: `dbt-${Date.now()}`,
      studentName: `${currentUser.firstName} ${currentUser.lastName}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setDoubts((prev) => [newDoubt, ...prev]);
  };

  const recordTestAttempt = (attempt: TestAttempt) => {
    setTestAttempts((prev) => [attempt, ...prev]);
  };

  const toggleLessonCompletion = (courseId: string, lessonId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) =>
            l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l
          ),
        }));
        return { ...c, modules: updatedModules };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole: handleRoleChange,
        currentUser,
        courses,
        leads,
        addLead,
        updateLeadStage,
        documents,
        addDocument,
        updateDocStatus,
        doubts,
        addDoubt,
        testAttempts,
        recordTestAttempt,
        toggleLessonCompletion,
        studentLoggedIn,
        setStudentLoggedIn,
        adminLoggedIn,
        setAdminLoggedIn,
        registerStudent,
        liveTestSession,
        startLiveTest,
        endLiveTest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
