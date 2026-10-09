import React, { useState, useMemo } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { MemoryCard } from '../components/common/MemoryCard';
import { MemoryCategory } from '../types';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Plus,
  Filter,
  Users,
  Tag,
  MapPin,
  Calendar,
  Sparkles,
  Feather,
  ArrowRight
} from 'lucide-react';

export const MomentsView: React.FC = () => {
  const {
    memories,
    people,
    navigate,
    setSelectedMemoryId,
    searchQuery,
    setSearchQuery
  } = useTapestry();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedPerson, setSelectedPerson] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  const categories: ('All' | MemoryCategory)[] = [
    'All',
    'Act of Kindness',
    'Acts That Matter',
    'Achievement',
    'Adventure',
    'Connection',
    'Transition',
    'Discovery',
    'Creativity',
    'Family'
  ];

  // Derive unique years from memories
  const years = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      const yr = m.date.slice(0, 4);
      if (yr) set.add(yr);
    });
    return ['All', ...Array.from(set).sort().reverse()];
  }, [memories]);

  // Derive unique tags
  const tags = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      m.tags.forEach((t) => set.add(t));
    });
    return ['All', ...Array.from(set).slice(0, 10)];
  }, [memories]);

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      if (selectedYear !== 'All' && !m.date.startsWith(selectedYear)) return false;
      if (selectedPerson !== 'All' && !m.people.includes(selectedPerson)) return false;
      if (selectedTag !== 'All' && !m.tags.includes(selectedTag)) return false;
      if (onlyFavorites && !m.favorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchStory = m.story.toLowerCase().includes(q);
        const matchLoc = m.location.toLowerCase().includes(q);
        const matchTag = m.tags.some((t) => t.toLowerCase().includes(q));
        const matchPerson = m.people.some((p) => p.toLowerCase().includes(q));
        if (!matchTitle && !matchStory && !matchLoc && !matchTag && !matchPerson) return false;
      }
      return true;
    });
  }, [memories, selectedCategory, selectedYear, selectedPerson, selectedTag, onlyFavorites, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
            شیرازۂ یادگار · Life Archive
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
            All Moments & Acts of Kindness
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
            {filteredMemories.length} {filteredMemories.length === 1 ? 'thread' : 'threads'} woven into your living chronicle
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'grid' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-400'
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'list' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-400'
              }`}
              aria-label="List layout"
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={() => navigate('/moments/new')}
            className="px-4 py-2 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add moment (Max 200 words)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Tabs (Segmented control) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              {cat === 'Act of Kindness'
                ? 'Act of Kindness (نیکی)'
                : cat === 'Acts That Matter'
                ? 'Acts That Matter (احساس)'
                : cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Find a moment, feeling, place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
            />
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5">
            <Calendar size={13} className="text-stone-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-xs text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Years</option>
              {years.filter((y) => y !== 'All').map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Person selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5">
            <Users size={13} className="text-stone-400" />
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="bg-transparent text-xs text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All People</option>
              {people.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Tag selector */}
          {tags.length > 1 && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5">
              <Tag size={13} className="text-stone-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-transparent text-xs text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Tags</option>
                {tags.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t}>#{t}</option>
                ))}
              </select>
            </div>
          )}

          {/* Favorites filter toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              onlyFavorites
                ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-stone-400'
            }`}
          >
            ♥ Favorites Only
          </button>
        </div>
      </div>

      {/* Memories Container or Empty State */}
      {filteredMemories.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl bg-stone-50/50 dark:bg-stone-900/20">
          <Sparkles size={28} className="mx-auto text-stone-400 mb-3" />
          <h3 className="font-serif text-2xl text-stone-800 dark:text-stone-200">
            Your tapestry is waiting for its first thread.
          </h3>
          <p className="mt-1 text-sm text-stone-500 font-serif italic max-w-md mx-auto">
            No moments match this specific filter. Add a new moment or clear your search to reveal your woven memories.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedYear('All');
                setSelectedPerson('All');
                setSelectedTag('All');
                setOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
            >
              Reset filters
            </button>
            <button
              onClick={() => navigate('/moments/new')}
              className="px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 transition-all shadow-sm"
            >
              Add a moment
            </button>
          </div>
        </div>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMemories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              layout="grid"
              onClick={() => {
                setSelectedMemoryId(mem.id);
                navigate(`/moments/${mem.id}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMemories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              layout="list"
              onClick={() => {
                setSelectedMemoryId(mem.id);
                navigate(`/moments/${mem.id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
