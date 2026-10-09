import React from 'react';
import { useTapestry } from '../context/TapestryContext';
import { MemoryCard } from '../components/common/MemoryCard';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { memories, navigate, setSelectedMemoryId } = useTapestry();
  const favoriteMemories = memories.filter((m) => m.favorite);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-serif text-rose-600 dark:text-rose-400 font-medium uppercase tracking-widest">
          <Heart size={14} className="fill-current" />
          <span>قریب تر از جاں · Kept Close</span>
        </div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
          Close to Heart (یادگارِ خاص)
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
          {favoriteMemories.length} {favoriteMemories.length === 1 ? 'moment' : 'moments'} marked as anchor memories.
        </p>
      </div>

      {favoriteMemories.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl">
          <Heart size={28} className="mx-auto text-stone-300 dark:text-stone-700 mb-2" />
          <h3 className="font-serif text-2xl text-stone-800 dark:text-stone-200">
            Some moments are worth keeping close.
          </h3>
          <p className="text-xs text-stone-500 font-serif italic mt-1 max-w-sm mx-auto">
            Click the heart icon on any memory to anchor it here in your sacred collection.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/moments')}
              className="px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer shadow-sm hover:bg-stone-800"
            >
              Browse all moments
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteMemories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
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
