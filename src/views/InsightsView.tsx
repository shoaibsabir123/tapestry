import React from 'react';
import { useTapestry } from '../context/TapestryContext';
import { CATEGORY_COLORS } from '../utils/theme';
import {
  Sparkles,
  MapPin,
  Users,
  Volume2,
  Image,
  Compass,
  Heart,
  Feather,
  Layers
} from 'lucide-react';
import { MemoryCategory } from '../types';

export const InsightsView: React.FC = () => {
  const { memories, chapters, people, navigate } = useTapestry();

  // Category counts
  const categoryCounts: Partial<Record<MemoryCategory, number>> = {};
  memories.forEach((m) => {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  });

  // Unique locations
  const locationCounts: Record<string, number> = {};
  memories.forEach((m) => {
    if (m.location) {
      locationCounts[m.location] = (locationCounts[m.location] || 0) + 1;
    }
  });

  // People counts
  const peopleCounts: Record<string, number> = {};
  memories.forEach((m) => {
    m.people.forEach((p) => {
      peopleCounts[p] = (peopleCounts[p] || 0) + 1;
    });
  });

  const voiceCount = memories.filter((m) => m.audioUrl).length;
  const photoCount = memories.filter((m) => m.coverImageUrl).length;
  const favoriteCount = memories.filter((m) => m.favorite).length;

  // Average emotional state
  const avgNervousElated = Math.round(
    memories.reduce((acc, m) => acc + m.emotionNervousElated, 0) / (memories.length || 1)
  );
  const avgLonelyConnected = Math.round(
    memories.reduce((acc, m) => acc + m.emotionLonelyConnected, 0) / (memories.length || 1)
  );
  const avgHeavyLight = Math.round(
    memories.reduce((acc, m) => acc + m.emotionHeavyLight, 0) / (memories.length || 1)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
          حکمت و بصیرت · Life Insights
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
          Insights & Acts That Matter
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
          Descriptive reflections celebrating what you paid attention to and the kindness you gave, not a productivity scoreboard.
        </p>
      </div>

      {/* Visual Narrative Prose Summary */}
      <div className="p-8 rounded-3xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-4">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
          Your Woven Summary
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 dark:text-stone-100 leading-relaxed">
          You have documented <span className="font-medium text-amber-700 dark:text-amber-400">{memories.length} moments</span>.
          {' '}
          {Object.entries(categoryCounts)
            .map(([cat, count]) => `${count} were ${cat.toLowerCase()}`)
            .join(', ')}.
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
          Across these moments, your emotional currents lean toward <span className="text-stone-800 dark:text-stone-200 font-medium">{avgHeavyLight >= 50 ? 'lightness & clarity' : 'deep introspection'}</span> and <span className="text-stone-800 dark:text-stone-200 font-medium">{avgLonelyConnected >= 50 ? 'connection with trusted companions' : 'quiet personal sanctuary'}</span>.
        </p>
      </div>

      {/* Categories Visual Breakdown */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
          Distribution of Life Experiences
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(Object.keys(CATEGORY_COLORS) as MemoryCategory[]).map((cat) => {
            const count = categoryCounts[cat] || 0;
            const cfg = CATEGORY_COLORS[cat];
            const pct = Math.round((count / (memories.length || 1)) * 100);
            return (
              <div
                key={cat}
                className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif text-stone-500">{cat}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cfg.accent }}
                  />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
                    {count}
                  </span>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cfg.accent }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* People & Places Encountered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Most frequent companions */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2">
            <Users size={17} className="text-stone-400" />
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Companions in the Journey
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(peopleCounts).length === 0 ? (
              <p className="text-xs text-stone-400 font-serif italic">No people tagged yet.</p>
            ) : (
              Object.entries(peopleCounts).map(([person, count]) => (
                <div key={person} className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                  <span className="font-serif font-medium">{person}</span>
                  <span className="text-stone-400 font-serif italic">
                    {count} {count === 1 ? 'shared moment' : 'shared moments'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Places visited */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={17} className="text-stone-400" />
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Terrains & Horizons
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(locationCounts).length === 0 ? (
              <p className="text-xs text-stone-400 font-serif italic">No locations tagged yet.</p>
            ) : (
              Object.entries(locationCounts).map(([loc, count]) => (
                <div key={loc} className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                  <span className="font-serif font-medium">{loc}</span>
                  <span className="text-stone-400 font-serif italic">
                    {count} {count === 1 ? 'visit' : 'visits'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Annual Reflection Inquiry Prompt */}
      <div className="p-8 rounded-3xl bg-stone-900 text-stone-100 space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Annual Inquiries
        </span>
        <h3 className="font-serif text-2xl font-light">
          Your Year in Moments
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-serif italic max-w-xl leading-relaxed">
          “What changed? What stayed? Who was there at the quiet crossroads? What are you carrying forward into the coming year?”
        </p>
        <button
          onClick={() => navigate('/reflections')}
          className="mt-2 px-5 py-2.5 rounded-full bg-stone-100 text-stone-900 text-xs font-medium hover:bg-white transition-all cursor-pointer"
        >
          Begin seasonal reflection
        </button>
      </div>
    </div>
  );
};
