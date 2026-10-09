import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { ConstellationCanvas } from '../components/common/ConstellationCanvas';
import { MemoryCard } from '../components/common/MemoryCard';
import {
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  Calendar,
  Layers,
  Heart,
  Users,
  Feather,
  HandHeart,
  Flame,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { MemoryCategory } from '../types';

const KINDNESS_PROMPTS = [
  {
    title: 'The Silent Sabeel (پانی کی سبیل)',
    desc: 'Set out a bowl or pitcher of clean, cool water and grains outside for street animals and birds under the afternoon sun.',
    category: 'Act of Kindness' as MemoryCategory
  },
  {
    title: 'Clearing the Kiryana Ledger (خفیہ سخاوت)',
    desc: 'Visit a small neighborhood corner shop and anonymously clear the grocery or milk balance of an elder who is struggling.',
    category: 'Act of Kindness' as MemoryCategory
  },
  {
    title: 'Warm Chai for the Night Watchman (چوکیدار کی چائے)',
    desc: 'On a cool evening, take a steaming thermos of cardamom doodh-patti chai and fresh rusks to the street guard or hospital orderly.',
    category: 'Act of Kindness' as MemoryCategory
  },
  {
    title: 'The Unhurried Phone Call (صلۂ رحمی)',
    desc: 'Reach out to an elderly aunt, grandfather, or childhood friend you have not spoken to in months, listening without rushing.',
    category: 'Acts That Matter' as MemoryCategory
  },
  {
    title: 'A Sapling for the Street (صدقۂ جاریہ)',
    desc: 'Plant a neem, moringa, or motia jasmine sapling in a dusty public patch, committing to water it every week.',
    category: 'Act of Kindness' as MemoryCategory
  },
  {
    title: 'Standing Ground for What is Just (حق کی حمایت)',
    desc: 'Defend someone whose reputation was being attacked in their absence, choosing justice over uncomfortable silence.',
    category: 'Acts That Matter' as MemoryCategory
  }
];

export const DashboardView: React.FC = () => {
  const {
    memories,
    chapters,
    navigate,
    setSelectedMemoryId,
    setPreviewMemory,
    setIsQuickCaptureOpen
  } = useTapestry();

  const [constellationCategory, setConstellationCategory] = useState<string>('All');
  const [constellationSearch, setConstellationSearch] = useState<string>('');
  const [promptIndex, setPromptIndex] = useState(0);

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

  // Acts of kindness & moments that matter
  const actsOfKindness = memories.filter(
    (m) => m.category === 'Act of Kindness' || m.category === 'Acts That Matter'
  );

  // Recent memories (first 4)
  const recentMemories = memories.slice(0, 4);

  const currentPrompt = KINDNESS_PROMPTS[promptIndex % KINDNESS_PROMPTS.length];

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % KINDNESS_PROMPTS.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* General Purpose Sanctuary Header (Universally Hospitable & Authentic) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
              شیرازۂ حیات · The Living Chronicle
            </span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-serif italic">
              (خوش آمدید)
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100">
            A Sanctuary for What Truly Matters
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-500 dark:text-stone-400 font-serif italic max-w-2xl leading-relaxed">
            Preserving quiet acts of kindness (نیکی اور احساس), courageous crossroads, familial warmth, and the unspoken moments that give life its enduring texture.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/listings')}
            className="px-4 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-serif italic hover:border-stone-500 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-600" />
            <span>Featured & Latest (نمایاں)</span>
          </button>

          <button
            onClick={() => navigate('/reflections')}
            className="px-4 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-serif italic hover:border-stone-500 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Feather size={14} className="text-amber-600" />
            <span>20-Min Guided Reflection</span>
          </button>

          <button
            onClick={() => navigate('/moments/new')}
            className="px-5 py-2.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-amber-50 text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add moment</span>
          </button>
        </div>
      </div>

      {/* Featured Banner: Acts of Kindness & Deeds That Matter Inspiration */}
      <div className="p-6 md:p-7 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 text-xs text-amber-300 font-serif">
              <HandHeart size={16} className="text-rose-400" />
              <span className="uppercase tracking-widest font-mono text-[11px]">آج کی نیکی اور احساس · Spark of Goodness</span>
              <span>·</span>
              <span className="italic">Everyday Grace in Pakistan</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-100">
              {currentPrompt.title}
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-serif italic leading-relaxed">
              “{currentPrompt.desc}”
            </p>

            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <button
                onClick={handleNextPrompt}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-stone-300"
              >
                <RefreshCw size={13} />
                <span>Another idea for kindness</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/record-chronicle?category=Act%20of%20Kindness')}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <HandHeart size={16} className="text-stone-900" />
              <span>Record Chronicle (Max 2,000w)</span>
            </button>

            <button
              onClick={() => {
                navigate('/moments');
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 text-stone-200 text-xs font-medium border border-emerald-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>View All Acts of Kindness ({actsOfKindness.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Central Visual: Constellation Map */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass size={17} className="text-emerald-700 dark:text-emerald-400" />
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-900 dark:text-stone-100">
                Constellation Map (نظامِ کہکشاں)
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Interconnected moments, people, and themes across your life's journey
            </p>
          </div>

          {/* Interactive filter buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setConstellationCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  constellationCategory === cat
                    ? 'bg-emerald-900 text-amber-100 dark:bg-emerald-400 dark:text-stone-950 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800'
                }`}
              >
                {cat === 'Act of Kindness' ? 'Act of Kindness (نیکی)' : cat === 'Acts That Matter' ? 'Acts That Matter (احساس)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <ConstellationCanvas
          memories={memories}
          onSelectMemory={(m) => setPreviewMemory(m)}
          selectedCategory={constellationCategory}
          searchFilter={constellationSearch}
          height={520}
        />
      </div>

      {/* Life Insights Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/moments')}
          className="p-5 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 cursor-pointer hover:border-emerald-600/40 transition-colors"
        >
          <span className="text-xs font-serif text-stone-400 block">Moments Woven (لمحات)</span>
          <span className="font-serif text-3xl font-medium text-stone-900 dark:text-stone-100 mt-1 block">
            {memories.length}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic mt-1 block">
            Across {new Set(memories.map((m) => m.date.slice(0, 4))).size} documented years
          </span>
        </div>

        <div
          onClick={() => navigate('/moments')}
          className="p-5 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-emerald-200/60 dark:border-emerald-900/40 cursor-pointer hover:border-emerald-500 transition-colors"
        >
          <span className="text-xs font-serif text-emerald-800 dark:text-emerald-400 block font-medium">
            Acts of Kindness (نیکی)
          </span>
          <span className="font-serif text-3xl font-medium text-emerald-800 dark:text-emerald-300 mt-1 block">
            {memories.filter((m) => m.category === 'Act of Kindness').length}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic mt-1 block">
            Quiet charity & gracious deeds
          </span>
        </div>

        <div
          onClick={() => navigate('/moments')}
          className="p-5 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-amber-200/60 dark:border-amber-900/40 cursor-pointer hover:border-amber-500 transition-colors"
        >
          <span className="text-xs font-serif text-amber-800 dark:text-amber-400 block font-medium">
            Acts That Matter (احساس)
          </span>
          <span className="font-serif text-3xl font-medium text-amber-800 dark:text-amber-400 mt-1 block">
            {memories.filter((m) => m.category === 'Acts That Matter').length}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic mt-1 block">
            Loyalty, presence & courage
          </span>
        </div>

        <div
          onClick={() => navigate('/favorites')}
          className="p-5 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-rose-200/60 dark:border-rose-900/40 cursor-pointer hover:border-rose-500 transition-colors"
        >
          <span className="text-xs font-serif text-rose-700 dark:text-rose-400 block font-medium">
            Close to Heart (یادگار)
          </span>
          <span className="font-serif text-3xl font-medium text-rose-700 dark:text-rose-400 mt-1 block">
            {memories.filter((m) => m.favorite).length}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic mt-1 block">
            Moments kept closest
          </span>
        </div>
      </div>

      {/* Acts of Kindness & Moments That Matter Section */}
      {actsOfKindness.length > 0 && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-stone-50/50 to-amber-50/40 dark:from-stone-900/80 dark:via-stone-900/50 dark:to-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
                <Sparkles size={14} />
                <span>وہ لمحے جو یادگار ہیں · The Moments That Matter</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
                Acts of Kindness & Enduring Grace
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif italic mt-0.5">
                Stepping forward when you could have walked away. The quiet deeds that outlive our achievements.
              </p>
            </div>

            <button
              onClick={() => navigate('/moments/new')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-50 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Record an Act of Kindness</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {actsOfKindness.slice(0, 2).map((mem) => (
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
        </div>
      )}

      {/* Recent Moments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              Recent Moments (تازہ ترین یادیں)
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              The latest memories and acts woven into your Sheeraza
            </p>
          </div>

          <button
            onClick={() => navigate('/moments')}
            className="text-xs font-serif text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View complete archive ({memories.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentMemories.map((mem) => (
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
      </div>
    </div>
  );
};
