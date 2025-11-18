import { useState } from 'react';
import { TagManager } from '@/components/settings/TagManager';
import { UserManager } from '@/components/settings/UserManager';
import { cn } from '@/utils/misc';

type TabType = 'tags' | 'users';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tags');

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('tags')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'tags'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            🏷️ Tag Manager
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'users'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            👥 User Manager
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'tags' && <TagManager />}
        {activeTab === 'users' && <UserManager />}
      </div>
    </div>
  );
}
