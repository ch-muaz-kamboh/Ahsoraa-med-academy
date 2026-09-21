export type UserRole =
  | 'visitor'
  | 'lead'
  | 'student'
  | 'parent'
  | 'faculty'
  | 'counsellor'
  | 'admissions_officer'
  | 'visa_officer'
  | 'finance'
  | 'content_editor'
  | 'admin'
  | 'super_admin';

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'counselling_booked'
  | 'counselling_completed'
  | 'proposal_sent'
  | 'payment_pending'
  | 'converted'
  | 'onboarding'
  | 'closed_lost';

export type LeadPriority = 'hot' | 'warm' | 'cold';
export type TestDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type AttemptStatus = 'in_progress' | 'completed' | 'timed_out' | 'abandoned';
export type DoubtStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type ApplicationStatus =
  | 'profile_review'
  | 'shortlisting'
  | 'documents_pending'
  | 'eligibility_check'
  | 'application_prepared'
  | 'submitted'
  | 'under_university_review'
  | 'conditional_offer'
  | 'unconditional_offer'
  | 'rejected'
  | 'enrolled'
  | 'visa_stage';

export type DocumentCategory =
  | 'identity_passport'
  | 'academic_certificate'
  | 'transcript'
  | 'attestation_legalization'
  | 'language_certificate'
  | 'application_form'
  | 'university_correspondence'
  | 'scholarship_document'
  | 'financial_document'
  | 'visa_document'
  | 'travel_document'
  | 'other';

export type DocumentStatus =
  | 'requested'
  | 'uploaded'
  | 'under_review'
  | 'revision_requested'
  | 'resubmitted'
  | 'approved'
  | 'submitted_to_university'
  | 'archived';

export type VisaStatus =
  | 'checklist_pending'
  | 'documents_collecting'
  | 'documents_verified'
  | 'appointment_booked'
  | 'interview_prep'
  | 'submitted'
  | 'embassy_processing'
  | 'additional_info_requested'
  | 'approved'
  | 'refused';

export interface Profile {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  avatarUrl?: string;
  country: string;
  city?: string;
  targetExam?: string;
  targetCountry?: string;
  selectedPackage?: string;
  packagePrice?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  leadCode: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  academicBackground: string;
  targetExam: string;
  targetCountry: string;
  budgetRange: string;
  source: string;
  utmSource?: string;
  assignedCounsellor?: string;
  stage: LeadStage;
  priority: LeadPriority;
  leadScore: number;
  nextFollowupAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  targetExam: string;
  summary: string;
  overview: string;
  thumbnailUrl: string;
  durationHours: number;
  totalLectures: number;
  totalTests: number;
  totalResources: number;
  rating: number;
  studentsCount: number;
  price: number;
  comparePrice?: number;
  isFeatured?: boolean;
  badge?: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  contentMarkdown?: string;
  isPreviewAllowed?: boolean;
  isCompleted?: boolean;
  orderIndex: number;
}

export interface TestQuestion {
  id: string;
  orderIndex: number;
  subject: string;
  topic: string;
  difficulty: TestDifficulty;
  questionText: string;
  questionImageUrl?: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string;
}

export interface Test {
  id: string;
  slug: string;
  title: string;
  category: string;
  subject?: string;
  difficulty: TestDifficulty;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  positiveMark: number;
  negativeMark: number;
  passingPercentage: number;
  instructions: string;
  isPublicSample?: boolean;
  questions: TestQuestion[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
  timeSpentSeconds: number;
  totalScore: number;
  percentage: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  accuracyRate: number;
  percentile: number;
  subjectBreakdown: Record<string, { total: number; correct: number; score: number }>;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  bio: string;
  avatarUrl: string;
  rating: number;
  totalSessions: number;
  hourlyRate: number;
  availableDays: string[];
}

export interface DoubtItem {
  id: string;
  studentName: string;
  subject: string;
  topic: string;
  title: string;
  questionText: string;
  question?: string;
  answer?: string;
  answeredAt?: string;
  facultyName?: string;
  status: DoubtStatus;
  assignedMentorName?: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  rankingWorld: number;
  rankingNational: number;
  tuitionFeeAnnual: number;
  currency: string;
  durationYears: number;
  language: string;
  intakes: string[];
  admissionRatePercent: number;
  overview: string;
  eligibility: string;
  imageUrl: string;
  officialWebsiteUrl: string;
  lastVerifiedAt: string;
  isFeatured?: boolean;
  programs: string[];
}

export interface Scholarship {
  id: string;
  title: string;
  country: string;
  universityName: string;
  coverageAmount: string;
  coverageType: string;
  eligibilitySummary: string;
  deadline: string;
  lastVerifiedAt: string;
}

export interface ApplicationCase {
  id: string;
  caseNumber: string;
  studentName: string;
  targetCountry: string;
  targetIntake: string;
  currentStage: ApplicationStatus;
  assignedCounsellor: string;
  assignedAdmissionsOfficer: string;
  progressPercent: number;
  applications: {
    id: string;
    universityName: string;
    program: string;
    status: ApplicationStatus;
    deadline: string;
  }[];
  createdAt: string;
}

export interface StudentDocument {
  id: string;
  category: DocumentCategory;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  status: DocumentStatus;
  rejectionReason?: string;
  version: number;
  uploadedAt: string;
  reviewedBy?: string;
}

export interface VisaCase {
  id: string;
  destinationCountry: string;
  visaType: string;
  status: VisaStatus;
  officerName: string;
  appointmentDate?: string;
  submissionDate?: string;
  notes: string;
  checklists: { item: string; isCompleted: boolean }[];
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  details: string;
  timestamp: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  date: string;
  time: string;
  durationMinutes: number;
  meetingUrl?: string;
  location?: string;
  status: 'upcoming' | 'live' | 'completed';
  description?: string;
  createdAt: string;
}

export interface RecordedLecture {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  durationMinutes: number;
  videoUrl: string;
  thumbnailUrl?: string;
  pdfAttachmentUrl?: string;
  description?: string;
  instructor?: string;
  viewsCount?: number;
  createdAt: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  category: 'Book' | 'PDF Notes' | 'Formula Sheet' | 'Past Paper' | 'Other';
  subject: string;
  fileUrl: string;
  fileSizeBytes?: number;
  pagesCount?: number;
  authorOrSource?: string;
  description?: string;
  downloadCount?: number;
  uploadedAt: string;
}

export interface StudentMistake {
  id: string;
  questionId: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOption: string;
  selectedOption: string;
  explanation: string;
  source: 'Practice Bank' | 'CBT Mock';
  testTitle?: string;
  subject: string;
  topic?: string;
  failedAt: string;
  isResolved: boolean;
}

// ── Staff Portal & RBAC Architecture Types ────────────────────────────────────
export type StaffRole = 'super_admin' | 'academic_admin' | 'teacher' | 'admissions_staff';
export type PublishingStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface StaffProfile {
  id: string;
  email: string;
  displayName: string;
  accountType: 'student' | 'staff' | 'admin';
  role: StaffRole;
  isActive: boolean;
  assignedSubjects: string[];
  assignedCohorts: string[];
  createdAt: string;
}

export interface LiveClassAttendance {
  id: string;
  scheduleId: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  markedAt: string;
  markedBy: string;
}

export interface MockVersionSnapshot {
  id: string;
  versionLabel: string;
  questionsCount: number;
  durationMinutes: number;
  scoringCorrect: number;
  scoringIncorrect: number;
  scoringBlank: number;
  maxScore: number;
  questionIds: string[];
  createdBy: string;
  createdAt: string;
}


