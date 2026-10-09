import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { formatDate } from '../utils/theme';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';
import {
  BookOpen,
  Download,
  Printer,
  FileText,
  Sparkles,
  Check,
  Calendar,
  Layers,
  MapPin,
  Volume2
} from 'lucide-react';

export const ExportView: React.FC = () => {
  const { memories, chapters, user, showToast } = useTapestry();
  const [selectedScope, setSelectedScope] = useState<'all' | 'chapter' | 'favorites'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'preview' | 'formats'>('preview');

  // Filter memories based on scope
  const exportMemories = memories.filter((m) => {
    if (selectedScope === 'favorites') return m.favorite;
    if (selectedScope === 'chapter' && selectedChapterId) {
      return (m.chapterIds || []).includes(selectedChapterId);
    }
    return true;
  });

  const handleDownloadJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      author: user?.displayName,
      totalMemories: exportMemories.length,
      memories: exportMemories,
      chapters
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapestry-archive-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('JSON archive downloaded.');
  };

  const handleDownloadMarkdown = () => {
    let md = `# TAPESTRY — THE LIVING TAPESTRY\n`;
    md += `*Author: ${user?.displayName || 'Traveler'}*\n`;
    md += `*Exported: ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    exportMemories.forEach((m) => {
      md += `## ${m.title}\n`;
      md += `**Date:** ${m.date} | **Category:** ${m.category} | **Location:** ${m.location || 'Private'}\n\n`;
      if (m.people.length > 0) md += `*With: ${m.people.join(', ')}*\n\n`;
      md += `> ${m.story}\n\n`;
      if (m.reflectionPrompt) {
        md += `**Prompt:** *${m.reflectionPrompt}*\n`;
        md += `**Reflection:** ${m.reflectionAnswer || 'None recorded.'}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapestry-autobiography-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    showToast('Markdown manuscript downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6 print:hidden">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
            Keepsake & Legacy
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
            Export Keepsake Book
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
            Transform your living tapestry into an heirloom digital or physical book.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium hover:border-stone-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Printable Book Layout</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-4 py-2 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>JSON Archive</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium hover:border-stone-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {/* Scope Selector */}
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <span className="text-xs font-serif text-stone-500">Include:</span>
        <button
          onClick={() => setSelectedScope('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedScope === 'all'
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          Entire Sheeraza ({memories.length})
        </button>
        <button
          onClick={() => setSelectedScope('favorites')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedScope === 'favorites'
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          Favorites Only ({memories.filter((m) => m.favorite).length})
        </button>
        {chapters.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedScope('chapter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedScope === 'chapter'
                  ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              By Chapter
            </button>
            {selectedScope === 'chapter' && (
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs focus:outline-none"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Keepsake Book Preview Container */}
      <div className="space-y-12 bg-white dark:bg-stone-900 p-8 sm:p-12 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl print:border-none print:shadow-none print:p-0">
        {/* Book Title Page */}
        <div className="text-center py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800 space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono">
            A Living Autobiography
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-stone-900 dark:text-stone-100">
            {user?.displayName ? `${user.displayName}’s Sheeraza` : 'Sheeraza (شیرازہ) — The Living Chronicle'}
          </h1>
          <p className="font-serif text-lg text-stone-500 italic max-w-md mx-auto">
            {user?.bio || 'The collected moments, twilight horizons, and quiet crossroads.'}
          </p>
          <p className="text-xs text-stone-400 font-mono pt-4">
            Preserved in sanctuary · {exportMemories.length} moments
          </p>
        </div>

        {/* Individual Book Pages */}
        <div className="space-y-16">
          {exportMemories.map((mem, index) => (
            <div
              key={mem.id}
              className="page-break space-y-6 pt-10 border-b border-stone-100 dark:border-stone-800/60 pb-12"
            >
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>Moment {index + 1} of {exportMemories.length}</span>
                <span>{formatDate(mem.date)}</span>
              </div>

              {mem.coverImageUrl && (
                <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-stone-900">
                  <img src={mem.coverImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-xs text-amber-700 dark:text-amber-400 font-serif font-medium uppercase tracking-wider">
                  {mem.category} {mem.location ? `· ${mem.location}` : ''}
                </div>

                <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
                  {mem.title}
                </h2>

                <div className="font-serif text-base text-stone-700 dark:text-stone-300 leading-relaxed italic border-l-2 border-stone-200 dark:border-stone-700 pl-4 py-1">
                  “{mem.story}”
                </div>

                {mem.reflectionPrompt && (
                  <div className="pt-4 space-y-1 text-xs text-stone-600 dark:text-stone-400 font-serif">
                    <span className="font-semibold block not-italic">
                      Reflective Inquiry: “{mem.reflectionPrompt}”
                    </span>
                    <p className="italic text-stone-500">{mem.reflectionAnswer}</p>
                  </div>
                )}

                {/* Emotional pulse mini representation */}
                <div className="pt-4 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>Quiet / Electric: {mem.emotionQuietElectric}%</span>
                  <span>Heavy / Light: {mem.emotionHeavyLight}%</span>
                  <span>Connected: {mem.emotionLonelyConnected}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
