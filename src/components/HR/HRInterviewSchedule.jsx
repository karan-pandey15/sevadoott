'use client';
import { useState } from 'react';
import { CalendarClock, PlusCircle, AlertCircle } from 'lucide-react';

const EMPTY_FORM = { candidateName: '', position: '', dateTime: '', interviewer: '' };

export default function HRInterviewSchedule({ interviews, onSchedule }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate() {
    const errs = {};
    const name = form.candidateName.trim();
    if (!name) errs.candidateName = 'Candidate name is required.';
    else if (name.length > 100) errs.candidateName = 'Must be 100 characters or fewer.';

    const pos = form.position.trim();
    if (!pos) errs.position = 'Position is required.';
    else if (pos.length > 100) errs.position = 'Must be 100 characters or fewer.';

    if (!form.dateTime) {
      errs.dateTime = 'Interview date & time is required.';
    } else {
      const chosen = new Date(form.dateTime);
      if (chosen <= new Date()) errs.dateTime = 'Date & time must be in the future.';
    }

    const iv = form.interviewer.trim();
    if (!iv) errs.interviewer = 'Interviewer name is required.';
    else if (iv.length > 100) errs.interviewer = 'Must be 100 characters or fewer.';

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await onSchedule({
        candidateName: form.candidateName.trim(),
        position: form.position.trim(),
        dateTime: form.dateTime,
        interviewer: form.interviewer.trim(),
      });
      setForm(EMPTY_FORM);
    } finally {
      setLoading(false);
    }
  }

  // Sort newest first
  const sorted = [...interviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Interview Schedule</h2>

      {/* Scheduling Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <PlusCircle size={18} style={{ color: '#1898A5' }} />
          Schedule New Interview
        </h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Candidate Name */}
            <Field
              id="iv-candidate"
              label="Candidate Name"
              error={errors.candidateName}
            >
              <input
                id="iv-candidate"
                type="text"
                maxLength={100}
                value={form.candidateName}
                onChange={(e) => setField('candidateName', e.target.value)}
                placeholder="Full name"
                className={inputCls(errors.candidateName)}
              />
            </Field>

            {/* Position */}
            <Field id="iv-position" label="Position Applied For" error={errors.position}>
              <input
                id="iv-position"
                type="text"
                maxLength={100}
                value={form.position}
                onChange={(e) => setField('position', e.target.value)}
                placeholder="e.g. Software Engineer"
                className={inputCls(errors.position)}
              />
            </Field>

            {/* Date & Time */}
            <Field id="iv-datetime" label="Interview Date & Time" error={errors.dateTime}>
              <input
                id="iv-datetime"
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) => setField('dateTime', e.target.value)}
                className={inputCls(errors.dateTime)}
              />
            </Field>

            {/* Interviewer */}
            <Field id="iv-interviewer" label="Interviewer Name" error={errors.interviewer}>
              <input
                id="iv-interviewer"
                type="text"
                maxLength={100}
                value={form.interviewer}
                onChange={(e) => setField('interviewer', e.target.value)}
                placeholder="Interviewer's name"
                className={inputCls(errors.interviewer)}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60"
            style={{ backgroundColor: '#1898A5' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#147F8A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1898A5'; }}
          >
            {loading ? 'Scheduling…' : 'Schedule Interview'}
          </button>
        </form>
      </div>

      {/* Interview List */}
      <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <CalendarClock size={18} style={{ color: '#1898A5' }} />
        Scheduled Interviews
      </h3>

      {sorted.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <CalendarClock size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No interviews scheduled yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((iv) => (
            <div
              key={iv.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-gray-800">{iv.candidateName}</p>
                <p className="text-sm text-gray-500">{iv.position}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="text-sm font-medium" style={{ color: '#1898A5' }}>
                  {formatDateTime(iv.dateTime)}
                </span>
                <span className="text-xs text-gray-400">Interviewer: {iv.interviewer}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
  }`;
}

function formatDateTime(dt) {
  try {
    return new Date(dt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dt;
  }
}
