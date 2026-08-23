'use client';
import { useState } from 'react';
import { Users, AlertCircle } from 'lucide-react';

const STAGES = ['Interview Scheduled', 'In Interview', 'Selected', 'Rejected'];

const BADGE_COLORS = {
  'Interview Scheduled': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
  'In Interview':        { bg: '#FEFCE8', text: '#EAB308', border: '#FEF08A' },
  'Selected':            { bg: '#F0FDF4', text: '#22C55E', border: '#BBF7D0' },
  'Rejected':            { bg: '#FFF1F2', text: '#EF4444', border: '#FECDD3' },
};

export default function HRCandidates({ candidates, onStageChange }) {
  const [filter, setFilter] = useState('');
  const [rowErrors, setRowErrors] = useState({});

  const displayed = filter
    ? candidates.filter((c) => c.stage === filter)
    : candidates;

  async function handleStageChange(candidateId, newStage) {
    setRowErrors((e) => { const n = { ...e }; delete n[candidateId]; return n; });
    const result = await onStageChange(candidateId, newStage);
    if (result && !result.ok) {
      setRowErrors((e) => ({
        ...e,
        [candidateId]: result.error || 'Failed to update stage.',
      }));
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Candidates</h2>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] bg-white"
            aria-label="Filter by pipeline stage"
          >
            <option value="">All Candidates</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No candidates have been added yet</p>
          <p className="text-sm text-gray-400 mt-1">Schedule an interview to add candidates.</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <AlertCircle size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No candidates match the selected filter</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Candidate</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Position</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Interviewer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((c) => {
                const badge = BADGE_COLORS[c.stage] || BADGE_COLORS['Interview Scheduled'];
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition bg-white">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.position}</td>
                    <td className="px-4 py-3 text-gray-600">{c.interviewer}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                          borderColor: badge.border,
                        }}
                      >
                        {c.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <select
                          value={c.stage}
                          onChange={(e) => handleStageChange(c.id, e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1898A5] bg-white"
                          aria-label={`Change stage for ${c.name}`}
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {rowErrors[c.id] && (
                          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} /> {rowErrors[c.id]}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
