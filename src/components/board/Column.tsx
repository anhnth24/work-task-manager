import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { type Status, type Task } from '@/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/utils/misc';
import { useUIStore } from '@/store/useUIStore';

interface ColumnProps {
  status: Status;
  label: string;
  tasks: Task[];
}

export function Column({ status, label, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const { openTaskModal } = useUIStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {label}
          </h2>
          <span className="px-2 py-0.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openTaskModal('create')}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label={`Add task to ${label}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-3 p-3 rounded-lg transition-colors overflow-y-auto scrollbar-thin',
          isOver && 'bg-primary-50 dark:bg-primary-900/20'
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
