import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { useNotesStore } from '@/store/useNotesStore';
import { NoteModal } from './NoteModal';
import { DeleteNoteModal } from './DeleteNoteModal';
import type { Note } from '@/types';

export function StickyNotes() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  // Filter notes by search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setModalMode('edit');
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (content: string, color: string) => {
    if (modalMode === 'create') {
      addNote(content, color);
    } else if (selectedNote) {
      updateNote(selectedNote.id, content);
    }
  };

  const handleDeleteClick = (noteId: string) => {
    setDeleteNoteId(noteId);
  };

  const handleConfirmDelete = () => {
    if (deleteNoteId) {
      deleteNote(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📝 Notes
            {notes.length > 0 && (
              <span className="text-xs bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {notes.length}
              </span>
            )}
          </h3>
          <button
            onClick={handleOpenCreateModal}
            className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            aria-label="Add note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        {notes.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
          {/* Filtered Notes */}
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group relative p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-shadow hover:shadow-md cursor-pointer"
              style={{ backgroundColor: note.color }}
              onClick={() => handleOpenEditModal(note)}
            >
              <p className="text-sm text-gray-900 whitespace-pre-wrap break-words line-clamp-4 pr-16">
                {note.content}
              </p>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(note);
                  }}
                  className="p-1 bg-white/80 text-gray-700 rounded hover:bg-white transition-colors"
                  aria-label="Edit note"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(note.id);
                  }}
                  className="p-1 bg-white/80 text-red-600 rounded hover:bg-white transition-colors"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* No Results */}
          {searchQuery && filteredNotes.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No notes found for "{searchQuery}"
            </div>
          )}

          {/* Empty State */}
          {notes.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No notes yet. Click + to add one!
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={selectedNote}
        mode={modalMode}
      />

      <DeleteNoteModal
        isOpen={deleteNoteId !== null}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
