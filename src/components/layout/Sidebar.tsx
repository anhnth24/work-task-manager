import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Kanban, Settings } from 'lucide-react';
import { cn } from '@/utils/misc';
import { StickyNotes } from '@/components/notes/StickyNotes';

export function Sidebar() {
  const location = useLocation();

  const links = [
    { to: '/', icon: Kanban, label: 'Board' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📋 TaskFlow
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sticky Notes Section */}
      <div className="flex-1 border-t border-gray-200 dark:border-gray-700 overflow-hidden">
        <StickyNotes />
      </div>
    </aside>
  );
}
