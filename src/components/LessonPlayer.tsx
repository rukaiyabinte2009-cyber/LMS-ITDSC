import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  Lock,
  Download,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Video,
  Award,
} from 'lucide-react';
import { Course, Lesson, Module } from '../types';
import { MODULES, LESSONS, RESOURCES } from '../data/mockData';
import { store } from '../lib/storage';
import { PaymentModal } from './PaymentModal';

interface LessonPlayerProps {
  course: Course;
  initialLessonId?: string;
  onBack: () => void;
  onOpenLive: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  course,
  initialLessonId,
  onBack,
  onOpenLive,
}) => {
  const courseLessons = LESSONS.filter((l) => l.course_id === course.id);
  const courseModules = MODULES.filter((m) => m.course_id === course.id);
  const courseResources = RESOURCES.filter((r) => r.course_id === course.id);

  const defaultLesson =
    courseLessons.find((l) => l.id === initialLessonId) || courseLessons[0];
  const [activeLesson, setActiveLesson] = useState<Lesson>(defaultLesson);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources'>('notes');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const enrollment = store.getEnrollment(course.id);
  const isEnrolled = enrollment?.status === 'active';
  const isPending = enrollment?.status === 'pending';
  const progressPct = store.getCourseProgressPercentage(course.id);
  const isCurrentLessonDone = store.isLessonCompleted(activeLesson.id);

  const canAccessLesson = isEnrolled || activeLesson.is_free_preview;

  const handleToggleComplete = () => {
    store.toggleLessonCompletion(activeLesson.id);
  };

  // Find next and prev lessons
  const currentIndex = courseLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              {course.title}
            </span>
            <h1 className="text-base font-bold text-white truncate max-w-lg">{activeLesson.title}</h1>
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-white">Course Progress: {progressPct}%</div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleToggleComplete}
            disabled={!canAccessLesson}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isCurrentLessonDone
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isCurrentLessonDone ? (
              <>
                <Check className="w-4 h-4" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Complete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Player + Navigation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video & Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Container */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 relative shadow-2xl">
            {canAccessLesson && activeLesson.youtube_id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtube_id}?autoplay=0&rel=0&modestbranding=1`}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-bold text-white">This Lesson is Locked</h3>
                  <p className="text-xs text-slate-400">
                    {isPending
                      ? 'Your manual bKash/Nagad payment is pending verification by the instructor. You will gain full access upon approval.'
                      : 'Enroll in this course to unlock all 14 video lessons, live Zoom lab access, starter Excel files, and your certificate.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                >
                  {isPending ? 'Check Payment Status' : 'Enroll Now (৳ 1,500 BDT)'}
                </button>
              </div>
            )}
          </div>

          {/* Navigation Prev / Next bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => prevLesson && setActiveLesson(prevLesson)}
              disabled={!prevLesson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </button>

            <span className="text-slate-400 font-mono text-[11px]">
              Lesson {currentIndex + 1} of {courseLessons.length}
            </span>

            <button
              onClick={() => nextLesson && setActiveLesson(nextLesson)}
              disabled={!nextLesson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lesson Details Tabs (Notes & Resources) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center space-x-2 text-xs font-bold pb-1 transition-all ${
                  activeTab === 'notes'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Lesson Notes & Formulas</span>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center space-x-2 text-xs font-bold pb-1 transition-all ${
                  activeTab === 'resources'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Downloadable Practice Files ({courseResources.length})</span>
              </button>
            </div>

            {activeTab === 'notes' ? (
              <div className="prose prose-invert prose-xs max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 font-sans">
                <div className="whitespace-pre-line font-normal">{activeLesson.notes_md}</div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Practice alongside the instructor using the official training files:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {courseResources.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-between text-xs hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[10px]">
                          {res.type}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{res.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {res.file_name} • {res.file_size}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading ${res.file_name}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Curriculum Navigation Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white">Course Syllabus</h3>
              <span className="text-[11px] text-slate-400">
                {courseLessons.length} Lessons • {course.total_hours} hrs
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {courseModules.map((module) => {
                const modLessons = courseLessons.filter((l) => l.module_id === module.id);
                return (
                  <div key={module.id} className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">
                      {module.title}
                    </p>
                    <div className="space-y-1">
                      {modLessons.map((l) => {
                        const isCurrent = l.id === activeLesson.id;
                        const isDone = store.isLessonCompleted(l.id);
                        const canAccess = isEnrolled || l.is_free_preview;

                        return (
                          <button
                            key={l.id}
                            onClick={() => setActiveLesson(l)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                              isCurrent
                                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate mr-2">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : canAccess ? (
                                <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{l.title}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {l.is_free_preview && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  Free
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">{l.duration_min}m</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Zoom Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-blue-400">
              <Video className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Zoom Classes</span>
            </div>
            <p className="text-xs text-slate-300">
              Weekly live troubleshooting labs are conducted in Bangla every Sunday at 8:30 PM (Dhaka Time).
            </p>
            <button
              onClick={onOpenLive}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-1"
            >
              <span>View Zoom Schedule & Links</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          course={course}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};
