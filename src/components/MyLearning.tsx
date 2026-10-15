import React from 'react';
import {
  GraduationCap,
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Video,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import { COURSES, LIVE_SESSIONS, ASSIGNMENTS } from '../data/mockData';
import { Course } from '../types';
import { store } from '../lib/storage';

interface MyLearningProps {
  onOpenPlayer: (course: Course) => void;
  onOpenLive: () => void;
  onOpenAssignments: () => void;
  onOpenCertificates: () => void;
}

export const MyLearning: React.FC<MyLearningProps> = ({
  onOpenPlayer,
  onOpenLive,
  onOpenAssignments,
  onOpenCertificates,
}) => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = store.currentUser;
  const userEnrollments = store.enrollments.filter((e) => e.user_id === currentUser.id);

  const activeEnrollments = userEnrollments.filter((e) => e.status === 'active');
  const pendingEnrollments = userEnrollments.filter((e) => e.status === 'pending');

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Track your active courses, upcoming live Zoom classes, and capstone progress in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Courses</span>
              <span className="text-xl font-bold text-emerald-400">{activeEnrollments.length}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed Lessons</span>
              <span className="text-xl font-bold text-teal-300">{store.completedLessonIds.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Active Enrollments</h2>

        {activeEnrollments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No active courses yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Switch to Rahim Ahmed's profile (top right) or enroll in our flagship Excel Masterclass to start learning!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeEnrollments.map((enr) => {
              const course = COURSES.find((c) => c.id === enr.course_id);
              if (!course) return null;
              const progressPct = store.getCourseProgressPercentage(course.id);

              return (
                <div
                  key={enr.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all shadow-xl space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Active Access
                      </span>
                      <span className="text-slate-400 font-medium">Cohort 2026</span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Curriculum Progress</span>
                        <span className="font-bold text-emerald-400">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Zoom Callout */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="p-3 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-blue-300">
                        <Video className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate">Next Live Zoom: Sunday 8:30 PM (Dhaka)</span>
                      </div>
                      <button
                        onClick={onOpenLive}
                        className="text-[11px] font-bold text-teal-400 hover:text-teal-300 shrink-0 ml-2"
                      >
                        Join
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={onOpenCertificates}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4" />
                        <span>Certificate</span>
                      </button>

                      <button
                        onClick={() => onOpenPlayer(course)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Resume Lessons</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Enrollments */}
      {pendingEnrollments.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>Pending Payment Approvals ({pendingEnrollments.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingEnrollments.map((enr) => {
              const course = COURSES.find((c) => c.id === enr.course_id);
              if (!course) return null;

              return (
                <div
                  key={enr.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">Awaiting Admin Verification</span>
                    <span className="text-[10px] text-slate-400">Manual bKash/Nagad</span>
                  </div>
                  <p className="font-bold text-white text-sm">{course.title}</p>
                  <p className="text-slate-400 leading-relaxed">
                    Your transaction was submitted. The instructor reviews the payment queue multiple times daily. You
                    can watch the free preview lessons in the meantime!
                  </p>
                  <button
                    onClick={() => onOpenPlayer(course)}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                  >
                    Watch Preview Lessons
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
