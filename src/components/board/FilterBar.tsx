import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useFiltersStore } from '@/store/useFiltersStore';
import { useUsersStore } from '@/store/useUsersStore';
import { ALL_TAGS, PRIORITY_CONFIG } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '@/utils/misc';

export function FilterBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, resetFilters, toggleTag, togglePriority, toggleAssignee } = useFiltersStore();
  const { users } = useUsersStore();

  const activeFilterCount = 
    filters.assignees.length + 
    filters.tags.length + 
    filters.priorities.length;

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assignees */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Assignees
              </h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.assignees.includes(user.id)}
                      onChange={() => toggleAssignee(user.id)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      filters.tags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Priorities
              </h3>
              <div className="space-y-2">
                {PRIORITY_CONFIG.map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => togglePriority(priority.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors',
                      filters.priorities.includes(priority.id)
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-600'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <span className={cn('text-sm font-medium', priority.color)}>
                      {priority.label}
                    </span>
                    {filters.priorities.includes(priority.id) && (
                      <span className="text-primary-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2">
          {filters.assignees.map((userId) => {
            const user = users.find((u) => u.id === userId);
            return user ? (
              <Badge key={userId} className="flex items-center gap-1">
                {user.name}
                <button
                  onClick={() => toggleAssignee(userId)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filters.tags.map((tag) => (
            <Badge key={tag} className="flex items-center gap-1" variant="default">
              {tag}
              <button onClick={() => toggleTag(tag)} className="ml-1 hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.priorities.map((priority) => {
            const config = PRIORITY_CONFIG.find((p) => p.id === priority);
            return config ? (
              <Badge key={priority} className="flex items-center gap-1" variant="warning">
                {config.label}
                <button
                  onClick={() => togglePriority(priority)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
