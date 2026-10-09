import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { ConstellationCanvas } from '../components/common/ConstellationCanvas';
import { MemoryCategory } from '../types';
import {
  Compass,
  Search,
  Sparkles,
  Filter,
  Users,
  MapPin,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

export const ConstellationView: React.FC = () => {
  const { memories, setPreviewMemory } = useTapestry();
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
              نظامِ کہکشاں · Living Constellation
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
            The Constellation Map
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
            Visualizing your woven Sheeraza of memories, quiet acts of kindness (نیکی), and life crossroads. Drag to pan the sky, scroll to zoom, click nodes to enter moments.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search constellation (e.g. Paris, Dad, launch)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          />
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Legend notes */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#D97762]" /> Act of Kindness
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2E8B75]" /> Acts That Matter
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#C89D3C]" /> Achievement
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4A7C9B]" /> Adventure
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#B66E6F]" /> Connection
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7D6B91]" /> Transition
          </span>
        </div>
      </div>

      {/* Large Constellation Canvas */}
      <div className="shadow-xl rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800">
        <ConstellationCanvas
          memories={memories}
          onSelectMemory={(m) => setPreviewMemory(m)}
          selectedCategory={category}
          searchFilter={search}
          height={640}
        />
      </div>
    </div>
  );
};
