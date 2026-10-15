import React, { useState } from 'react';
import { Video, Calendar, Clock, Copy, Check, ExternalLink, ShieldCheck, Lock, Play } from 'lucide-react';
import { LIVE_SESSIONS, COURSES } from '../data/mockData';
import { store } from '../lib/storage';

export const LiveSessions: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isEnrolled = store.isUserEnrolled('c_excel');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <Video className="w-3.5 h-3.5" />
            <span>Paid Zoom Interactive Sessions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Mentoring & Problem-Solving Labs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Every week, our senior data analysts host live sessions in Bangla to debug formulas, review assignment code,
            and walk through real Bangladeshi business case studies together.
          </p>
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scheduled Live Classes</h2>
          <span className="text-xs text-slate-400">All times shown in Asia/Dhaka (GMT+6)</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {LIVE_SESSIONS.map((session) => {
            const course = COURSES.find((c) => c.id === session.course_id);
            return (
              <div
                key={session.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-all shadow-xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                        {session.language === 'bn' ? 'Bangla Medium' : 'English Medium'}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{course?.title}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{session.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">8:30 PM - 10:00 PM</p>
                      <p className="text-[11px] text-slate-400">Every Sunday (Dhaka)</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{session.topic_summary}</p>

                {/* Zoom Credentials / Access check */}
                {isEnrolled ? (
                  <div className="bg-slate-850 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Meeting ID</span>
                        <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                          <span>{session.meeting_id}</span>
                          <button
                            onClick={() => handleCopy(session.meeting_id || '', `mid_${session.id}`)}
                            className="p-1 hover:text-white text-slate-400"
                            title="Copy Meeting ID"
                          >
                            {copiedId === `mid_${session.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {session.passcode && (
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-sans">Passcode</span>
                          <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                            <span>{session.passcode}</span>
                            <button
                              onClick={() => handleCopy(session.passcode || '', `pass_${session.id}`)}
                              className="p-1 hover:text-white text-slate-400"
                              title="Copy Passcode"
                            >
                              {copiedId === `pass_${session.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <a
                      href={session.meet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all shrink-0"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join via Zoom App</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Zoom meeting links and passcodes are exclusive to enrolled students.</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">Enroll to Join</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Recordings */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h3 className="text-lg font-bold text-white">Past Recorded Zoom Labs</h3>
        <p className="text-xs text-slate-400">
          Missed a live session? All past workshops are recorded and uploaded as unlisted YouTube archives for enrolled
          students.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Orientation & Tool Setup Workshop</p>
                <p className="text-[11px] text-slate-400">Recorded on Oct 12, 2026 • 78 mins</p>
              </div>
            </div>
            <button
              onClick={() => alert('Opening unlisted YouTube recording archive...')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Watch Recording
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">MFS Reconciliation & XLOOKUP Lab</p>
                <p className="text-[11px] text-slate-400">Recorded on Oct 5, 2026 • 92 mins</p>
              </div>
            </div>
            <button
              onClick={() => alert('Opening unlisted YouTube recording archive...')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Watch Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
