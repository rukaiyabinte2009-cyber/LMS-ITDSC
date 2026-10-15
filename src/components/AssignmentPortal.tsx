import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  FileSpreadsheet,
} from 'lucide-react';
import { ASSIGNMENTS, COURSES } from '../data/mockData';
import { store } from '../lib/storage';
import { Submission } from '../types';

export const AssignmentPortal: React.FC = () => {
  const assignment = ASSIGNMENTS[0];
  const course = COURSES.find((c) => c.id === assignment.course_id);

  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileSize, setSelectedFileSize] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = store.currentUser;
  const userSubmissions = store.submissions.filter(
    (s) => s.assignment_id === assignment.id && s.user_id === currentUser.id
  );
  const latestSubmission: Submission | undefined = userSubmissions[0];

  const handleSimulateFilePick = () => {
    const sampleNames = [
      `${currentUser.name.replace(/\s+/g, '_')}_Excel_Dashboard_Final.xlsx`,
      `${currentUser.name.replace(/\s+/g, '_')}_Capstone_v2.xlsx`,
    ];
    const picked = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    setSelectedFileName(picked);
    setSelectedFileSize(3840000); // 3.84 MB
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileName) {
      alert('Please select an Excel workbook (.xlsx) to submit.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      store.submitAssignment({
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        originalName: selectedFileName,
        fileSizeBytes: selectedFileSize,
        fileSizeFormatted: `${(selectedFileSize / (1024 * 1024)).toFixed(2)} MB`,
      });
      setIsSubmitting(false);
      setSelectedFileName('');
      setToastMsg('Assignment submitted successfully! Added to instructor grading queue.');
      setTimeout(() => setToastMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-900/90 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Graded Capstone Project</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Assignments & Portfolio Projects
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Real datasets, real business challenges. Each submission is manually reviewed by our senior data
            instructors with comprehensive rubrics and actionable feedback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Assignment Brief */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {course?.title}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{assignment.title}</h2>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Pass Requirement</span>
                <span className="text-sm font-bold text-white">
                  {assignment.pass_score} / {assignment.max_score} pts
                </span>
              </div>
            </div>

            {/* Starter Data Download Callout */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Starter Dataset (.XLSX)</p>
                  <p className="text-[11px] text-slate-400">Raw_Sales_Data_Bangladesh_2026.xlsx (4.8 MB)</p>
                </div>
              </div>
              <button
                onClick={() => alert('Downloading starter dataset...')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Dataset</span>
              </button>
            </div>

            {/* Markdown Instructions */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <div className="whitespace-pre-line bg-slate-950 p-5 rounded-xl border border-slate-800/80">
                {assignment.instructions_md}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Upload & Submission Status */}
        <div className="space-y-6">
          {/* Submission Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white">Submit Your Project</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                onClick={handleSimulateFilePick}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-850/50 hover:bg-slate-850"
              >
                <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Click to select your Excel file</p>
                <p className="text-[11px] text-slate-400 mt-1">.XLSX, .XLS, or .CSV (Max 10 MB)</p>
              </div>

              {selectedFileName && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-300">
                  <div className="truncate mr-2">
                    <p className="font-semibold truncate">{selectedFileName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(selectedFileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20">
                    Ready
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedFileName}
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Uploading to Server...' : 'Submit for Grading'}
              </button>
            </form>
          </div>

          {/* Previous Submissions & Grades */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Your Submission Status</h3>

            {latestSubmission ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono text-[11px]">Attempt #{latestSubmission.attempt}</span>
                    {latestSubmission.status === 'graded' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Graded: {latestSubmission.score} / 100
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Under Review
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-white truncate">{latestSubmission.original_name}</p>
                    <p className="text-[11px] text-slate-400">{latestSubmission.file_size_formatted}</p>
                  </div>

                  {latestSubmission.feedback && (
                    <div className="pt-2 border-t border-slate-700/80 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instructor Feedback:</p>
                      <p className="text-slate-300 text-xs italic bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                        "{latestSubmission.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-6 border border-slate-800 rounded-xl text-slate-500 text-xs">
                No submissions yet. Complete your dashboard and submit above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
