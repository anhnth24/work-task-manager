import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/misc';
import type { Note } from '@/types';

const NOTE_COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Pink', value: '#fda4af' },
  { name: 'Blue', value: '#93c5fd' },
  { name: 'Green', value: '#86efac' },
  { name: 'Purple', value: '#d8b4fe' },
  { name: 'Orange', value: '#fdba74' },
  { name: 'Teal', value: '#5eead4' },
  { name: 'Rose', value: '#fecdd3' },
];

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, color: string) => void;
  note?: Note | null;
  mode: 'create' | 'edit';
}

export function NoteModal({ isOpen, onClose, onSave, note, mode }: NoteModalProps) {
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0].value);

  useEffect(() => {
    if (note && mode === 'edit') {
      setContent(note.content);
      setColor(note.color);
    } else {
      setContent('');
      setColor(NOTE_COLORS[0].value);
    }
  }, [note, mode, isOpen]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim(), color);
      handleClose();
    }
  };

  const handleClose = () => {
    setContent('');
    setColor(NOTE_COLORS[0].value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'create' ? '📝 New Note' : '✏️ Edit Note'}>
      <div className="space-y-4">
        {/* Note Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div
            className="rounded-lg border-2 border-gray-300 dark:border-gray-600 p-4 transition-colors"
            style={{ backgroundColor: color }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your note here... (Ctrl+Enter to save)"
              className="w-full bg-transparent text-gray-900 placeholder-gray-600 resize-none focus:outline-none"
              rows={10}
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {content.length} characters
          </p>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {NOTE_COLORS.map((noteColor) => (
              <button
                key={noteColor.value}
                onClick={() => setColor(noteColor.value)}
                className={cn(
                  'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                  color === noteColor.value
                    ? 'border-gray-900 dark:border-white scale-110 ring-2 ring-gray-400'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                style={{ backgroundColor: noteColor.value }}
                title={noteColor.name}
                aria-label={`Select ${noteColor.name}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-0"
          >
            {mode === 'create' ? 'Create Note' : 'Save Changes'}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-medium min-w-0"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
