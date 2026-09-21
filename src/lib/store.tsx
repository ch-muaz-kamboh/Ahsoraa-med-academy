"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
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
  StaffProfile,
  StaffRole,
  StaffPermission,
  StaffAccountStatus,
  StaffAccountRequest,
  LiveClassAttendance,
  MockVersionSnapshot,
  StaffQuestion,
  PublishingStatus,
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

export type MedpathStageStatus = 'pending' | 'in_progress' | 'completed';

export interface MedpathEliteStudent {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  registeredAt: string;
  stages: {
    pre_enrollment: MedpathStageStatus;
    dov_submission: MedpathStageStatus;
    university_application: MedpathStageStatus;
    admission_decision: MedpathStageStatus;
    visa_process: MedpathStageStatus;
    housing_arrival: MedpathStageStatus;
  };
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
  answerDoubt: (doubtId: string, answerText: string) => void;
  testAttempts: TestAttempt[];
  recordTestAttempt: (attempt: TestAttempt) => void;
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  studentLoggedIn: boolean;
  setStudentLoggedIn: (val: boolean) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
  staffLoggedIn: boolean;
  setStaffLoggedIn: (val: boolean) => void;
  staffProfile: StaffProfile;
  setStaffRole: (role: StaffRole) => void;
  staffAccounts: StaffAccountRequest[];
  registerStaffAccount: (data: Omit<StaffAccountRequest, 'id' | 'createdAt' | 'status' | 'isActive'>) => { success: boolean; message: string };
  approveStaffAccount: (id: string) => void;
  declineStaffAccount: (id: string, reason?: string) => void;
  updateStaffPermissions: (staffId: string, permissions: StaffPermission[]) => void;
  loginStaffAccount: (email: string, password?: string) => { success: boolean; message: string; status?: StaffAccountStatus };
  logoutStaffAccount: () => void;
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

  // Staff Attendance & Snapshots
  attendances: LiveClassAttendance[];
  markAttendance: (scheduleId: string, studentId: string, studentName: string, status: 'present' | 'absent' | 'late') => void;
  mockSnapshots: MockVersionSnapshot[];
  createMockSnapshot: (versionLabel: string, questionIds: string[]) => void;

  // Staff MCQ Review Workflow
  staffQuestions: StaffQuestion[];
  addStaffQuestion: (q: Omit<StaffQuestion, 'id' | 'createdAt' | 'status'>) => void;
  submitQuestionForReview: (id: string) => void;
  approveStaffQuestion: (id: string, note?: string) => void;
  declineStaffQuestion: (id: string, note: string) => void;
  deleteStaffQuestion: (id: string) => void;

  // Medpath Elite
  eliteStudents: MedpathEliteStudent[];
  addEliteStudent: (student: Omit<MedpathEliteStudent, 'id'>) => void;
  updateEliteStage: (studentId: string, stage: keyof MedpathEliteStudent['stages'], status: MedpathStageStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<Profile>(mockCurrentUser);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [documents, setDocuments] = useState<StudentDocument[]>(mockStudentDocuments);
  const [doubts, setDoubts] = useState<DoubtItem[]>(() => {
    if (typeof window === 'undefined') return mockDoubts;
    try {
      const saved = localStorage.getItem('ahsora_local_doubts');
      return saved ? JSON.parse(saved) : mockDoubts;
    } catch { return mockDoubts; }
  });
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [adminLoggedIn, setAdminLoggedInState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ahsora_adminLoggedIn') === 'true';
  });

  const setAdminLoggedIn = (val: boolean) => {
    setAdminLoggedInState(val);
    if (typeof window !== 'undefined') {
      if (val) {
        localStorage.setItem('ahsora_adminLoggedIn', 'true');
      } else {
        localStorage.removeItem('ahsora_adminLoggedIn');
      }
    }
  };

  const [studentLoggedIn, setStudentLoggedInState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ahsora_studentLoggedIn') === 'true';
  });

  const setStudentLoggedIn = (val: boolean) => {
    setStudentLoggedInState(val);
    if (typeof window !== 'undefined') {
      if (val) {
        localStorage.setItem('ahsora_studentLoggedIn', 'true');
      } else {
        localStorage.removeItem('ahsora_studentLoggedIn');
      }
    }
  };

  const [staffLoggedIn, setStaffLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ahsora_staffLoggedIn') === 'true';
  });
  const [staffAccounts, setStaffAccounts] = useState<StaffAccountRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ahsora_staffAccounts');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [staffProfile, setStaffProfile] = useState<StaffProfile>(() => {
    if (typeof window === 'undefined') return {} as StaffProfile;
    try {
      const saved = localStorage.getItem('ahsora_staffProfile');
      return saved ? JSON.parse(saved) : {} as StaffProfile;
    } catch { return {} as StaffProfile; }
  });
  const [attendances, setAttendances] = useState<LiveClassAttendance[]>([]);

  // Persist staff accounts and profile to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_staffAccounts', JSON.stringify(staffAccounts));
    }
  }, [staffAccounts]);

  useEffect(() => {
    if (typeof window !== 'undefined' && staffProfile && staffProfile.id) {
      localStorage.setItem('ahsora_staffProfile', JSON.stringify(staffProfile));
    }
  }, [staffProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_local_doubts', JSON.stringify(doubts));
    }
  }, [doubts]);

  // Cross-tab sync: when another tab (e.g. staff/student) updates staffAccounts, questions, or doubts in localStorage,
  // reload it here automatically without manual refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ahsora_staffAccounts' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setStaffAccounts(updated);
        } catch {}
      }
      if (e.key === 'ahsora_staffQuestions' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setStaffQuestions(updated);
        } catch {}
      }
      if (e.key === 'ahsora_local_doubts' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setDoubts(updated);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Staff MCQ Question Bank — shared, persisted
  const [staffQuestions, setStaffQuestions] = useState<StaffQuestion[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ahsora_staffQuestions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_staffQuestions', JSON.stringify(staffQuestions));
    }
  }, [staffQuestions]);
  const [mockSnapshots, setMockSnapshots] = useState<MockVersionSnapshot[]>([
    {
      id: 'snap-v1',
      versionLabel: 'IMAT Official CBT 2026 v1.0',
      questionsCount: 60,
      durationMinutes: 100,
      scoringCorrect: 1.5,
      scoringIncorrect: -0.4,
      scoringBlank: 0,
      maxScore: 90,
      questionIds: ['qb-BIO-BCH-WAT-001-1', 'qb-BIO-BCH-WAT-002-2'],
      createdBy: 'staff-001',
      createdAt: new Date().toISOString(),
    }
  ]);
  const [liveTestSession, setLiveTestSession] = useState<LiveTestSession | null>(null);

  // New features state with localStorage persistence & Supabase sync
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

  // Initial Supabase Sync on Mount
  useEffect(() => {
    const syncFromSupabase = async () => {
      try {
        const supabase = createClient();

        // 1. Schedules
        const { data: dbSchedules } = await supabase.from('portal_schedules').select('*').order('created_at', { ascending: false });
        if (dbSchedules && dbSchedules.length > 0) {
          const formatted: ScheduleItem[] = dbSchedules.map((s: any) => ({
            id: s.id,
            title: s.title,
            subject: s.subject,
            instructor: s.instructor,
            date: s.date,
            time: s.time,
            durationMinutes: s.duration_minutes,
            meetingUrl: s.meeting_url || '',
            location: s.location || '',
            status: s.status,
            description: s.description || '',
            createdAt: s.created_at,
          }));
          setSchedules(formatted);
          localStorage.setItem('ahsora_schedules', JSON.stringify(formatted));
        }

        // 2. Lectures
        const { data: dbLectures } = await supabase.from('portal_lectures').select('*').order('created_at', { ascending: false });
        if (dbLectures && dbLectures.length > 0) {
          const formatted: RecordedLecture[] = dbLectures.map((l: any) => ({
            id: l.id,
            title: l.title,
            subject: l.subject,
            topic: l.topic || '',
            durationMinutes: l.duration_minutes,
            videoUrl: l.video_url,
            thumbnailUrl: l.thumbnail_url || '',
            pdfAttachmentUrl: l.pdf_attachment_url || '',
            description: l.description || '',
            instructor: l.instructor || '',
            viewsCount: l.views_count || 0,
            createdAt: l.created_at,
          }));
          setRecordedLectures(formatted);
          localStorage.setItem('ahsora_lectures', JSON.stringify(formatted));
        }

        // 3. Library Resources
        const { data: dbLibrary } = await supabase.from('portal_library').select('*').order('uploaded_at', { ascending: false });
        if (dbLibrary && dbLibrary.length > 0) {
          const formatted: LibraryResource[] = dbLibrary.map((r: any) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            subject: r.subject,
            fileUrl: r.file_url,
            fileSizeBytes: r.file_size_bytes || 0,
            pagesCount: r.pages_count || 0,
            authorOrSource: r.author_or_source || '',
            description: r.description || '',
            downloadCount: r.download_count || 0,
            uploadedAt: r.uploaded_at,
          }));
          setLibraryResources(formatted);
          localStorage.setItem('ahsora_library', JSON.stringify(formatted));
        }

        // 4. Student Mistakes
        const { data: dbMistakes } = await supabase.from('portal_mistakes').select('*').order('failed_at', { ascending: false });
        if (dbMistakes && dbMistakes.length > 0) {
          const formatted: StudentMistake[] = dbMistakes.map((m: any) => ({
            id: m.id,
            questionId: m.question_id,
            questionText: m.question_text,
            options: typeof m.options === 'string' ? JSON.parse(m.options) : m.options,
            correctOption: m.correct_option,
            selectedOption: m.selected_option,
            explanation: m.explanation || '',
            source: m.source,
            testTitle: m.test_title || '',
            subject: m.subject,
            topic: m.topic || '',
            failedAt: m.failed_at,
            isResolved: m.is_resolved,
          }));
          setStudentMistakes(formatted);
          localStorage.setItem('ahsora_mistakes', JSON.stringify(formatted));
        }
      } catch (err) {
        console.warn('Supabase sync info:', err);
      }
    };

    syncFromSupabase();
  }, []);

  // Real-time subscriptions for data changes
  useEffect(() => {
    const supabase = createClient();

    // Helper formatters
    const formatSchedule = (s: any): ScheduleItem => ({
      id: s.id,
      title: s.title,
      subject: s.subject,
      instructor: s.instructor,
      date: s.date,
      time: s.time,
      durationMinutes: s.duration_minutes,
      meetingUrl: s.meeting_url || '',
      location: s.location || '',
      status: s.status,
      description: s.description || '',
      createdAt: s.created_at,
    });
    const formatLecture = (l: any): RecordedLecture => ({
      id: l.id,
      title: l.title,
      subject: l.subject,
      topic: l.topic || '',
      durationMinutes: l.duration_minutes,
      videoUrl: l.video_url,
      thumbnailUrl: l.thumbnail_url || '',
      pdfAttachmentUrl: l.pdf_attachment_url || '',
      description: l.description || '',
      instructor: l.instructor || '',
      viewsCount: l.views_count || 0,
      createdAt: l.created_at,
    });
    const formatLibrary = (r: any): LibraryResource => ({
      id: r.id,
      title: r.title,
      category: r.category,
      subject: r.subject,
      fileUrl: r.file_url,
      fileSizeBytes: r.file_size_bytes || 0,
      pagesCount: r.pages_count || 0,
      authorOrSource: r.author_or_source || '',
      description: r.description || '',
      downloadCount: r.download_count || 0,
      uploadedAt: r.uploaded_at,
    });
    const formatMistake = (m: any): StudentMistake => ({
      id: m.id,
      questionId: m.question_id,
      questionText: m.question_text,
      options: typeof m.options === 'string' ? JSON.parse(m.options) : m.options,
      correctOption: m.correct_option,
      selectedOption: m.selected_option,
      explanation: m.explanation || '',
      source: m.source,
      testTitle: m.test_title || '',
      subject: m.subject,
      topic: m.topic || '',
      failedAt: m.failed_at,
      isResolved: m.is_resolved,
    });

    // Schedules channel
    const schedulesChannel = supabase
      .channel('public:portal_schedules')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portal_schedules' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          if (payload.old && payload.old.id) {
            setSchedules((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
        } else if (payload.new && payload.new.id) {
          const newItem = formatSchedule(payload.new);
          setSchedules((prev) => {
            const filtered = prev.filter((s) => s.id !== newItem.id);
            return [newItem, ...filtered];
          });
        }
      })
      .subscribe();

    // Lectures channel
    const lecturesChannel = supabase
      .channel('public:portal_lectures')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portal_lectures' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          if (payload.old && payload.old.id) {
            setRecordedLectures((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        } else if (payload.new && payload.new.id) {
          const newItem = formatLecture(payload.new);
          setRecordedLectures((prev) => {
            const filtered = prev.filter((l) => l.id !== newItem.id);
            return [newItem, ...filtered];
          });
        }
      })
      .subscribe();

    // Library channel
    const libraryChannel = supabase
      .channel('public:portal_library')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portal_library' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          if (payload.old && payload.old.id) {
            setLibraryResources((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        } else if (payload.new && payload.new.id) {
          const newItem = formatLibrary(payload.new);
          setLibraryResources((prev) => {
            const filtered = prev.filter((r) => r.id !== newItem.id);
            return [newItem, ...filtered];
          });
        }
      })
      .subscribe();

    // Mistakes channel
    const mistakesChannel = supabase
      .channel('public:portal_mistakes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portal_mistakes' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          if (payload.old && payload.old.id) {
            setStudentMistakes((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        } else if (payload.new && payload.new.id) {
          const newItem = formatMistake(payload.new);
          setStudentMistakes((prev) => {
            const filtered = prev.filter((m) => m.id !== newItem.id);
            return [newItem, ...filtered];
          });
        }
      })
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(schedulesChannel);
      supabase.removeChannel(lecturesChannel);
      supabase.removeChannel(libraryChannel);
      supabase.removeChannel(mistakesChannel);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_schedules', JSON.stringify(schedules));
    }
  }, [schedules]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_lectures', JSON.stringify(recordedLectures));
    }
  }, [recordedLectures]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_library', JSON.stringify(libraryResources));
    }
  }, [libraryResources]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_mistakes', JSON.stringify(studentMistakes));
    }
  }, [studentMistakes]);

  const addSchedule = async (item: Omit<ScheduleItem, 'id' | 'createdAt'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSchedules((prev) => [newItem, ...prev]);

    try {
      const supabase = createClient();
      await supabase.from('portal_schedules').insert({
        id: newItem.id,
        title: newItem.title,
        subject: newItem.subject,
        instructor: newItem.instructor,
        date: newItem.date,
        time: newItem.time,
        duration_minutes: newItem.durationMinutes,
        meeting_url: newItem.meetingUrl,
        location: newItem.location,
        status: newItem.status,
        description: newItem.description,
        created_at: newItem.createdAt,
      });
    } catch (e) { console.error('Supabase schedule insert error:', e); }
  };

  const updateSchedule = async (id: string, item: Partial<ScheduleItem>) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s)));
    try {
      const supabase = createClient();
      const payload: any = {};
      if (item.title) payload.title = item.title;
      if (item.subject) payload.subject = item.subject;
      if (item.instructor) payload.instructor = item.instructor;
      if (item.date) payload.date = item.date;
      if (item.time) payload.time = item.time;
      if (item.durationMinutes) payload.duration_minutes = item.durationMinutes;
      if (item.meetingUrl !== undefined) payload.meeting_url = item.meetingUrl;
      if (item.location !== undefined) payload.location = item.location;
      if (item.status) payload.status = item.status;
      if (item.description !== undefined) payload.description = item.description;

      await supabase.from('portal_schedules').update(payload).eq('id', id);
    } catch (e) { console.error('Supabase schedule update error:', e); }
  };

  const deleteSchedule = async (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('portal_schedules').delete().eq('id', id);
    } catch (e) { console.error('Supabase schedule delete error:', e); }
  };

  const addLecture = async (item: Omit<RecordedLecture, 'id' | 'createdAt'>) => {
    const newItem: RecordedLecture = {
      ...item,
      id: `lec-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRecordedLectures((prev) => [newItem, ...prev]);
    try {
      const supabase = createClient();
      await supabase.from('portal_lectures').insert({
        id: newItem.id,
        title: newItem.title,
        subject: newItem.subject,
        topic: newItem.topic,
        duration_minutes: newItem.durationMinutes,
        video_url: newItem.videoUrl,
        thumbnail_url: newItem.thumbnailUrl,
        pdf_attachment_url: newItem.pdfAttachmentUrl,
        description: newItem.description,
        instructor: newItem.instructor,
        views_count: newItem.viewsCount || 0,
        created_at: newItem.createdAt,
      });
    } catch (e) { console.error('Supabase lecture insert error:', e); }
  };

  const updateLecture = async (id: string, item: Partial<RecordedLecture>) => {
    setRecordedLectures((prev) => prev.map((l) => (l.id === id ? { ...l, ...item } : l)));
    try {
      const supabase = createClient();
      const payload: any = {};
      if (item.title) payload.title = item.title;
      if (item.subject) payload.subject = item.subject;
      if (item.topic !== undefined) payload.topic = item.topic;
      if (item.durationMinutes) payload.duration_minutes = item.durationMinutes;
      if (item.videoUrl) payload.video_url = item.videoUrl;
      if (item.thumbnailUrl !== undefined) payload.thumbnail_url = item.thumbnailUrl;
      if (item.pdfAttachmentUrl !== undefined) payload.pdf_attachment_url = item.pdfAttachmentUrl;
      if (item.description !== undefined) payload.description = item.description;
      if (item.instructor !== undefined) payload.instructor = item.instructor;

      await supabase.from('portal_lectures').update(payload).eq('id', id);
    } catch (e) { console.error('Supabase lecture update error:', e); }
  };

  const deleteLecture = async (id: string) => {
    setRecordedLectures((prev) => prev.filter((l) => l.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('portal_lectures').delete().eq('id', id);
    } catch (e) { console.error('Supabase lecture delete error:', e); }
  };

  const addLibraryResource = async (item: Omit<LibraryResource, 'id' | 'uploadedAt'>) => {
    const newItem: LibraryResource = {
      ...item,
      id: `lib-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setLibraryResources((prev) => [newItem, ...prev]);
    try {
      const supabase = createClient();
      await supabase.from('portal_library').insert({
        id: newItem.id,
        title: newItem.title,
        category: newItem.category,
        subject: newItem.subject,
        file_url: newItem.fileUrl,
        file_size_bytes: newItem.fileSizeBytes || 0,
        pages_count: newItem.pagesCount || 0,
        author_or_source: newItem.authorOrSource,
        description: newItem.description,
        download_count: newItem.downloadCount || 0,
        uploaded_at: newItem.uploadedAt,
      });
    } catch (e) { console.error('Supabase library insert error:', e); }
  };

  const updateLibraryResource = async (id: string, item: Partial<LibraryResource>) => {
    setLibraryResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...item } : r)));
    try {
      const supabase = createClient();
      const payload: any = {};
      if (item.title) payload.title = item.title;
      if (item.category) payload.category = item.category;
      if (item.subject) payload.subject = item.subject;
      if (item.fileUrl) payload.file_url = item.fileUrl;
      if (item.pagesCount !== undefined) payload.pages_count = item.pagesCount;
      if (item.authorOrSource !== undefined) payload.author_or_source = item.authorOrSource;
      if (item.description !== undefined) payload.description = item.description;

      await supabase.from('portal_library').update(payload).eq('id', id);
    } catch (e) { console.error('Supabase library update error:', e); }
  };

  const deleteLibraryResource = async (id: string) => {
    setLibraryResources((prev) => prev.filter((r) => r.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('portal_library').delete().eq('id', id);
    } catch (e) { console.error('Supabase library delete error:', e); }
  };

  const addMistake = async (item: Omit<StudentMistake, 'id' | 'failedAt' | 'isResolved'>) => {
    const newItem: StudentMistake = {
      ...item,
      id: `mst-${Date.now()}`,
      failedAt: new Date().toISOString(),
      isResolved: false,
    };
    setStudentMistakes((prev) => [newItem, ...prev]);
    try {
      const supabase = createClient();
      await supabase.from('portal_mistakes').insert({
        id: newItem.id,
        question_id: newItem.questionId,
        question_text: newItem.questionText,
        options: newItem.options,
        correct_option: newItem.correctOption,
        selected_option: newItem.selectedOption,
        explanation: newItem.explanation,
        source: newItem.source,
        test_title: newItem.testTitle,
        subject: newItem.subject,
        topic: newItem.topic,
        failed_at: newItem.failedAt,
        is_resolved: newItem.isResolved,
      });
    } catch (e) { console.error('Supabase mistake insert error:', e); }
  };

  const toggleMistakeResolved = async (id: string) => {
    const target = studentMistakes.find((m) => m.id === id);
    const newStatus = target ? !target.isResolved : true;

    setStudentMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isResolved: newStatus } : m))
    );
    try {
      const supabase = createClient();
      await supabase.from('portal_mistakes').update({ is_resolved: newStatus }).eq('id', id);
    } catch (e) { console.error('Supabase mistake toggle error:', e); }
  };

  const deleteMistake = async (id: string) => {
    setStudentMistakes((prev) => prev.filter((m) => m.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('portal_mistakes').delete().eq('id', id);
    } catch (e) { console.error('Supabase mistake delete error:', e); }
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
      setStudentLoggedInState(true);
    }
  };

  // ── Medpath Elite Students ───────────────────────────────────────────────────
  const [eliteStudents, setEliteStudents] = useState<MedpathEliteStudent[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ahsora_elite_students');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_elite_students', JSON.stringify(eliteStudents));
    }
  }, [eliteStudents]);

  const addEliteStudent = (student: Omit<MedpathEliteStudent, 'id'>) => {
    const existing = eliteStudents.find((s) => s.studentId === student.studentId);
    if (existing) return; // already registered
    const newStudent: MedpathEliteStudent = {
      ...student,
      id: 'elite-' + Date.now(),
    };
    setEliteStudents((prev) => [newStudent, ...prev]);
  };

  const updateEliteStage = (
    studentId: string,
    stage: keyof MedpathEliteStudent['stages'],
    status: MedpathStageStatus
  ) => {
    setEliteStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, stages: { ...s.stages, [stage]: status } }
          : s
      )
    );
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

  const setStaffRole = (role: StaffRole) => {
    setStaffProfile((prev) => ({ ...prev, role }));
  };

  const registerStaffAccount = (data: Omit<StaffAccountRequest, 'id' | 'createdAt' | 'status' | 'isActive'>) => {
    const existing = staffAccounts.find((a) => a.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }
    const defaultPerms: StaffPermission[] = data.permissions && data.permissions.length > 0
      ? data.permissions
      : ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance'];

    const newAccount: StaffAccountRequest = {
      ...data,
      permissions: defaultPerms,
      id: `staff-${Date.now()}`,
      status: 'pending',
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    setStaffAccounts((prev) => [newAccount, ...prev]);
    return { success: true, message: 'Registration submitted! Your account request is pending Admin approval.' };
  };

  const approveStaffAccount = (id: string) => {
    setStaffAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved', isActive: true } : a))
    );
  };

  const declineStaffAccount = (id: string, reason?: string) => {
    setStaffAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'rejected', isActive: false, rejectionReason: reason } : a
      )
    );
  };

  const updateStaffPermissions = (staffId: string, permissions: StaffPermission[]) => {
    setStaffAccounts((prev) =>
      prev.map((a) => (a.id === staffId ? { ...a, permissions } : a))
    );
    setStaffProfile((prev) => (prev.id === staffId ? { ...prev, permissions } : prev));
  };

  const loginStaffAccount = (email: string, password?: string): { success: boolean; message: string; status?: StaffAccountStatus } => {
    const acc = staffAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!acc) {
      return { success: false, message: 'No staff account found with this email address.' };
    }
    if (password && acc.password && acc.password !== password) {
      return { success: false, message: 'Incorrect password. Please check your credentials.' };
    }
    if (acc.status === 'pending') {
      return { success: false, status: 'pending' as StaffAccountStatus, message: 'Your faculty sign-up request is pending Admin approval.' };
    }
    if (acc.status === 'rejected' || !acc.isActive) {
      return { success: false, status: 'rejected' as StaffAccountStatus, message: 'Your faculty account access has been declined or disabled by an Admin.' };
    }
    setStaffProfile(acc);
    setStaffLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahsora_staffLoggedIn', 'true');
      localStorage.setItem('ahsora_staffProfile', JSON.stringify(acc));
    }
    return { success: true, message: 'Login successful!' };
  };

  const logoutStaffAccount = () => {
    setStaffLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ahsora_staffLoggedIn');
      localStorage.removeItem('ahsora_staffProfile');
    }
  };

  const answerDoubt = (doubtId: string, answerText: string) => {
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === doubtId
          ? {
              ...d,
              status: 'resolved',
              answer: answerText,
              resolutionNote: answerText,
              answeredAt: new Date().toISOString(),
              facultyName: staffProfile.displayName || staffProfile.email || 'Assigned Faculty',
              assignedMentorName: staffProfile.displayName || staffProfile.email || 'Assigned Faculty',
            }
          : d
      )
    );
  };

  const markAttendance = (
    scheduleId: string,
    studentId: string,
    studentName: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    setAttendances((prev) => [
      ...prev.filter((a) => !(a.scheduleId === scheduleId && a.studentId === studentId)),
      {
        id: 'att-' + Date.now() + Math.random().toString(36).substr(2, 4),
        scheduleId,
        studentId,
        studentName,
        status,
        markedAt: new Date().toISOString(),
        markedBy: staffProfile.displayName,
      },
    ]);
  };

  const createMockSnapshot = (versionLabel: string, questionIds: string[]) => {
    const newSnap: MockVersionSnapshot = {
      id: 'snap-' + Date.now(),
      versionLabel,
      questionsCount: questionIds.length || 60,
      durationMinutes: 100,
      scoringCorrect: 1.5,
      scoringIncorrect: -0.4,
      scoringBlank: 0,
      maxScore: 90,
      questionIds,
      createdBy: staffProfile.id,
      createdAt: new Date().toISOString(),
    };
    setMockSnapshots((prev) => [newSnap, ...prev]);
  };

  // ── Staff MCQ Review Workflow Actions ────────────────────────────────────────
  const addStaffQuestion = (q: Omit<StaffQuestion, 'id' | 'createdAt' | 'status'>) => {
    const newQ: StaffQuestion = {
      ...q,
      id: 'sq-' + Date.now() + Math.random().toString(36).substr(2, 4),
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    setStaffQuestions((prev) => [newQ, ...prev]);
  };

  const submitQuestionForReview = (id: string) => {
    setStaffQuestions((prev) =>
      prev.map((q) => q.id === id ? { ...q, status: 'in_review' as PublishingStatus, submittedAt: new Date().toISOString() } : q)
    );
  };

  const approveStaffQuestion = (id: string, note?: string) => {
    setStaffQuestions((prev) => {
      const updated = prev.map((q) => q.id === id ? { ...q, status: 'published' as PublishingStatus, reviewedAt: new Date().toISOString(), reviewNote: note } : q);

      const approvedQ = updated.find((q) => q.id === id);
      if (approvedQ) {
        const qbFormat = {
          id: approvedQ.id,
          subject: approvedQ.subject,
          chapter: approvedQ.chapter || '',
          topic: approvedQ.topic || '',
          difficulty: approvedQ.difficulty,
          question_text: approvedQ.question_text,
          option_a: approvedQ.option_a || '',
          option_b: approvedQ.option_b || '',
          option_c: approvedQ.option_c || '',
          option_d: approvedQ.option_d || '',
          option_e: approvedQ.option_e || '',
          correct_option: approvedQ.correct_option,
          explanation: approvedQ.explanation || '',
          source_reference: `Staff: ${approvedQ.author || 'Faculty'}`,
          is_active: true,
          created_at: approvedQ.createdAt || new Date().toISOString(),
        };

        // Merge into local question bank pool for instant student access
        try {
          const cachedPool = localStorage.getItem('ahsora_local_qb_questions');
          let poolArray = cachedPool ? JSON.parse(cachedPool) : [];
          if (!poolArray.some((item: any) => item.id === qbFormat.id)) {
            poolArray.unshift(qbFormat);
            localStorage.setItem('ahsora_local_qb_questions', JSON.stringify(poolArray));
          }
        } catch (e) {}

        // Async write to Supabase if connected
        try {
          const supabase = createClient();
          supabase.from('qb_questions').upsert([qbFormat]).then(() => {});
        } catch (e) {}
      }

      return updated;
    });
  };

  const declineStaffQuestion = (id: string, note: string) => {
    setStaffQuestions((prev) =>
      prev.map((q) => q.id === id ? { ...q, status: 'draft' as PublishingStatus, reviewedAt: new Date().toISOString(), reviewNote: note } : q)
    );
  };

  const deleteStaffQuestion = (id: string) => {
    setStaffQuestions((prev) => prev.filter((q) => q.id !== id));
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
        answerDoubt,
        testAttempts,
        recordTestAttempt,
        toggleLessonCompletion,
        studentLoggedIn,
        setStudentLoggedIn,
        adminLoggedIn,
        setAdminLoggedIn,
        staffLoggedIn,
        setStaffLoggedIn,
        staffProfile,
        setStaffRole,
        staffAccounts,
        registerStaffAccount,
        approveStaffAccount,
        declineStaffAccount,
        updateStaffPermissions,
        loginStaffAccount,
        logoutStaffAccount,
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

        attendances,
        markAttendance,
        mockSnapshots,
        createMockSnapshot,

        staffQuestions,
        addStaffQuestion,
        submitQuestionForReview,
        approveStaffQuestion,
        declineStaffQuestion,
        deleteStaffQuestion,

        eliteStudents,
        addEliteStudent,
        updateEliteStage,
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
