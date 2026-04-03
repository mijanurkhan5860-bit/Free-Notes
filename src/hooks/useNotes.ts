import { useState, useEffect, useCallback } from 'react';
import { Note, NoteColor, NoteCategory } from '../types/note';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'free-notes-data';
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoteCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadNotes = async () => {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) setNotes(JSON.parse(value));
    };
    loadNotes();
  }, []);

  useEffect(() => {
    Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(notes) });
  }, [notes]);

  const createNote = useCallback((title: string, content: string, color: NoteColor = 'yellow', category: NoteCategory = 'personal') => {
    const now = new Date().toISOString();
    const note: Note = { id: generateId(), title, content, color, category, pinned: false, createdAt: now, updatedAt: now };
    setNotes(prev => [note, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }, []);

  const filteredNotes = notes
    .filter(n => activeCategory === 'all' || n.category === activeCategory)
    .filter(n => {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
