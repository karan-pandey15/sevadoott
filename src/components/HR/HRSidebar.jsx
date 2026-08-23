'use client';
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  FileText,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'interviews',    label: 'Interview Schedule', icon: CalendarClock   },
  { id: 'candidates',    label: 'Candidates',         icon: Users           },
  { id: 'offer-letters', label: 'Offer Letters',      icon: FileText        },
  { id: 'settings',      label: 'Settings',           icon: Settings        },
];

export default function HRSidebar({ activeSection, onNavigate, isCollapsed }) {
  return (
    <aside
      style={{ backgroundColor: '#1898A5', minHeight: '100vh', width: isCollapsed ? 64 : 240 }}
      className="flex flex-col shrink-0 transition-all duration-200"
      aria-label="HR navigation"
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b border-white/20"
        style={{ minHeight: 64 }}
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white font-bold text-sm">
          HR
        </div>
        {!isCollapsed && (
          <span className="text-white font-bold text-base truncate">HR Portal</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left"
              style={{
                backgroundColor: isActive ? '#106670' : 'transparent',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#147F8A';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
