'use client';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const STAGE_CARDS = [
  {
    stage: 'Interview Scheduled',
    label: 'Interview Scheduled',
    icon: Clock,
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    stage: 'In Interview',
    label: 'In Interview',
    icon: Users,
    color: '#EAB308',
    bg: '#FEFCE8',
  },
  {
    stage: 'Selected',
    label: 'Selected',
    icon: CheckCircle,
    color: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    stage: 'Rejected',
    label: 'Rejected',
    icon: XCircle,
    color: '#EF4444',
    bg: '#FFF1F2',
  },
];

export default function HROverview({ candidates }) {
  const counts = STAGE_CARDS.reduce((acc, { stage }) => {
    acc[stage] = candidates.filter((c) => c.stage === stage).length;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGE_CARDS.map(({ stage, label, icon: Icon, color, bg }) => (
          <div
            key={stage}
            className="rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100"
            style={{ backgroundColor: bg }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: color + '20' }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color }}>
                {counts[stage] ?? 0}
              </p>
              <p className="text-xs font-medium text-gray-600 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No candidates yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Schedule an interview to add candidates to the pipeline.
          </p>
        </div>
      )}
    </div>
  );
}
