import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useUsersStore } from '@/store/useUsersStore';
import { useTasksStore } from '@/store/useTasksStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/misc';

const AVATAR_OPTIONS = [
  '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '🧑‍💼', '👨‍🔧', '👩‍🔧', '🧑‍🔧',
  '👨‍🎨', '👩‍🎨', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍🔬', '👨‍🏫', '👩‍🏫',
  '🧑‍🏫', '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨', '👩', '🧑', '🤵',
  '👸', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧑‍🚀', '👮', '🕵️',
];

export function UserManager() {
  const { users, addUser, updateUser, deleteUser } = useUsersStore();
  const { tasks } = useTasksStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser(newUserName.trim(), newUserRole.trim() || undefined, newUserAvatar.trim() || undefined);
      setNewUserName('');
      setNewUserRole('');
      setNewUserAvatar('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (id: string, name: string, role?: string, avatar?: string) => {
    setEditingId(id);
    setEditName(name);
    setEditRole(role || '');
    setEditAvatar(avatar || '');
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateUser(editingId, editName.trim(), editRole.trim() || undefined, editAvatar.trim() || undefined);
      setEditingId(null);
      setEditName('');
      setEditRole('');
      setEditAvatar('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditRole('');
    setEditAvatar('');
  };

  const handleDelete = (userId: string) => {
    // Check if user has assigned tasks
    const userTasks = tasks.filter(task => task.assigneeId === userId);
    
    if (userTasks.length > 0) {
      alert(`Cannot delete this user. They have ${userTasks.length} task(s) assigned. Please reassign or delete those tasks first.`);
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const getUserTaskCount = (userId: string) => {
    return tasks.filter(task => task.assigneeId === userId).length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          User Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage team members who can be assigned to tasks
        </p>
      </div>

      {/* Add New User Button */}
      <div className="mb-6">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Create New User
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  placeholder="e.g., Developer"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar
                </label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewUserAvatar(emoji)}
                      className={cn(
                        'text-2xl p-2 rounded-lg transition-all hover:scale-110',
                        newUserAvatar === emoji
                          ? 'bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {newUserAvatar && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Selected: {newUserAvatar}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddUser}
                disabled={!newUserName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewUserName('');
                  setNewUserRole('');
                  setNewUserAvatar('');
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Team Members ({users.length})
        </h3>
        
        {users.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No users yet. Create your first user to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((user) => {
              const taskCount = getUserTaskCount(user.id);
              
              return (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  {editingId === user.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Avatar
                        </label>
                        <div className="grid grid-cols-6 gap-1 max-h-24 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-900">
                          {AVATAR_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setEditAvatar(emoji)}
                              className={cn(
                                'text-xl p-1 rounded transition-all hover:scale-110',
                                editAvatar === emoji
                                  ? 'bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-600'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              )}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        {editAvatar && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Selected: {editAvatar}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} src={user.avatar} size="md" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </h4>
                            {user.role && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.role}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEdit(user.id, user.name, user.role, user.avatar)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                            aria-label="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                            aria-label="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Task Count */}
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Assigned tasks: <span className="font-semibold text-gray-900 dark:text-white">{taskCount}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
