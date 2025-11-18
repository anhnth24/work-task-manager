import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useTagsStore } from '@/store/useTagsStore';
import { useTasksStore } from '@/store/useTasksStore';

export function TagManager() {
  const { tags, addTag, updateTag, deleteTag } = useTagsStore();
  const { tasks } = useTasksStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor('#3b82f6');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (id: string, name: string, color: string) => {
    setEditingId(id);
    setEditName(name);
    setEditColor(color);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateTag(editingId, editName.trim(), editColor);
      setEditingId(null);
      setEditName('');
      setEditColor('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  const handleDelete = (id: string, tagName: string) => {
    // Check if any tasks use this tag
    const tasksUsingTag = tasks.filter(task => task.tags.includes(tagName));
    
    if (tasksUsingTag.length > 0) {
      alert(`Cannot delete this tag. It is used in ${tasksUsingTag.length} task(s). Please remove the tag from those tasks first.`);
      return;
    }

    if (confirm('Are you sure you want to delete this tag?')) {
      deleteTag(id);
    }
  };

  const getTagTaskCount = (tagName: string) => {
    return tasks.filter(task => task.tags.includes(tagName)).length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tag Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage custom tags for organizing your tasks
        </p>
      </div>

      {/* Add New Tag Button */}
      <div className="mb-6">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New Tag
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Create New Tag
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g., urgent, marketing"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-20 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Tag
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewTagName('');
                  setNewTagColor('#3b82f6');
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tags List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Your Tags ({tags.length})
        </h3>
        
        {tags.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No tags yet. Create your first tag to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                {editingId === tag.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tag Name
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
                        Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          className="w-16 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tag.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartEdit(tag.id, tag.name, tag.color)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        aria-label="Edit tag"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete tag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Preview Badge and Usage Count */}
                {editingId !== tag.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Preview:</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Used in <span className="font-semibold text-gray-900 dark:text-white">{getTagTaskCount(tag.name)}</span> task(s)
                      </p>
                    </div>
                    <span
                      className="inline-block px-3 py-1 text-sm rounded-full"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
