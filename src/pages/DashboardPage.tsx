import { useTasksStore } from '@/store/useTasksStore';
import { getTaskCountsByStatus } from '@/utils/tasks';
import { Badge } from '@/components/ui/Badge';

export function DashboardPage() {
  const tasks = useTasksStore((state) => state.tasks);
  const taskCounts = getTaskCountsByStatus(tasks);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
            </div>
            <Badge variant="default">All</Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">To Do</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskCounts.todo}</p>
            </div>
            <Badge>Todo</Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {taskCounts.in_progress}
              </p>
            </div>
            <Badge variant="warning">Active</Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {taskCounts.done}
              </p>
            </div>
            <Badge variant="success">Done</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
