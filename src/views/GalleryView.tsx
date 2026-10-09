import React, { useState, useMemo } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import { Image, Filter, Heart, MapPin, Volume2 } from 'lucide-react';
import { MemoryCategory } from '../types';

export const GalleryView: React.FC = () => {
  const { memories, navigate, setSelectedMemoryId, toggleFavorite } = useTapestry();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

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

  const years = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      const yr = m.date.slice(0, 4);
      if (yr) set.add(yr);
    });
    return ['All', ...Array.from(set).sort().reverse()];
  }, [memories]);

  // Memories with images
  const visualMemories = useMemo(() => {
    return memories.filter((m) => {
      if (!m.coverImageUrl && (!m.artifactUrls || m.artifactUrls.length === 0)) return false;
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      if (selectedYear !== 'All' && !m.date.startsWith(selectedYear)) return false;
      return true;
    });
  }, [memories, selectedCategory, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
            Visual Archive
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
            Photo Gallery
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
            A visual anthology of light, terrain, and faces across your journey.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Years</option>
            {years.filter((y) => y !== 'All').map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Masonry / Photo-first Grid */}
      {visualMemories.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl">
          <Image size={28} className="mx-auto text-stone-400 mb-2" />
          <h3 className="font-serif text-xl text-stone-800 dark:text-stone-200">
            No photographs match this filter.
          </h3>
          <p className="text-xs text-stone-400 font-serif italic mt-1">
            Add a photograph to a moment to see it appear in your visual anthology.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {visualMemories.map((mem) => {
            const catCfg = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.Other;
            return (
              <div
                key={mem.id}
                onClick={() => {
                  setSelectedMemoryId(mem.id);
                  navigate(`/moments/${mem.id}`);
                }}
                className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 bg-stone-900"
              >
                <img
                  src={mem.coverImageUrl}
                  alt={mem.title}
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 block"
                />

                {/* Hover overlay with title & date */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-2 text-[11px] text-stone-300 mb-1">
                    <span style={{ color: catCfg.accent }} className="font-medium">
                      {mem.category}
                    </span>
                    <span>·</span>
                    <span>{formatDate(mem.date)}</span>
                  </div>

                  <h3 className="font-serif text-lg font-medium leading-snug line-clamp-2">
                    {mem.title}
                  </h3>

                  {mem.location && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-stone-300">
                      <MapPin size={11} className="text-stone-400" />
                      <span>{mem.location}</span>
                    </div>
                  )}

                  {mem.audioUrl && (
                    <div className="mt-2 text-[11px] text-amber-300 font-serif italic flex items-center gap-1">
                      <Volume2 size={12} /> Voice Aura attached
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
