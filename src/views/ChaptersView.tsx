import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import {
  Layers,
  Plus,
  Sparkles,
  Calendar,
  ArrowRight,
  Check,
  X,
  BookOpen
} from 'lucide-react';
import { Chapter } from '../types';

export const ChaptersView: React.FC = () => {
  const {
    chapters,
    memories,
    addChapter,
    navigate,
    setSelectedChapterId
  } = useTapestry();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newStart, setNewStart] = useState('2025-01-01');
  const [newEnd, setNewEnd] = useState('2026-12-31');
  const [newTheme, setNewTheme] = useState('#D4AF37');
  const [selectedMemIds, setSelectedMemIds] = useState<string[]>([]);

  // AI Chapter Suggestions
  const [suggestedChapter, setSuggestedChapter] = useState<{
    title: string;
    description: string;
    themeColor: string;
    memoryIds: string[];
    reason: string;
  } | null>({
    title: 'The Unfolding Threshold',
    description: 'Moments of career risk, twilight road trips, and early creative milestones that catalyzed who you are becoming.',
    themeColor: '#D4AF37',
    memoryIds: memories.slice(0, 3).map((m) => m.id),
    reason: `Analyzed ${memories.length} moments: detected common themes around career transition, courage, and travel.`
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addChapter({
      title: newTitle.trim(),
      description: newDesc.trim(),
      coverImageUrl: newCover || memories[0]?.coverImageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      startDate: newStart,
      endDate: newEnd,
      themeColor: newTheme,
      memoryIds: selectedMemIds
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setSelectedMemIds([]);
  };

  const handleAcceptSuggestion = async () => {
    if (!suggestedChapter) return;
    await addChapter({
      title: suggestedChapter.title,
      description: suggestedChapter.description,
      coverImageUrl: memories[0]?.coverImageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
      startDate: '2025-01-01',
      endDate: '2026-12-31',
      themeColor: suggestedChapter.themeColor,
      memoryIds: suggestedChapter.memoryIds
    });
    setSuggestedChapter(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
            ابوابِ حیات · Life Eras
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
            Life Chapters (ابواب)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
            Over time, individual moments and acts of grace cluster into larger thematic seasons of your journey.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} />
          <span>New chapter</span>
        </button>
      </div>

      {/* Automatic Chapter Suggestion Banner */}
      {suggestedChapter && (
        <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-stone-900/50 border border-amber-200/80 dark:border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-serif text-amber-800 dark:text-amber-400 font-medium">
              <Sparkles size={14} />
              <span>Organic Chapter Suggestion</span>
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              “{suggestedChapter.title}”
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic">
              {suggestedChapter.description}
            </p>
            <p className="text-[11px] text-stone-400">
              {suggestedChapter.reason}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSuggestedChapter(null)}
              className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={handleAcceptSuggestion}
              className="px-5 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check size={14} />
              <span>Weave this chapter</span>
            </button>
          </div>
        </div>
      )}

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chapters.map((chap) => {
          const chapMemories = memories.filter((m) => chap.memoryIds.includes(m.id));
          return (
            <div
              key={chap.id}
              onClick={() => {
                setSelectedChapterId(chap.id);
                navigate(`/chapters/${chap.id}`);
              }}
              className="group flex flex-col bg-white/70 dark:bg-stone-900/60 rounded-3xl border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                <img
                  src={chap.coverImageUrl}
                  alt={chap.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Theme indicator */}
                <div
                  className="absolute top-4 left-4 w-3 h-3 rounded-full shadow-md"
                  style={{ backgroundColor: chap.themeColor || '#D4AF37' }}
                />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-mono text-stone-300 block">
                    {chap.startDate.slice(0, 4)} – {chap.endDate.slice(0, 4)}
                  </span>
                  <h3 className="font-serif text-2xl font-medium leading-tight">
                    {chap.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif italic line-clamp-3">
                  “{chap.description}”
                </p>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                  <span>{chapMemories.length} moments woven</span>
                  <span className="flex items-center gap-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 font-medium">
                    <span>Enter chapter</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Chapter Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Curate Season
            </span>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Create a Life Chapter
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Riyadh Years, A Season of Solitude..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-serif text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  Description / Thesis
                </label>
                <textarea
                  rows={3}
                  placeholder="What was this season about? What were you leaving behind?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-serif text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  Select Memories to include
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl">
                  {memories.map((m) => {
                    const isSelected = selectedMemIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemIds((prev) =>
                            isSelected ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                          );
                        }}
                        className={`w-full p-2 text-left rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100/70 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="font-serif truncate">{m.title}</span>
                        {isSelected && <Check size={14} className="text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer shadow-sm hover:bg-stone-800"
                >
                  Create chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
