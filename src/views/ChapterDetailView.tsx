import React, { useState, useEffect } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { Chapter, Memory } from '../types';
import { MemoryCard } from '../components/common/MemoryCard';
import {
  ArrowLeft,
  Calendar,
  Share2,
  Trash2,
  Plus,
  BookOpen,
  Sparkles,
  Link,
  Check
} from 'lucide-react';

interface ChapterDetailViewProps {
  chapterId: string;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({ chapterId }) => {
  const {
    chapters,
    memories,
    deleteChapter,
    navigate,
    setSelectedMemoryId,
    showToast
  } = useTapestry();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const found = chapters.find((c) => c.id === chapterId);
    if (found) setChapter(found);
  }, [chapterId, chapters]);

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-serif text-stone-500">Searching for this chapter...</p>
        <button
          onClick={() => navigate('/chapters')}
          className="mt-4 px-4 py-2 text-xs font-serif underline text-stone-700 dark:text-stone-300"
        >
          Return to chapters
        </button>
      </div>
    );
  }

  const chapterMemories = memories.filter((m) => chapter.memoryIds.includes(m.id));

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to archive this life chapter? The individual memories will remain preserved in your sanctuary.')) {
      await deleteChapter(chapter.id);
      navigate('/chapters');
    }
  };

  const shareUrl = `${window.location.origin}/shared/${chapter.id}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    showToast('Public chapter link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top back navigation and actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/chapters')}
          className="text-xs font-serif text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Chapters</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Share chapter"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Delete chapter"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Chapter Cinematic Hero */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl bg-stone-900">
        <img
          src={chapter.coverImageUrl}
          alt={chapter.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        <div className="absolute bottom-8 left-8 right-8 text-white max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-300">
            <Calendar size={13} />
            <span>
              {chapter.startDate.slice(0, 4)} — {chapter.endDate.slice(0, 4)}
            </span>
            <span>·</span>
            <span>{chapterMemories.length} moments woven</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
            {chapter.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-200 font-serif italic max-w-2xl leading-relaxed">
            “{chapter.description}”
          </p>
        </div>
      </div>

      {/* Chapter Memories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4">
          <div>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
              Moments Woven into this Chapter
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              The threads that defined this season
            </p>
          </div>

          <button
            onClick={() => navigate('/moments/new')}
            className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add moment to chapter</span>
          </button>
        </div>

        {chapterMemories.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl">
            <BookOpen size={28} className="mx-auto text-stone-400 mb-2" />
            <p className="font-serif text-lg text-stone-700 dark:text-stone-300">
              This chapter has no moments yet.
            </p>
            <p className="text-xs text-stone-400 font-serif italic mt-1">
              Edit memories and associate them with this chapter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapterMemories.map((mem) => (
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

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FAF8F5] dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Share Public Chapter
            </span>
            <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Curated Chapter Keepsake
            </h3>
            <p className="text-xs text-stone-500 font-serif italic mt-1">
              Share this entire chapter as an elegant reading experience.
            </p>

            <div className="mt-4 p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
              <span className="truncate mr-2 font-mono text-[11px]">{shareUrl}</span>
              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-lg text-xs font-medium cursor-pointer shrink-0 flex items-center gap-1"
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
