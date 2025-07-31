
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { getDocuments, updateDocument, deleteDocument } from "../lib/firebase/firebaseUtils";
import { Edit, Trash2, Save, X, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Note {
  id: string;
  content: string;
  timestamp: string;
  createdAt: any;
  userId: string;
}

interface NotesListProps {
  notes: Note[];
  onNotesUpdate: (notes: Note[]) => void;
}

export function NotesList({ notes, onNotesUpdate }: NotesListProps) {
  const { user } = useAuth();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const allNotes = await getDocuments("notes");
      const userNotes = allNotes
        .filter((note: Note) => note.userId === user.uid)
        .sort((a: Note, b: Note) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      onNotesUpdate(userNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditContent("");
  };

  const saveEdit = async () => {
    if (!editingNote || !editContent.trim()) return;

    try {
      await updateDocument("notes", editingNote, {
        content: editContent.trim(),
        updatedAt: new Date(),
      });

      // Update local state
      const updatedNotes = notes.map(note =>
        note.id === editingNote
          ? { ...note, content: editContent.trim() }
          : note
      );
      onNotesUpdate(updatedNotes);

      setEditingNote(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteDocument("notes", noteId);
      
      // Update local state
      const updatedNotes = notes.filter(note => note.id !== noteId);
      onNotesUpdate(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Notes</h2>
      
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600">No notes yet. Start recording to create your first note!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(note.timestamp)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editingNote === note.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                        title="Save"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(note)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {editingNote === note.id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Edit your note..."
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
