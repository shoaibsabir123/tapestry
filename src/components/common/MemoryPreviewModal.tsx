import React from 'react';
import { Memory } from '../../types';
import { CATEGORY_COLORS, formatDate } from '../../utils/theme';
import { X, ArrowRight, Heart, MapPin, Users, Volume2 } from 'lucide-react';
import { EmotionalPulseVisualizer } from './EmotionalPulseVisualizer';
import { useTapestry } from '../../context/TapestryContext';

interface MemoryPreviewModalProps {
  memory: Memory | null;
  onClose: () => void;
  onViewFull: (id: string) => void;
}

export const MemoryPreviewModal: React.FC<MemoryPreviewModalProps> = ({
  memory,
  onClose,
  onViewFull
}) => {
  const { toggleFavorite } = useTapestry();
  if (!memory) return null;

  const categoryConfig = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.Other;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>

        {/* Cover Hero */}
        {memory.coverImageUrl && (
          <div className="relative h-56 w-full overflow-hidden bg-stone-900">
            <img
              src={memory.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] dark:from-stone-900 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 md:p-8 -mt-6 relative">
          {/* Metadata Kicker */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span style={{ color: categoryConfig.accent }} className="font-semibold">
                {memory.category}
              </span>
              <span>·</span>
              <span>{formatDate(memory.date)}</span>
              {memory.location && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {memory.location}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => toggleFavorite(memory.id)}
              className={`p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
                memory.favorite ? 'text-rose-600' : 'text-stone-400'
              }`}
            >
              <Heart size={18} className={memory.favorite ? 'fill-current' : ''} />
            </button>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-900 dark:text-stone-100">
            {memory.title}
          </h2>

          <p className="mt-4 text-base text-stone-700 dark:text-stone-300 font-serif italic leading-relaxed">
            “{memory.story}”
          </p>

          {/* Quick Emotional Pulse & Audio Info */}
          <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col">
              <span className="text-xs font-serif text-stone-500 mb-1">Emotional Fingerprint</span>
              <EmotionalPulseVisualizer
                nervousElated={memory.emotionNervousElated}
                lonelyConnected={memory.emotionLonelyConnected}
                uncertainCertain={memory.emotionUncertainCertain}
                heavyLight={memory.emotionHeavyLight}
                quietElectric={memory.emotionQuietElectric}
                size="sm"
                showLabels={false}
              />
            </div>

            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              {memory.people.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-stone-400" />
                  <span>People: {memory.people.join(', ')}</span>
                </div>
              )}
              {memory.audioUrl && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-serif italic">
                  <Volume2 size={13} />
                  <span>Voice Aura ({memory.audioDuration || 30}s) attached</span>
                </div>
              )}
              {memory.tags.length > 0 && (
                <div className="text-stone-400">
                  Tags: #{memory.tags.join(' #')}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onViewFull(memory.id);
              }}
              className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium text-sm flex items-center gap-2 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-sm cursor-pointer"
            >
              <span>View full memory</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
