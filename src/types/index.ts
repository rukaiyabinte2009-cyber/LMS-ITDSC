export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price_bdt: number;
  is_published: boolean;
  thumbnail: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  duration_weeks: number;
  total_lessons: number;
  total_hours: number;
  tags: string[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  position: number;
  description?: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  position: number;
  youtube_id?: string;
  duration_min: number;
  notes_md: string;
  is_free_preview: boolean;
}

export interface Resource {
  id: string;
  course_id: string;
  module_id?: string;
  title: string;
  file_name: string;
  file_size: string;
  download_url?: string;
  type: 'excel' | 'pdf' | 'csv' | 'zip';
}

export interface LiveSession {
  id: string;
  course_id: string;
  title: string;
  starts_at: string; // ISO string in UTC, formatted to Asia/Dhaka in UI
  duration_min: number;
  meet_url: string; // Zoom join URL
  passcode?: string;
  meeting_id?: string;
  language: 'bn' | 'en' | 'mixed';
  recording_youtube_id?: string;
  instructor_name: string;
  topic_summary: string;
}

export interface Assignment {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  instructions_md: string;
  max_score: number;
  pass_score: number;
  due_date_formatted: string;
  sample_resource?: {
    name: string;
    size: string;
    url?: string;
  };
}

export type EnrollmentStatus = 'pending' | 'active' | 'rejected' | 'revoked';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket';
export type PaymentStatus = 'submitted' | 'verified' | 'rejected';

export interface Payment {
  id: string;
  enrollment_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  course_id: string;
  course_title: string;
  method: PaymentMethod;
  amount_bdt: number;
  sender_number: string;
  trx_id: string;
  status: PaymentStatus;
  admin_note?: string;
  created_at: string;
  verified_at?: string;
}

export interface LessonProgress {
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export type SubmissionStatus = 'submitted' | 'graded' | 'resubmit_requested';

export interface Submission {
  id: string;
  assignment_id: string;
  assignment_title: string;
  user_id: string;
  user_name: string;
  user_email: string;
  attempt: number;
  original_name: string;
  size_bytes: number;
  file_size_formatted: string;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  user_name: string;
  course_id: string;
  course_title: string;
  code: string; // e.g. ITDS-EXCEL-2026-8942
  issued_at: string;
  grade_text: string;
}
