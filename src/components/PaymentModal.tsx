import React, { useState } from 'react';
import { X, Copy, Check, AlertCircle, ShieldCheck, Wallet } from 'lucide-react';
import { Course, PaymentMethod } from '../types';
import { store } from '../lib/storage';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState(store.currentUser.phone || '');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentNumbers = {
    bkash: { number: '01712345678', type: 'bKash Personal / Send Money', color: 'from-pink-600 to-rose-600' },
    nagad: { number: '01998765432', type: 'Nagad Personal / Send Money', color: 'from-amber-600 to-orange-600' },
    rocket: { number: '017123456789', type: 'Rocket Personal', color: 'from-purple-600 to-indigo-600' },
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!senderNumber || senderNumber.length < 11) {
      setError('Please enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }
    if (!trxId || trxId.trim().length < 6) {
      setError('Please enter a valid Transaction ID (TrxID) from your SMS.');
      return;
    }

    setIsSubmitting(true);

    // Create or get enrollment
    const enrollment = store.enrollCourse(course.id, false);

    // Submit payment
    const res = store.submitPayment({
      enrollmentId: enrollment.id,
      courseId: course.id,
      courseTitle: course.title,
      method,
      amount: course.price_bdt,
      senderNumber: senderNumber.trim(),
      trxId: trxId.trim(),
    });

    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Failed to submit payment.');
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Course Enrollment & Payment</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{course.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Total Course Fee</span>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
              <span>৳ {course.price_bdt.toLocaleString('en-US')}</span>
              <span className="text-xs font-normal text-slate-400">BDT (One-Time)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Access
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Method selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              1. Select Mobile Banking Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['bkash', 'nagad', 'rocket'] as PaymentMethod[]).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                    method === m
                      ? 'border-emerald-500 bg-emerald-500/10 text-white font-semibold ring-1 ring-emerald-500'
                      : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="capitalize font-bold text-sm block">
                    {m === 'bkash' ? 'bKash' : m === 'nagad' ? 'Nagad' : 'Rocket'}
                  </span>
                  <span className="text-[10px] text-slate-400">Send Money</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment instructions */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-medium text-slate-400">
                Send ৳{course.price_bdt} to this {method.toUpperCase()} number:
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Personal</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
              <span className="font-mono text-base font-bold text-white tracking-wider">
                {paymentNumbers[method].number}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(paymentNumbers[method].number)}
                className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 px-2 py-1 rounded bg-teal-500/10 border border-teal-500/20"
              >
                {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Use the <strong className="text-slate-200">Send Money</strong> option in your {method} app. Keep the
              TrxID from the confirmation SMS handy.
            </p>
          </div>

          {/* Form inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Sender Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Transaction ID (TrxID) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 9K48BL201A"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 uppercase font-mono tracking-wider"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50 flex items-start gap-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Payment for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
