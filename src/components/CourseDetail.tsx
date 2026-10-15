import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  PlayCircle,
  Video,
  FileCheck2,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  ShieldCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Course, Module, Lesson } from '../types';
import { MODULES, LESSONS, RESOURCES, LIVE_SESSIONS } from '../data/mockData';
import { store } from '../lib/storage';
import { PaymentModal } from './PaymentModal';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onOpenPlayer: (course: Course, lessonId?: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onOpenPlayer }) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    m_excel_1: true,
    m_excel_2: true,
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const courseModules = MODULES.filter((m) => m.course_id === course.id);
  const courseLessons = LESSONS.filter((l) => l.course_id === course.id);
  const courseResources = RESOURCES.filter((r) => r.course_id === course.id);
  const courseLiveSessions = LIVE_SESSIONS.filter((s) => s.course_id === course.id);

  const enrollment = store.getEnrollment(course.id);
  const isEnrolled = enrollment?.status === 'active';
  const isPending = enrollment?.status === 'pending';
  const progressPct = store.getCourseProgressPercentage(course.id);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollClick = () => {
    if (course.price_bdt === 0) {
      store.enrollCourse(course.id, true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Courses</span>
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {course.level} Level
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {course.duration_weeks} Weeks Cohort
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Live Zoom Sessions Included
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{course.description}</p>

            {/* Instructor snippet */}
            <div className="flex items-center gap-3 pt-2">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50"
              />
              <div>
                <p className="text-xs text-slate-400">Taught by</p>
                <p className="text-sm font-bold text-white">{course.instructor.name}</p>
                <p className="text-xs text-slate-400">{course.instructor.title}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Card Sidebar */}
          <div className="bg-slate-950/80 border border-slate-700/80 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              <button
                onClick={() => onOpenPlayer(course)}
                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center group transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <PlayCircle className="w-7 h-7" />
                </div>
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Course Fee</p>
              <div className="text-3xl font-extrabold text-white">
                {course.price_bdt === 0 ? 'FREE' : `৳ ${course.price_bdt.toLocaleString()} BDT`}
              </div>
              <p className="text-[11px] text-slate-400">Manual bKash, Nagad or Rocket approval</p>
            </div>

            {/* Action button */}
            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1.5">
                    <span>Your Learning Progress</span>
                    <span className="font-bold">{progressPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onOpenPlayer(course)}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Resume Course</span>
                </button>
              </div>
            ) : isPending ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs">
                  <p className="font-semibold">Payment Verification Pending</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your transaction was submitted. The instructor will verify and activate your account shortly.
                  </p>
                </div>
                <button
                  onClick={() => onOpenPlayer(course)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  Watch Free Preview Lessons
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{course.price_bdt === 0 ? 'Enroll for Free' : 'Enroll Now with bKash/Nagad'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Instant access to preview lessons • 100% money-back satisfaction
                </p>
              </div>
            )}

            {/* Checklist */}
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{course.total_lessons} recorded lessons with lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Weekly live Zoom mentoring & Q&A</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Downloadable sample Excel datasets & templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Certificate with public share link</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Syllabus Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Course Syllabus & Curriculum</h2>
                <p className="text-xs text-slate-400">
                  {courseModules.length} Modules • {courseLessons.length} Total Lessons
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Free previews available</span>
            </div>

            <div className="space-y-4">
              {courseModules.map((module) => {
                const modLessons = courseLessons.filter((l) => l.module_id === module.id);
                const isExpanded = !!expandedModules[module.id];

                return (
                  <div
                    key={module.id}
                    className="border border-slate-800 rounded-xl overflow-hidden bg-slate-850/60 transition-colors"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{module.title}</span>
                        </h3>
                        {module.description && (
                          <p className="text-xs text-slate-400">{module.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-xs text-slate-400 font-medium">{modLessons.length} lessons</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3 pt-0 space-y-2 border-t border-slate-800/80 divide-y divide-slate-800/50">
                        {modLessons.map((lesson) => {
                          const isDone = store.isLessonCompleted(lesson.id);
                          const canPlay = isEnrolled || lesson.is_free_preview;

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => canPlay && onOpenPlayer(course, lesson.id)}
                              className={`pt-2.5 pb-1 px-3 rounded-lg flex items-center justify-between transition-colors ${
                                canPlay
                                  ? 'cursor-pointer hover:bg-slate-800 text-slate-200'
                                  : 'opacity-60 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : canPlay ? (
                                  <PlayCircle className="w-4 h-4 text-teal-400 shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                                )}
                                <div>
                                  <p className="text-xs font-medium text-slate-200">{lesson.title}</p>
                                  <p className="text-[11px] text-slate-400">{lesson.duration_min} mins</p>
                                </div>
                              </div>

                              <div>
                                {lesson.is_free_preview && (
                                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Preview
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side info (Live classes & Resources) */}
        <div className="space-y-6">
          {/* Live Zoom Sessions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Video className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm">Upcoming Live Zoom Labs</h3>
            </div>
            <div className="space-y-3">
              {courseLiveSessions.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {s.language === 'bn' ? 'Bangla' : 'English'} Lab
                  </span>
                  <p className="text-xs font-semibold text-white">{s.title}</p>
                  <p className="text-[11px] text-slate-400">Starts: 8:30 PM (Asia/Dhaka)</p>
                </div>
              ))}
            </div>
          </div>

          {/* Downloadable Materials */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Download className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">Starter Files & Handouts</h3>
            </div>
            <div className="space-y-2.5">
              {courseResources.map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <p className="font-medium text-slate-200 truncate">{res.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{res.file_size}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                    {res.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <PaymentModal
          course={course}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};
