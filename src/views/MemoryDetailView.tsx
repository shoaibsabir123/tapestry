import React, { useState, useEffect } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { Memory } from '../types';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { MemoryCard } from '../components/common/MemoryCard';
import {
  ArrowLeft,
  Heart,
  Share2,
  Edit3,
  Trash2,
  MapPin,
  Users,
  Tag,
  Sparkles,
  Link,
  Check,
  Calendar,
  Volume2
} from 'lucide-react';

interface MemoryDetailViewProps {
  memoryId: string;
}

export const MemoryDetailView: React.FC<MemoryDetailViewProps> = ({ memoryId }) => {
  const {
    memories,
    toggleFavorite,
    deleteMemory,
    navigate,
    setSelectedMemoryId,
    showToast
  } = useTapestry();

  const [memory, setMemory] = useState<Memory | null>(null);
  const [relatedMemories, setRelatedMemories] = useState<Memory[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Find in local state or fetch
    const current = memories.find((m) => m.id === memoryId);
    if (current) {
      setMemory(current);

      // Find related
      const related = memories
        .filter((m) => m.id !== current.id)
        .map((other) => {
          let score = 0;
          if (other.category === current.category) score += 2;
          const sharedPeople = other.people.filter((p) => current.people.includes(p));
          score += sharedPeople.length * 3;
          const sharedTags = other.tags.filter((t) => current.tags.includes(t));
          score += sharedTags.length * 2;
          return { memory: other, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((item) => item.memory);

      setRelatedMemories(related);
    }
  }, [memoryId, memories]);

  if (!memory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-serif text-stone-500">Searching for this thread...</p>
        <button
          onClick={() => navigate('/moments')}
          className="mt-4 px-4 py-2 text-xs font-serif underline text-stone-700 dark:text-stone-300"
        >
          Return to moments
        </button>
      </div>
    );
  }

  const categoryConfig = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.Other;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you wish to release this thread from your tapestry?')) {
      await deleteMemory(memory.id);
      navigate('/moments');
    }
  };

  const shareUrl = `${window.location.origin}/shared/${memory.id}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    showToast('Public keepsake link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/moments')}
          className="text-xs font-serif text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Life Archive</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite toggle */}
          <button
            onClick={() => toggleFavorite(memory.id)}
            className={`p-2.5 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
              memory.favorite ? 'text-rose-600 bg-rose-50/50' : 'text-stone-400'
            }`}
            aria-label="Toggle favorite"
          >
            <Heart size={16} className={memory.favorite ? 'fill-current' : ''} />
          </button>

          {/* Share */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Share memory"
          >
            <Share2 size={16} />
          </button>

          {/* Edit */}
          <button
            onClick={() => navigate(`/moments/${memory.id}/edit`)}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Edit memory"
          >
            <Edit3 size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Delete memory"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Cinematic Hero Photograph */}
      {memory.coverImageUrl && (
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-stone-900">
          <img
            src={memory.coverImageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {memory.location && (
            <div className="absolute bottom-6 left-6 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-serif flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-400" />
              <span>{memory.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Editorial Title Block */}
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Zero-pill metadata kicker */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
          <span style={{ color: categoryConfig.accent }}>
            {memory.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(memory.date)}</span>
          {memory.location && (
            <>
              <span aria-hidden="true">·</span>
              <span>{memory.location}</span>
            </>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-light text-stone-900 dark:text-stone-100 leading-tight">
          {memory.title}
        </h1>

        {memory.people.length > 0 && (
          <p className="text-xs text-stone-500 font-serif italic">
            With {memory.people.join(', ')}
          </p>
        )}
      </div>

      {/* Story Text (Museum exhibit typography) */}
      <div className="max-w-3xl mx-auto">
        <div className="font-serif text-lg sm:text-xl text-stone-800 dark:text-stone-200 leading-relaxed space-y-6 first-letter:text-5xl first-letter:font-light first-letter:mr-2 first-letter:float-left first-letter:text-stone-900 dark:first-letter:text-stone-100">
          {memory.story.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Audio Aura Player */}
      {memory.audioUrl && (
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-serif uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 block">
            Audio Aura
          </span>
          <AudioPlayer
            src={memory.audioUrl}
            duration={memory.audioDuration || 32}
            label={`Recorded voice of ${memory.title}`}
          />
        </div>
      )}

      {/* Dimensional Exhibition Grid: Emotional Pulse & Reflection */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 bg-white/70 dark:bg-stone-900/60 rounded-3xl border border-stone-200/80 dark:border-stone-800">
        {/* Emotional Pulse */}
        <div>
          <span className="text-xs font-serif uppercase tracking-widest text-stone-400 mb-3 block">
            Emotional Pulse
          </span>
          <EmotionalPulseVisualizer
            nervousElated={memory.emotionNervousElated}
            lonelyConnected={memory.emotionLonelyConnected}
            uncertainCertain={memory.emotionUncertainCertain}
            heavyLight={memory.emotionHeavyLight}
            quietElectric={memory.emotionQuietElectric}
            size="md"
            showLabels={true}
          />
        </div>

        {/* Reflection Answers */}
        <div className="flex flex-col justify-between space-y-4 border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-800 pt-6 md:pt-0 md:pl-8">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400 mb-2 block">
              Reflective Inquiry
            </span>
            <blockquote className="font-serif text-base text-stone-800 dark:text-stone-200 italic border-l-2 border-amber-600 pl-4 py-1">
              “{memory.reflectionPrompt || 'What did you discover about yourself in this moment?'}”
            </blockquote>
            {memory.reflectionAnswer ? (
              <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
                {memory.reflectionAnswer}
              </p>
            ) : (
              <p className="mt-4 text-xs text-stone-400 font-serif italic">
                No answer was recorded. Some moments speak through their silence.
              </p>
            )}
          </div>

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[11px] text-stone-400 font-serif block mb-1.5">Themes</span>
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-stone-600 dark:text-stone-400 font-serif italic"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Artifacts Gallery */}
      {memory.artifactUrls && memory.artifactUrls.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-serif uppercase tracking-widest text-stone-400 block">
            Artifacts & Preserved Evidence ({memory.artifactUrls.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {memory.artifactUrls.map((url, i) => (
              <div
                key={i}
                className="aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shadow-xs hover:shadow-md transition-shadow"
              >
                <img src={url} alt={`Artifact ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Moments (This moment touches other parts of your story) */}
      {relatedMemories.length > 0 && (
        <div className="max-w-4xl mx-auto pt-10 border-t border-stone-200/80 dark:border-stone-800 space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
              This moment touches other parts of your story
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Connected through shared people, themes, and emotional currents
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedMemories.map((rel) => (
              <MemoryCard
                key={rel.id}
                memory={rel}
                onClick={() => {
                  setSelectedMemoryId(rel.id);
                  navigate(`/moments/${rel.id}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Share Keepsake Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FAF8F5] dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Share Sanctuary Link
            </span>
            <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Curate a public keepsake
            </h3>
            <p className="text-xs text-stone-500 font-serif italic mt-1">
              Anyone with this private link can view this memory without an account. Your other moments remain strictly private.
            </p>

            <div className="mt-4 p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
              <span className="truncate mr-2 font-mono text-[11px]">{shareUrl}</span>
              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-lg text-xs font-medium hover:bg-stone-800 cursor-pointer shrink-0 flex items-center gap-1"
              >
                {copiedLink ? <Check size={13} /> : <Link size={13} />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
