import React, { useState, useEffect } from 'react';
import { Memory, Chapter } from '../types';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';
import { MapPin, Users, Sparkles, BookOpen } from 'lucide-react';

interface SharedViewProps {
  sharedId: string;
}

export const SharedView: React.FC<SharedViewProps> = ({ sharedId }) => {
  const [data, setData] = useState<{
    type: 'memory' | 'chapter';
    item: any;
    author: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShared() {
      try {
        const res = await fetch(`/api/shared/${sharedId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load shared item', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShared();
  }, [sharedId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF8F5] dark:bg-[#0D0F12]">
        <p className="font-serif italic text-stone-500 animate-pulse">Unfolding shared keepsake...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5] dark:bg-[#0D0F12] text-center">
        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-200">
          This thread is private or has concluded.
        </h2>
        <a
          href="/"
          className="mt-4 px-5 py-2 rounded-full bg-emerald-900 text-amber-50 text-xs font-serif"
        >
          Explore Sheeraza
        </a>
      </div>
    );
  }

  const { type, item, author } = data;

  if (type === 'memory') {
    const memory = item as Memory;
    const catCfg = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.Other;

    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0D0F12] text-stone-900 dark:text-stone-100 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4 text-xs font-serif text-stone-500">
            <span>A shared moment from {author}’s Sheeraza</span>
            <a href="/" className="underline hover:text-stone-900 dark:hover:text-white">
              Create your own sanctuary
            </a>
          </header>

          {memory.coverImageUrl && (
            <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl">
              <img src={memory.coverImageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <span style={{ color: catCfg.accent }}>{memory.category}</span>
              <span>·</span>
              <span>{formatDate(memory.date)}</span>
              {memory.location && (
                <>
                  <span>·</span>
                  <span>{memory.location}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-light text-stone-900 dark:text-stone-100">
              {memory.title}
            </h1>

            <div className="font-serif text-lg text-stone-700 dark:text-stone-300 leading-relaxed italic border-l-2 border-amber-600 pl-4 py-2">
              “{memory.story}”
            </div>
          </div>

          {memory.audioUrl && (
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif block mb-2">
                Audio Aura
              </span>
              <AudioPlayer src={memory.audioUrl} duration={memory.audioDuration || 30} />
            </div>
          )}

          {memory.reflectionAnswer && (
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <span className="text-xs font-serif italic text-stone-400">
                “{memory.reflectionPrompt}”
              </span>
              <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-300">
                {memory.reflectionAnswer}
              </p>
            </div>
          )}

          <footer className="pt-8 border-t border-stone-200 dark:border-stone-800 text-center">
            <p className="font-serif italic text-xs text-stone-400">
              Preserved in Sheeraza (شیرازہ) — The Living Chronicle.
            </p>
          </footer>
        </div>
      </div>
    );
  }

  // Chapter public view
  const chapter = item as Chapter;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0D0F12] text-stone-900 dark:text-stone-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4 text-xs font-serif text-stone-500">
          <span>A curated chapter from {author}’s Sheeraza</span>
          <a href="/" className="underline hover:text-stone-900 dark:hover:text-white">
            Begin your chronicle
          </a>
        </header>

        <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl bg-stone-900">
          <img src={chapter.coverImageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="text-xs font-mono text-stone-300">
              {chapter.startDate.slice(0, 4)} – {chapter.endDate.slice(0, 4)}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light">
              {chapter.title}
            </h1>
            <p className="text-sm font-serif italic text-stone-200 max-w-xl">
              “{chapter.description}”
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
            Woven Moments ({chapter.memories?.length || 0})
          </h2>
          <div className="space-y-6">
            {(chapter.memories || []).map((m: Memory) => (
              <div
                key={m.id}
                className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3"
              >
                <div className="text-xs text-stone-500 font-serif">
                  {formatDate(m.date)} {m.location ? `· ${m.location}` : ''}
                </div>
                <h3 className="font-serif text-xl font-medium">{m.title}</h3>
                <p className="text-sm font-serif italic text-stone-700 dark:text-stone-300">
                  “{m.story}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
