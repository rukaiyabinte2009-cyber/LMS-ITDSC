import {
  COURSES,
  MODULES,
  LESSONS,
  RESOURCES,
  LIVE_SESSIONS,
  ASSIGNMENTS,
  INITIAL_ENROLLMENTS,
  INITIAL_PAYMENTS,
  INITIAL_PROGRESS,
  INITIAL_SUBMISSIONS,
  INITIAL_CERTIFICATES,
  INITIAL_USERS,
} from '../data/mockData';
import {
  Enrollment,
  Payment,
  Submission,
  Certificate,
  User,
  PaymentMethod,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'itds_current_user',
  ENROLLMENTS: 'itds_enrollments',
  PAYMENTS: 'itds_payments',
  PROGRESS: 'itds_progress',
  SUBMISSIONS: 'itds_submissions',
  CERTIFICATES: 'itds_certificates',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error('Storage error', e);
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export class AppStateStore {
  private static instance: AppStateStore;
  private listeners: (() => void)[] = [];

  currentUser: User;
  enrollments: Enrollment[];
  payments: Payment[];
  completedLessonIds: string[];
  submissions: Submission[];
  certificates: Certificate[];

  private constructor() {
    this.currentUser = getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Default to Rahim Ahmed (student)
    this.enrollments = getStored<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    this.payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    this.completedLessonIds = getStored<string[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    this.submissions = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    this.certificates = getStored<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  }

  static getInstance(): AppStateStore {
    if (!AppStateStore.instance) {
      AppStateStore.instance = new AppStateStore();
    }
    return AppStateStore.instance;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Switch Role/User
  setCurrentUser(user: User) {
    this.currentUser = user;
    setStored(STORAGE_KEYS.CURRENT_USER, user);
    this.notify();
  }

  // Check enrollment
  isUserEnrolled(courseId: string, userId?: string): boolean {
    const targetUserId = userId || this.currentUser.id;
    return this.enrollments.some(
      (e) => e.course_id === courseId && e.user_id === targetUserId && e.status === 'active'
    );
  }

  getEnrollment(courseId: string, userId?: string): Enrollment | undefined {
    const targetUserId = userId || this.currentUser.id;
    return this.enrollments.find((e) => e.course_id === courseId && e.user_id === targetUserId);
  }

  // Enroll in free course or request paid
  enrollCourse(courseId: string, isFree: boolean): Enrollment {
    const existing = this.getEnrollment(courseId);
    if (existing) return existing;

    const newEnrollment: Enrollment = {
      id: `enr_${Date.now()}`,
      user_id: this.currentUser.id,
      course_id: courseId,
      status: isFree ? 'active' : 'pending',
      created_at: new Date().toISOString(),
      approved_at: isFree ? new Date().toISOString() : undefined,
    };

    this.enrollments = [newEnrollment, ...this.enrollments];
    setStored(STORAGE_KEYS.ENROLLMENTS, this.enrollments);
    this.notify();
    return newEnrollment;
  }

  // Submit manual bKash/Nagad/Rocket payment
  submitPayment(data: {
    enrollmentId: string;
    courseId: string;
    courseTitle: string;
    method: PaymentMethod;
    amount: number;
    senderNumber: string;
    trxId: string;
  }): { success: boolean; error?: string } {
    // Check trxId uniqueness
    const normalizedTrx = data.trxId.trim().toUpperCase();
    const isDuplicate = this.payments.some(
      (p) => p.method === data.method && p.trx_id.trim().toUpperCase() === normalizedTrx
    );

    if (isDuplicate) {
      return { success: false, error: `This Transaction ID (${normalizedTrx}) has already been submitted.` };
    }

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      enrollment_id: data.enrollmentId,
      user_id: this.currentUser.id,
      user_name: this.currentUser.name,
      user_email: this.currentUser.email,
      course_id: data.courseId,
      course_title: data.courseTitle,
      method: data.method,
      amount_bdt: data.amount,
      sender_number: data.senderNumber,
      trx_id: normalizedTrx,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    this.payments = [newPayment, ...this.payments];
    setStored(STORAGE_KEYS.PAYMENTS, this.payments);
    this.notify();
    return { success: true };
  }

  // Admin verifies payment
  verifyPayment(paymentId: string, adminNote?: string) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return;

    payment.status = 'verified';
    payment.verified_at = new Date().toISOString();
    payment.admin_note = adminNote || 'Verified in MFS merchant terminal. Enrollment activated.';

    // Activate corresponding enrollment in a single atomic-like update
    const enrollment = this.enrollments.find((e) => e.id === payment.enrollment_id);
    if (enrollment) {
      enrollment.status = 'active';
      enrollment.approved_at = new Date().toISOString();
      enrollment.approved_by = this.currentUser.id;
    }

    setStored(STORAGE_KEYS.PAYMENTS, this.payments);
    setStored(STORAGE_KEYS.ENROLLMENTS, this.enrollments);
    this.notify();
  }

  // Admin rejects payment
  rejectPayment(paymentId: string, adminNote: string) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return;

    payment.status = 'rejected';
    payment.admin_note = adminNote;

    const enrollment = this.enrollments.find((e) => e.id === payment.enrollment_id);
    if (enrollment) {
      enrollment.status = 'rejected';
    }

    setStored(STORAGE_KEYS.PAYMENTS, this.payments);
    setStored(STORAGE_KEYS.ENROLLMENTS, this.enrollments);
    this.notify();
  }

  // Toggle Lesson Completion
  toggleLessonCompletion(lessonId: string): boolean {
    const exists = this.completedLessonIds.includes(lessonId);
    if (exists) {
      this.completedLessonIds = this.completedLessonIds.filter((id) => id !== lessonId);
    } else {
      this.completedLessonIds = [...this.completedLessonIds, lessonId];
    }
    setStored(STORAGE_KEYS.PROGRESS, this.completedLessonIds);
    this.notify();
    return !exists;
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessonIds.includes(lessonId);
  }

  getCourseProgressPercentage(courseId: string): number {
    const courseLessons = LESSONS.filter((l) => l.course_id === courseId);
    if (courseLessons.length === 0) return 0;
    const completedCount = courseLessons.filter((l) => this.completedLessonIds.includes(l.id)).length;
    return Math.round((completedCount / courseLessons.length) * 100);
  }

  // Submit assignment
  submitAssignment(data: {
    assignmentId: string;
    assignmentTitle: string;
    originalName: string;
    fileSizeBytes: number;
    fileSizeFormatted: string;
  }): Submission {
    const userSubmissions = this.submissions.filter(
      (s) => s.assignment_id === data.assignmentId && s.user_id === this.currentUser.id
    );
    const attempt = userSubmissions.length + 1;

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      assignment_id: data.assignmentId,
      assignment_title: data.assignmentTitle,
      user_id: this.currentUser.id,
      user_name: this.currentUser.name,
      user_email: this.currentUser.email,
      attempt,
      original_name: data.originalName,
      size_bytes: data.fileSizeBytes,
      file_size_formatted: data.fileSizeFormatted,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    };

    this.submissions = [newSub, ...this.submissions];
    setStored(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.notify();
    return newSub;
  }

  // Admin grades submission
  gradeSubmission(submissionId: string, score: number, feedback: string, resubmitRequested: boolean = false) {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    sub.score = score;
    sub.feedback = feedback;
    sub.status = resubmitRequested ? 'resubmit_requested' : 'graded';
    sub.graded_at = new Date().toISOString();

    setStored(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.notify();
  }

  // Generate / Claim Certificate
  generateCertificate(courseId: string): Certificate | null {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return null;

    // Check if already issued
    const existing = this.certificates.find(
      (c) => c.course_id === courseId && c.user_id === this.currentUser.id
    );
    if (existing) return existing;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `ITDS-EXCEL-2026-${randomSuffix}`;

    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      user_id: this.currentUser.id,
      user_name: this.currentUser.name,
      course_id: courseId,
      course_title: course.title,
      code,
      issued_at: new Date().toISOString(),
      grade_text: 'Distinction (Passed)',
    };

    this.certificates = [newCert, ...this.certificates];
    setStored(STORAGE_KEYS.CERTIFICATES, this.certificates);
    this.notify();
    return newCert;
  }

  resetAllData() {
    localStorage.clear();
    this.currentUser = INITIAL_USERS[0];
    this.enrollments = INITIAL_ENROLLMENTS;
    this.payments = INITIAL_PAYMENTS;
    this.completedLessonIds = INITIAL_PROGRESS;
    this.submissions = INITIAL_SUBMISSIONS;
    this.certificates = INITIAL_CERTIFICATES;
    this.notify();
  }
}

export const store = AppStateStore.getInstance();
