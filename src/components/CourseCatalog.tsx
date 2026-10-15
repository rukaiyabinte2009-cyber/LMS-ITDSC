import React, { useState } from 'react';
import { BookOpen, Clock, Users, PlayCircle, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { store } from '../lib/storage';
import { PaymentModal } from './PaymentModal';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onOpenPlayer: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ onSelectCourse, onOpenPlayer }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [payingCourse, setPayingCourse] = useState<Course | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Excel', 'Python', 'Databases', 'Business Intelligence'];

  const filteredCourses = selectedCategory === 'All'
    ? COURSES
    : COURSES.filter((c) => c.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())));

  const handleEnrollClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    if (course.price_bdt === 0) {
      // Free course auto-enrolls
      store.enrollCourse(course.id, true);
      setToastMessage(`Enrolled successfully in ${course.title}!`);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setPayingCourse(course);
    }
  };

  return (
    <div className="space-y-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-900/90 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IT Data Science Academy • Bangladesh</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Practical Data Skills for the <span className="text-emerald-400">Bangladeshi Job Market</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Short, focused, cohort-based courses. Learn via recorded bite-sized lessons, weekly live Zoom problem-solving
            sessions, instructor-reviewed assignments, and verifiable digital certificates.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Manual bKash / Nagad Instant Enrollment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Live Zoom Classes (Bangla & English)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Verifiable Certificate ID</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Available Courses</h2>
          <p className="text-xs text-slate-400">Explore curated standalone training programs</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const enrollment = store.getEnrollment(course.id);
          const isEnrolled = enrollment?.status === 'active';
          const isPending = enrollment?.status === 'pending';
          const progressPct = store.getCourseProgressPercentage(course.id);

          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                {/* Level Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
                    {course.level}
                  </span>
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 right-3">
                  {isEnrolled ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enrolled ({progressPct}%)
                    </span>
                  ) : isPending ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Pending Approval
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                      {course.price_bdt === 0 ? 'FREE' : `৳ ${course.price_bdt.toLocaleString()} BDT`}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                {/* Course Metadata */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{course.total_hours} Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>{course.total_lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Weekly Zoom</span>
                    </div>
                  </div>

                  {/* Instructor Bio Snippet */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-700"
                      />
                      <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
                        {course.instructor.name}
                      </span>
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPlayer(course);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-1"
                      >
                        <span>Learn</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleEnrollClick(e, course)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold'
                        }`}
                      >
                        <span>{isPending ? 'View Status' : course.price_bdt === 0 ? 'Enroll Free' : 'Enroll'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {payingCourse && (
        <PaymentModal
          course={payingCourse}
          onClose={() => setPayingCourse(null)}
          onSuccess={() => {
            setPayingCourse(null);
            setToastMessage(`Payment submitted for ${payingCourse.title}! Awaiting admin verification.`);
            setTimeout(() => setToastMessage(null), 4000);
          }}
        />
      )}
    </div>
  );
};
