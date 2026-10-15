import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CourseCatalog } from './components/CourseCatalog';
import { CourseDetail } from './components/CourseDetail';
import { LessonPlayer } from './components/LessonPlayer';
import { LiveSessions } from './components/LiveSessions';
import { AssignmentPortal } from './components/AssignmentPortal';
import { CertificateView } from './components/CertificateView';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseDeploymentGuide } from './components/DatabaseDeploymentGuide';
import { MyLearning } from './components/MyLearning';
import { Course } from './types';
import { COURSES } from './data/mockData';
import { store } from './lib/storage';
import { RotateCcw, Database, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
  const [initialLessonId, setInitialLessonId] = useState<string | undefined>(undefined);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleOpenCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setPlayingCourse(null);
  };

  const handleOpenPlayer = (course: Course, lessonId?: string) => {
    setPlayingCourse(course);
    setInitialLessonId(lessonId);
    setSelectedCourse(null);
  };

  const handleNavTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedCourse(null);
    setPlayingCourse(null);
  };

  const handleResetData = () => {
    if (confirm('Reset demo state to default initial students, payments, and enrollments?')) {
      store.resetAllData();
      alert('Data reset to defaults.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavTabChange}
        openDbGuide={() => {
          setCurrentTab('dbguide');
          setSelectedCourse(null);
          setPlayingCourse(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {playingCourse ? (
          <LessonPlayer
            course={playingCourse}
            initialLessonId={initialLessonId}
            onBack={() => setPlayingCourse(null)}
            onOpenLive={() => {
              setPlayingCourse(null);
              setCurrentTab('live');
            }}
          />
        ) : selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onOpenPlayer={handleOpenPlayer}
          />
        ) : (
          <>
            {currentTab === 'courses' && (
              <CourseCatalog
                onSelectCourse={handleOpenCourseDetail}
                onOpenPlayer={handleOpenPlayer}
              />
            )}
            {currentTab === 'mylearning' && (
              <MyLearning
                onOpenPlayer={handleOpenPlayer}
                onOpenLive={() => setCurrentTab('live')}
                onOpenAssignments={() => setCurrentTab('assignments')}
                onOpenCertificates={() => setCurrentTab('certificates')}
              />
            )}
            {currentTab === 'live' && <LiveSessions />}
            {currentTab === 'assignments' && <AssignmentPortal />}
            {currentTab === 'certificates' && <CertificateView />}
            {currentTab === 'admin' && <AdminDashboard />}
            {currentTab === 'dbguide' && (
              <DatabaseDeploymentGuide onClose={() => setCurrentTab('courses')} />
            )}
          </>
        )}
      </main>

      {/* Bottom Footer & Environment Callout */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Learn - IT Data Science</span>
            <span>•</span>
            <span>learn.itdatascience.com</span>
            <span>•</span>
            <span>Dhaka, Bangladesh</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setCurrentTab('dbguide');
                setSelectedCourse(null);
                setPlayingCourse(null);
              }}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>cPanel & PostgreSQL Architecture</span>
            </button>
            <button
              onClick={handleResetData}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
              title="Reset sample data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
