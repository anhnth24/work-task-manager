import { Moon, Sun, Search } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useFiltersStore } from '@/store/useFiltersStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function Header() {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { filters, setFilters } = useFiltersStore();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filters.query}
              onChange={(e) => setFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
