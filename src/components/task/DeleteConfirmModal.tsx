import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useUIStore } from '@/store/useUIStore';
import { useTasksStore } from '@/store/useTasksStore';

export function DeleteConfirmModal() {
  const { deleteConfirm, closeDeleteConfirm } = useUIStore();
  const { deleteTask, getTaskById } = useTasksStore();

  const task = deleteConfirm.taskId ? getTaskById(deleteConfirm.taskId) : null;

  const handleDelete = () => {
    if (deleteConfirm.taskId) {
      deleteTask(deleteConfirm.taskId);
      closeDeleteConfirm();
    }
  };

  return (
    <Modal
      isOpen={deleteConfirm.open}
      onClose={closeDeleteConfirm}
      title="Delete Task"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{task?.title}</span>? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={closeDeleteConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
