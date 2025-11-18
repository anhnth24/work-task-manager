import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { STATUS_CONFIG, type Task } from '@/types';
import { useTasksStore } from '@/store/useTasksStore';
import { useFilteredTasks } from '@/hooks/useFilteredTasks';
import { groupByStatus } from '@/utils/tasks';
import { Column } from './Column';
import { TaskCard } from './TaskCard';

export function Board() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const filteredTasks = useFilteredTasks();
  const { moveTask, tasks: allTasks } = useTasksStore();

  const groupedTasks = groupByStatus(filteredTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = allTasks.find((t) => t.id === taskId);
    if (!activeTask) return;

    // Check if dropped over a column (empty column)
    const overStatus = STATUS_CONFIG.find((s) => s.id === overId);
    if (overStatus) {
      const tasksInColumn = groupedTasks[overStatus.id];
      const newOrder = tasksInColumn.length > 0 
        ? tasksInColumn[tasksInColumn.length - 1].order + 1000 
        : 1000;
      moveTask(taskId, overStatus.id, newOrder);
      return;
    }

    // Check if dropped over another task
    const overTask = allTasks.find((t) => t.id === overId);
    if (overTask && overTask.id !== taskId) {
      // Get all tasks in the target column sorted by order
      const targetStatus = overTask.status;
      const tasksInColumn = [...groupedTasks[targetStatus]].sort((a, b) => a.order - b.order);
      
      // Find the index where we're dropping
      const overIndex = tasksInColumn.findIndex((t) => t.id === overId);
      const activeIndex = tasksInColumn.findIndex((t) => t.id === taskId);

      // If moving within the same column
      if (activeTask.status === targetStatus) {
        if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;
        
        // Reorder tasks
        const reordered = arrayMove(tasksInColumn, activeIndex, overIndex);
        
        // Update orders for all affected tasks
        reordered.forEach((task, index) => {
          const newOrder = (index + 1) * 1000;
          if (task.order !== newOrder) {
            moveTask(task.id, task.status, newOrder);
          }
        });
      } else {
        // Moving to a different column
        // Calculate new order based on position
        let newOrder: number;
        if (overIndex === 0) {
          // Dropping at the top
          newOrder = tasksInColumn[0].order - 1000;
        } else if (overIndex === tasksInColumn.length - 1) {
          // Dropping at the bottom
          newOrder = tasksInColumn[overIndex].order + 1000;
        } else {
          // Dropping in the middle
          newOrder = (tasksInColumn[overIndex - 1].order + tasksInColumn[overIndex].order) / 2;
        }
        moveTask(taskId, targetStatus, newOrder);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {STATUS_CONFIG.map((status) => (
            <Column
              key={status.id}
              status={status.id}
              label={status.label}
              tasks={groupedTasks[status.id]}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
