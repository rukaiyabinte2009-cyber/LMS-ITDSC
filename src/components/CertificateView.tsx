import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Printer, Search, ExternalLink, Sparkles } from 'lucide-react';
import { store } from '../lib/storage';
import { Certificate } from '../types';

export const CertificateView: React.FC = () => {
  const [verifyCode, setVerifyCode] = useState('');
  const [searchResult, setSearchResult] = useState<Certificate | null | 'not_found'>(null);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = store.currentUser;
  const userCertificates = store.certificates.filter((c) => c.user_id === currentUser.id);
  const activeCert = userCertificates[0];

  const handleClaimCertificate = () => {
    store.generateCertificate('c_excel');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const code = verifyCode.trim().toUpperCase();
    const found = store.certificates.find((c) => c.code.toUpperCase() === code);
    setSearchResult(found || 'not_found');
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Verifiable Credential</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Certificates of Completion
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Earn an official certificate from IT Data Science upon completing all modules and scoring &ge; 50% on your
              graded capstone assignment. Every certificate features a permanent public verification hash.
            </p>
          </div>

          {!activeCert && (
            <button
              onClick={handleClaimCertificate}
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Excel Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Certificate Display Canvas */}
      {activeCert ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Previewing Your Issued Certificate</span>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Certificate Board */}
          <div className="relative rounded-3xl border-8 border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-14 text-center shadow-2xl text-slate-100 overflow-hidden">
            <div className="absolute inset-0 border-2 border-amber-500/30 m-3 sm:m-5 rounded-2xl pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Seal & Logo */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950 font-bold">
                <Award className="w-9 h-9" />
              </div>
              <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                IT Data Science Academy • Bangladesh
              </p>
              <p className="text-2xl sm:text-3xl font-serif tracking-tight text-white font-bold">
                Certificate of Completion
              </p>
            </div>

            <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">This is proudly presented to</p>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 py-1 font-serif">
              {activeCert.user_name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
              for successfully completing the comprehensive professional program and capstone project in
            </p>

            <h3 className="text-lg sm:text-2xl font-bold text-emerald-400 mt-2 font-sans tracking-tight">
              {activeCert.course_title}
            </h3>

            <div className="mt-8 pt-8 border-t border-slate-800/80 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Issue Date</p>
                <p className="font-semibold text-slate-200 mt-1">October 8, 2026</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verification ID</p>
                <p className="font-mono font-bold text-amber-400 mt-1">{activeCert.code}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Result</p>
                <p className="font-semibold text-emerald-400 mt-1">{activeCert.grade_text}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-12 text-center pt-4">
              <div>
                <div className="w-36 h-0.5 bg-slate-700 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-200">Engr. Tanvir Hasan</p>
                <p className="text-[10px] text-slate-400">Lead Instructor</p>
              </div>
              <div>
                <div className="w-36 h-0.5 bg-slate-700 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-200">Dr. Shahriar Kabir</p>
                <p className="text-[10px] text-slate-400">Director, ITDS Academy</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <p className="text-sm font-semibold text-white">No Certificate Issued Yet for this Profile</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Switch to Rahim Ahmed's profile (from the top-right switcher) or click the "Claim Excel Certificate" button
            above to preview how the certificate is rendered!
          </p>
        </div>
      )}

      {/* Public Verification Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base">Public Certificate Verification Tool</h3>
        </div>
        <p className="text-xs text-slate-400">
          Employers, institutions, and recruiters can verify any student's credential by entering the certificate code
          below (e.g. <span className="font-mono text-amber-300">ITDS-EXCEL-2026-8942</span>):
        </p>

        <form onSubmit={handleVerify} className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder="ITDS-EXCEL-2026-8942"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs uppercase focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Verify</span>
          </button>
        </form>

        {searchResult && searchResult !== 'not_found' && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valid Verified Credential Found</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Student Name</span>
                <span className="font-semibold text-white">{searchResult.user_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Course</span>
                <span className="font-semibold text-white">{searchResult.course_title}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Issued</span>
                <span className="font-semibold text-white">October 2026</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Verification Code</span>
                <span className="font-mono text-amber-400 font-bold">{searchResult.code}</span>
              </div>
            </div>
          </div>
        )}

        {searchResult === 'not_found' && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
            No certificate found matching code "{verifyCode}". Please check for typos.
          </div>
        )}
      </div>
    </div>
  );
};
