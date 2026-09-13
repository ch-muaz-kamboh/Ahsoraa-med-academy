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
  ScheduleItem,
  RecordedLecture,
  LibraryResource,
  StudentMistake,
} from '@/types';
import {
  mockCurrentUser,
  mockCourses,
  mockLeads,
  mockStudentDocuments,
  mockDoubts,
  mockSchedules,
  mockRecordedLectures,
  mockLibraryResources,
  mockStudentMistakes,
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
  loginStudent: (email: string) => void;
  logoutStudent: () => void;
  liveTestSession: LiveTestSession | null;
  startLiveTest: (testId: string, testTitle: string) => void;
  endLiveTest: () => void;

  // Schedule Management
  schedules: ScheduleItem[];
  addSchedule: (item: Omit<ScheduleItem, 'id' | 'createdAt'>) => void;
  updateSchedule: (id: string, item: Partial<ScheduleItem>) => void;
  deleteSchedule: (id: string) => void;

  // Recorded Lectures Management
  recordedLectures: RecordedLecture[];
  addLecture: (item: Omit<RecordedLecture, 'id' | 'createdAt'>) => void;
  updateLecture: (id: string, item: Partial<RecordedLecture>) => void;
  deleteLecture: (id: string) => void;

  // Library Management
  libraryResources: LibraryResource[];
  addLibraryResource: (item: Omit<LibraryResource, 'id' | 'uploadedAt'>) => void;
  updateLibraryResource: (id: string, item: Partial<LibraryResource>) => void;
  deleteLibraryResource: (id: string) => void;

  // Student Mistakes
  studentMistakes: StudentMistake[];
  addMistake: (item: Omit<StudentMistake, 'id' | 'failedAt' | 'isResolved'>) => void;
  toggleMistakeResolved: (id: string) => void;
  deleteMistake: (id: string) => void;
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

  // New features state with localStorage persistence
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahsora_schedules');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return mockSchedules;
  });

  const [recordedLectures, setRecordedLectures] = useState<RecordedLecture[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahsora_lectures');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return mockRecordedLectures;
  });

  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahsora_library');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return mockLibraryResources;
  });

  const [studentMistakes, setStudentMistakes] = useState<StudentMistake[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahsora_mistakes');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return mockStudentMistakes;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_schedules', JSON.stringify(schedules));
    }
  }, [schedules]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_lectures', JSON.stringify(recordedLectures));
    }
  }, [recordedLectures]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_library', JSON.stringify(libraryResources));
    }
  }, [libraryResources]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_mistakes', JSON.stringify(studentMistakes));
    }
  }, [studentMistakes]);

  const addSchedule = (item: Omit<ScheduleItem, 'id' | 'createdAt'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSchedules((prev) => [newItem, ...prev]);
  };

  const updateSchedule = (id: string, item: Partial<ScheduleItem>) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s)));
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const addLecture = (item: Omit<RecordedLecture, 'id' | 'createdAt'>) => {
    const newItem: RecordedLecture = {
      ...item,
      id: `lec-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRecordedLectures((prev) => [newItem, ...prev]);
  };

  const updateLecture = (id: string, item: Partial<RecordedLecture>) => {
    setRecordedLectures((prev) => prev.map((l) => (l.id === id ? { ...l, ...item } : l)));
  };

  const deleteLecture = (id: string) => {
    setRecordedLectures((prev) => prev.filter((l) => l.id !== id));
  };

  const addLibraryResource = (item: Omit<LibraryResource, 'id' | 'uploadedAt'>) => {
    const newItem: LibraryResource = {
      ...item,
      id: `lib-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setLibraryResources((prev) => [newItem, ...prev]);
  };

  const updateLibraryResource = (id: string, item: Partial<LibraryResource>) => {
    setLibraryResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...item } : r)));
  };

  const deleteLibraryResource = (id: string) => {
    setLibraryResources((prev) => prev.filter((r) => r.id !== id));
  };

  const addMistake = (item: Omit<StudentMistake, 'id' | 'failedAt' | 'isResolved'>) => {
    const newItem: StudentMistake = {
      ...item,
      id: `mst-${Date.now()}`,
      failedAt: new Date().toISOString(),
      isResolved: false,
    };
    setStudentMistakes((prev) => [newItem, ...prev]);
  };

  const toggleMistakeResolved = (id: string) => {
    setStudentMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isResolved: !m.isResolved } : m))
    );
  };

  const deleteMistake = (id: string) => {
    setStudentMistakes((prev) => prev.filter((m) => m.id !== id));
  };

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

  const loginStudent = (email: string) => {
    const username = email.split('@')[0] || 'student';
    const parts = username.split(/[._-]/);
    const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Student';
    const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';

    setCurrentUser({
      id: `usr-${Date.now()}`,
      role: 'student',
      firstName,
      lastName: lastName || 'Student',
      email,
      phone: '+1 555-0199',
      country: 'United States',
      targetExam: 'IMAT / USMLE',
      isVerified: true,
      createdAt: new Date().toISOString(),
    });
    setStudentLoggedIn(true);
    setRole('student');
  };

  const logoutStudent = () => {
    setStudentLoggedIn(false);
    setCurrentUser(mockCurrentUser);
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
        loginStudent,
        logoutStudent,
        liveTestSession,
        startLiveTest,
        endLiveTest,

        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,

        recordedLectures,
        addLecture,
        updateLecture,
        deleteLecture,

        libraryResources,
        addLibraryResource,
        updateLibraryResource,
        deleteLibraryResource,

        studentMistakes,
        addMistake,
        toggleMistakeResolved,
        deleteMistake,
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
