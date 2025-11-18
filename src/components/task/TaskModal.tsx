import { useState, useEffect, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useUIStore } from '@/store/useUIStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useUsersStore } from '@/store/useUsersStore';
import { useTagsStore } from '@/store/useTagsStore';
import { STATUS_CONFIG, PRIORITY_CONFIG, type Priority, type Status } from '@/types';

export function TaskModal() {
  const { taskModal, closeTaskModal } = useUIStore();
  const { addTask, updateTask, getTaskById } = useTasksStore();
  const { users } = useUsersStore();
  const { tags } = useTagsStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    status: 'todo' as Status,
    priority: 'medium' as Priority,
    tags: [] as string[],
    dueDate: '',
  });

  // Load task data when editing
  useEffect(() => {
    if (taskModal.mode === 'edit' && taskModal.taskId) {
      const task = getTaskById(taskModal.taskId);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          assigneeId: task.assigneeId || '',
          status: task.status,
          priority: task.priority,
          tags: task.tags,
          dueDate: task.dueDate || '',
        });
      }
    } else {
      // Reset for create mode
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        dueDate: '',
      });
    }
  }, [taskModal.mode, taskModal.taskId, getTaskById]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (taskModal.mode === 'create') {
      addTask({
        ...formData,
        assigneeId: formData.assigneeId || undefined,
        dueDate: formData.dueDate || undefined,
      });
    } else if (taskModal.taskId) {
      updateTask(taskModal.taskId, {
        ...formData,
        assigneeId: formData.assigneeId || undefined,
        dueDate: formData.dueDate || undefined,
      });
    }

    closeTaskModal();
  };

  const toggleTag = (tagName: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter((t) => t !== tagName)
        : [...prev.tags, tagName],
    }));
  };

  return (
    <Modal
      isOpen={taskModal.open}
      onClose={closeTaskModal}
      title={taskModal.mode === 'create' ? 'Create Task' : 'Edit Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description"
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Assignee"
            value={formData.assigneeId}
            onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
            options={[
              { value: '', label: 'Unassigned' },
              ...users.map((u) => ({ value: u.id, label: u.name })),
            ]}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
            options={STATUS_CONFIG.map((s) => ({ value: s.id, label: s.label }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            options={PRIORITY_CONFIG.map((p) => ({ value: p.id, label: p.label }))}
          />

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  formData.tags.includes(tag.name)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-400 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={closeTaskModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {taskModal.mode === 'create' ? 'Create Task' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
