import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Users,
  Search,
  AlertCircle,
  Check,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';
import { store } from '../lib/storage';
import { Payment, Submission } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'submissions' | 'students'>('payments');
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('Great effort on the dashboard! Clear KPI metrics and solid data model.');
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const payments = store.payments;
  const submissions = store.submissions;
  const enrollments = store.enrollments;

  const pendingPayments = payments.filter((p) => p.status === 'submitted');
  const verifiedPayments = payments.filter((p) => p.status === 'verified');
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted');

  const handleVerifyPayment = (payment: Payment) => {
    store.verifyPayment(payment.id, 'Verified in bKash/Nagad app. Enrollment activated.');
    setToastMsg(`Approved payment for ${payment.user_name} (${payment.trx_id}). Student is now Active!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleRejectPayment = (payment: Payment) => {
    const note = prompt('Enter rejection reason for student (e.g. TrxID not found in SMS statement):');
    if (note) {
      store.rejectPayment(payment.id, note);
      setToastMsg(`Payment rejected for ${payment.user_name}.`);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleSaveGrade = (submission: Submission) => {
    store.gradeSubmission(submission.id, scoreInput, feedbackInput, false);
    setGradingSubId(null);
    setToastMsg(`Graded ${submission.user_name}'s assignment: ${scoreInput}/100.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-900/90 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instructor & Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Verify manual bKash/Nagad transactions, grade capstone projects, manage course rosters, and approve certificates.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Payments</span>
              <span className="text-xl font-bold text-amber-400">{pendingPayments.length}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Submissions</span>
              <span className="text-xl font-bold text-blue-400">{pendingSubmissions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Payment Approvals</span>
          {pendingPayments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-extrabold">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Assignment Grading</span>
          {pendingSubmissions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-extrabold">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Enrollments ({enrollments.length})</span>
        </button>
      </div>

      {/* TAB 1: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">bKash / Nagad / Rocket Verification Queue</h2>
              <p className="text-xs text-slate-400">
                Check incoming SMS on your phone or MFS Merchant App against the submitted TrxID.
              </p>
            </div>
          </div>

          {/* Pending Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Needs Verification ({pendingPayments.length})
              </span>
              <span className="text-[11px] text-slate-400">Unique TrxID enforced by database</span>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No pending payments! All student transactions have been verified.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {pendingPayments.map((p) => (
                  <div key={p.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {p.method}
                        </span>
                        <span className="text-xs font-bold text-white">{p.user_name}</span>
                        <span className="text-xs text-slate-400">({p.user_email})</span>
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold">{p.course_title}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                        <div>
                          <span className="text-slate-500 text-[10px] block font-sans">Sender Mobile:</span>
                          <span className="font-bold text-white">{p.sender_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-sans">Transaction ID:</span>
                          <span className="font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                            {p.trx_id}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-sans">Amount:</span>
                          <span className="font-bold text-white">৳ {p.amount_bdt} BDT</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRejectPayment(p)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(p)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify & Activate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-850 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recent Verified Payments ({verifiedPayments.length})
              </span>
            </div>
            <div className="divide-y divide-slate-800 text-xs">
              {verifiedPayments.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between text-slate-300">
                  <div>
                    <span className="font-bold text-white mr-2">{p.user_name}</span>
                    <span className="text-slate-400">({p.sender_number})</span>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      TrxID: {p.trx_id} • ৳{p.amount_bdt} via {p.method}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active & Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Student Project Grading</h2>
            <p className="text-xs text-slate-400">
              Download student workbooks, review dashboards against rubric criteria, and assign marks.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800">
            {submissions.map((sub) => {
              const isGradingThis = gradingSubId === sub.id;

              return (
                <div key={sub.id} className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{sub.user_name}</span>
                        <span className="text-xs text-slate-400 font-mono">Attempt #{sub.attempt}</span>
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold">{sub.assignment_title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        File: {sub.original_name} ({sub.file_size_formatted})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alert(`Simulating file download of: ${sub.original_name}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-teal-400" />
                        <span>Download Work</span>
                      </button>

                      {sub.status === 'graded' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Score: {sub.score} / 100
                        </span>
                      ) : (
                        <button
                          onClick={() => setGradingSubId(isGradingThis ? null : sub.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow"
                        >
                          Grade Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grading Drawer / Form */}
                  {isGradingThis && (
                    <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 space-y-4 text-xs animate-in fade-in">
                      <h4 className="font-bold text-white">Grade Student Submission</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-slate-400 text-[11px] font-medium mb-1">
                            Score (Max 100)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scoreInput}
                            onChange={(e) => setScoreInput(Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-slate-400 text-[11px] font-medium mb-1">
                            Instructor Feedback
                          </label>
                          <input
                            type="text"
                            value={feedbackInput}
                            onChange={(e) => setFeedbackInput(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setGradingSubId(null)}
                          className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveGrade(sub)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                        >
                          Submit Grade & Notify
                        </button>
                      </div>
                    </div>
                  )}

                  {sub.feedback && (
                    <p className="text-xs text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      Feedback: "{sub.feedback}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Enrolled Students Roster</h2>
            <p className="text-xs text-slate-400">Total active course learners and progression rates.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {enrollments.map((e) => {
                  const student = store.currentUser.id === e.user_id ? store.currentUser : null;
                  const studentName = student?.name || (e.user_id === 'usr_student_1' ? 'Rahim Ahmed' : 'Nusrat Jahan');
                  const progressPct = store.getCourseProgressPercentage(e.course_id);

                  return (
                    <tr key={e.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4 font-semibold text-white">{studentName}</td>
                      <td className="p-4 text-slate-300">Excel Data Analytics</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            e.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
                          </div>
                          <span className="font-mono text-[11px]">{progressPct}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => alert(`Viewing profile for ${studentName}`)}
                          className="text-xs text-teal-400 hover:underline font-semibold"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
