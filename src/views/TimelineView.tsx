import React, { useState, useMemo } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { CATEGORY_COLORS, formatDate, formatYearMonth } from '../utils/theme';
import {
  Calendar,
  Filter,
  MapPin,
  Volume2,
  Heart,
  Users,
  Tag
} from 'lucide-react';
import { MemoryCategory } from '../types';

export const TimelineView: React.FC = () => {
  const { memories, navigate, setSelectedMemoryId, toggleFavorite } = useTapestry();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  // Group memories by Year -> Month
  const groupedTimeline = useMemo(() => {
    const filtered = memories.filter((m) => {
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      return true;
    });

    // Group by Year
    const yearMap = new Map<string, Map<string, typeof filtered>>();

    filtered.forEach((m) => {
      const year = m.date.slice(0, 4) || 'Undated';
      const month = m.date.slice(5, 7) || '01';

      if (!yearMap.has(year)) {
        yearMap.set(year, new Map());
      }
      const monthMap = yearMap.get(year)!;
      if (!monthMap.has(month)) {
        monthMap.set(month, []);
      }
      monthMap.get(month)!.push(m);
    });

    // Convert to sorted array
    const sortedYears = Array.from(yearMap.keys()).sort().reverse();
    return sortedYears.map((yr) => {
      const monthMap = yearMap.get(yr)!;
      const sortedMonths = Array.from(monthMap.keys()).sort().reverse();
      return {
        year: yr,
        months: sortedMonths.map((mo) => ({
          monthNum: mo,
          monthName: new Date(Number(yr), Number(mo) - 1, 1).toLocaleString('en-US', { month: 'long' }),
          memories: monthMap.get(mo)!.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }))
      };
    });
  }, [memories, selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
            Chronology
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
            Chronological Timeline
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
            A linear progression of your life woven through time.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
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
      </div>

      {/* Timeline Stream with vertical thread */}
      <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 sm:before:left-32 before:w-[1px] before:bg-stone-200 dark:before:bg-stone-800 before:z-0">
        {groupedTimeline.map((yrGroup) => (
          <div key={yrGroup.year} className="space-y-8 relative z-10">
            {/* Year Headline */}
            <div className="flex items-center gap-4">
              <span className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100 bg-[#FAF8F5] dark:bg-[#0D0F12] pr-4">
                {yrGroup.year}
              </span>
              <div className="flex-1 h-[1px] bg-stone-200 dark:bg-stone-800" />
            </div>

            {/* Months within year */}
            {yrGroup.months.map((moGroup) => (
              <div key={moGroup.monthNum} className="space-y-6">
                {/* Month kicker */}
                <div className="flex items-center gap-4">
                  <span className="sm:w-28 text-left font-serif text-sm font-medium text-amber-800 dark:text-amber-400 uppercase tracking-widest bg-[#FAF8F5] dark:bg-[#0D0F12] pr-2">
                    {moGroup.monthName}
                  </span>
                </div>

                {/* Moments within month */}
                <div className="space-y-4 sm:pl-32">
                  {moGroup.memories.map((mem) => {
                    const catCfg = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.Other;
                    return (
                      <div
                        key={mem.id}
                        onClick={() => {
                          setSelectedMemoryId(mem.id);
                          navigate(`/moments/${mem.id}`);
                        }}
                        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        {/* Timeline Node dot */}
                        <div
                          className="hidden sm:block absolute -left-[37px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-stone-900 shadow-sm transition-transform group-hover:scale-125"
                          style={{ backgroundColor: catCfg.accent }}
                        />

                        <div className="flex-1 min-w-0">
                          {/* Unboxed metadata kicker */}
                          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                            <span style={{ color: catCfg.accent }} className="font-medium">
                              {mem.category}
                            </span>
                            <span>·</span>
                            <span>{formatDate(mem.date)}</span>
                            {mem.location && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} className="text-stone-400" />
                                  {mem.location}
                                </span>
                              </>
                            )}
                            {mem.audioUrl && (
                              <>
                                <span>·</span>
                                <span className="text-amber-600 dark:text-amber-400 font-serif italic flex items-center gap-1">
                                  <Volume2 size={12} /> Voice Aura
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {mem.title}
                          </h3>

                          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-2">
                            “{mem.story}”
                          </p>
                        </div>

                        {/* Thumbnail if present */}
                        {mem.coverImageUrl && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200 dark:border-stone-800">
                            <img src={mem.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
