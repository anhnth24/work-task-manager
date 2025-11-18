import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Trash2, Edit } from 'lucide-react';
import { type Task, PRIORITY_CONFIG } from '@/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useUsersStore } from '@/store/useUsersStore';
import { useTagsStore } from '@/store/useTagsStore';
import { useUIStore } from '@/store/useUIStore';
import { formatDate, isOverdue, isDueSoon } from '@/utils/date';
import { cn } from '@/utils/misc';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: task.id });
  const { getUserById } = useUsersStore();
  const { getTagByName } = useTagsStore();
  const { openTaskModal, openDeleteConfirm } = useUIStore();

  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;
  const priorityConfig = PRIORITY_CONFIG.find((p) => p.id === task.priority);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTaskModal('edit', task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteConfirm(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card dark:shadow-card-dark',
        'border border-gray-200 dark:border-gray-700',
        'cursor-grab active:cursor-grabbing',
        'hover:shadow-card-hover dark:hover:shadow-card-hover-dark transition-shadow',
        isDragging && 'rotate-2 scale-105'
      )}
      onClick={() => openTaskModal('edit', task.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
          {task.title}
        </h3>
        {priorityConfig && (
          <Badge className={cn('flex-shrink-0', priorityConfig.bgColor, priorityConfig.color)}>
            {priorityConfig.label}
          </Badge>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tagName) => {
            const tagData = getTagByName(tagName);
            const color = tagData?.color || '#64748b';
            return (
              <span
                key={tagName}
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: color + '20',
                  color: color,
                }}
              >
                {tagName}
              </span>
            );
          })}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee && <Avatar name={assignee.name} src={assignee.avatar} size="sm" />}
          {task.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                isOverdue(task.dueDate)
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded'
                  : isDueSoon(task.dueDate)
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded'
                  : 'text-gray-600 dark:text-gray-400'
              )}
              title={isOverdue(task.dueDate) ? 'Overdue' : isDueSoon(task.dueDate) ? 'Due soon (within 3 days)' : 'Due date'}
            >
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate, 'MMM d')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            aria-label="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
