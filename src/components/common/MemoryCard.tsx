import React from 'react';
import { Memory } from '../../types';
import { CATEGORY_COLORS, formatDate } from '../../utils/theme';
import { Heart, MapPin, Users, Volume2 } from 'lucide-react';
import { useTapestry } from '../../context/TapestryContext';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  layout?: 'grid' | 'list';
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onClick,
  layout = 'grid'
}) => {
  const { toggleFavorite } = useTapestry();
  const categoryConfig = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.Other;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(memory.id);
  };

  if (layout === 'list') {
    return (
      <div
        onClick={onClick}
        className="group relative flex flex-col md:flex-row items-start md:items-center gap-5 p-5 bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer overflow-hidden shadow-xs hover:shadow-md"
      >
        {memory.coverImageUrl && (
          <div className="w-full md:w-44 h-32 md:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
            <img
              src={memory.coverImageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Quiet 1-line unboxed text kicker */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span style={{ color: categoryConfig.accent }} className="font-medium">
              {memory.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(memory.date)}</span>
            {memory.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-stone-400" />
                  {memory.location}
                </span>
              </>
            )}
            {memory.audioUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-serif italic">
                  <Volume2 size={12} /> Voice Aura
                </span>
              </>
            )}
          </div>

          <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {memory.title}
          </h3>

          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400 font-serif italic line-clamp-2 leading-relaxed">
            “{memory.story}”
          </p>

          {/* People & Tags quietly listed */}
          <div className="mt-3 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            {memory.people.length > 0 && (
              <span className="flex items-center gap-1">
                <Users size={12} className="text-stone-400" />
                With {memory.people.join(', ')}
              </span>
            )}
            {memory.tags.length > 0 && (
              <span className="text-stone-400">
                #{memory.tags.slice(0, 3).join(' #')}
              </span>
            )}
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0 ${
            memory.favorite ? 'text-rose-600' : 'text-stone-400 hover:text-rose-500'
          }`}
          aria-label={memory.favorite ? 'Remove favorite' : 'Add to favorites'}
        >
          <Heart size={18} className={memory.favorite ? 'fill-current' : ''} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs hover:shadow-md"
    >
      {/* Cover image */}
      {memory.coverImageUrl && (
        <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={memory.coverImageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle top gradient for favorite button contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

          {/* Floating Favorite heart */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              memory.favorite
                ? 'bg-rose-500/90 text-white'
                : 'bg-black/30 text-white/90 hover:bg-black/50'
            }`}
            aria-label={memory.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={15} className={memory.favorite ? 'fill-current' : ''} />
          </button>

          {/* Audio Aura indicator */}
          {memory.audioUrl && (
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-stone-100 text-[11px] font-serif italic flex items-center gap-1.5">
              <Volume2 size={12} className="text-amber-400" />
              <span>Voice memo</span>
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata kicker */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span style={{ color: categoryConfig.accent }} className="font-medium">
              {memory.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(memory.date)}</span>
          </div>

          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {memory.title}
          </h3>

          <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-3 leading-relaxed">
            “{memory.story}”
          </p>
        </div>

        {/* Footer meta */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5 truncate">
            {memory.location ? (
              <>
                <MapPin size={11} className="shrink-0" />
                <span className="truncate">{memory.location}</span>
              </>
            ) : memory.people.length > 0 ? (
              <>
                <Users size={11} className="shrink-0" />
                <span className="truncate">With {memory.people[0]}</span>
              </>
            ) : (
              <span>Private moment</span>
            )}
          </div>
          {memory.tags.length > 0 && (
            <span className="text-[11px] text-stone-400 shrink-0">
              #{memory.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
