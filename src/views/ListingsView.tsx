import React, { useState, useEffect, useMemo } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { Memory, MemoryCategory } from '../types';
import { MemoryCard } from '../components/common/MemoryCard';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import {
  Sparkles,
  Search,
  Filter,
  Flame,
  HandHeart,
  Volume2,
  MapPin,
  Calendar,
  Users,
  LayoutGrid,
  List,
  ArrowRight,
  Plus,
  RefreshCw,
  Compass,
  Heart,
  SlidersHorizontal,
  Bookmark,
  Feather
} from 'lucide-react';

interface ListingsStats {
  total: number;
  featuredCount: number;
  kindnessCount: number;
  audioCount: number;
  locationsCount: number;
  chaptersCount: number;
}

export const ListingsView: React.FC = () => {
  const { memories, navigate, setSelectedMemoryId, setPreviewMemory, toggleFavorite } = useTapestry();

  const [dbListings, setDbListings] = useState<Memory[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Memory[]>([]);
  const [latestListings, setLatestListings] = useState<Memory[]>([]);
  const [stats, setStats] = useState<ListingsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'kindness' | 'az'>('latest');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);

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

  // Fetch from server /api/listings
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('sort', sortBy);

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDbListings(data.listings || []);
        setFeaturedListings(data.featured || []);
        setLatestListings(data.latest || []);
        setStats(data.stats || null);
      } else {
        throw new Error('Failed to load from listings API');
      }
    } catch (err) {
      console.warn('Falling back to local state for listings:', err);
      // Fallback using context memories
      const filtered = memories.filter((m) => {
        if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            m.title.toLowerCase().includes(q) ||
            m.story.toLowerCase().includes(q) ||
            m.location.toLowerCase().includes(q) ||
            m.tags.some((t) => t.toLowerCase().includes(q)) ||
            m.people.some((p) => p.toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      });

      if (sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else if (sortBy === 'kindness') {
        filtered.sort((a, b) => {
          const aKind = a.category === 'Act of Kindness' || a.category === 'Acts That Matter' ? 1 : 0;
          const bKind = b.category === 'Act of Kindness' || b.category === 'Acts That Matter' ? 1 : 0;
          return bKind - aKind;
        });
      } else if (sortBy === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }

      setDbListings(filtered);
      setFeaturedListings(memories.filter((m) => m.favorite || m.category === 'Act of Kindness').slice(0, 4));
      setLatestListings(memories.slice(0, 8));
      setStats({
        total: memories.length,
        featuredCount: memories.filter((m) => m.favorite).length,
        kindnessCount: memories.filter((m) => m.category === 'Act of Kindness' || m.category === 'Acts That Matter').length,
        audioCount: memories.filter((m) => m.audioUrl).length,
        locationsCount: new Set(memories.map((m) => m.location).filter(Boolean)).size,
        chaptersCount: 3
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery, sortBy, memories]);

  // Derived filtered listings for the main section
  const displayedListings = useMemo(() => {
    if (filterFeaturedOnly) {
      return dbListings.filter((m) => m.favorite || m.category === 'Act of Kindness');
    }
    return dbListings;
  }, [dbListings, filterFeaturedOnly]);

  const topHeroItem = featuredListings[0] || dbListings[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
              نمایاں اور تازہ ترین اندراجات · Database Listings
            </span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-serif italic">
              (شیرازہ نامہ)
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100">
            Featured & Latest Listings
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-500 dark:text-stone-400 font-serif italic max-w-2xl leading-relaxed">
            Curated memories, quiet acts of kindness (نیکی اور احساس), and the latest stories recorded in the sanctuary database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/moments/new')}
            className="px-5 py-2.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-amber-50 text-xs font-serif font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Moment (Max 200 words)</span>
          </button>
        </div>
      </div>

      {/* Database Live Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">Total Database</span>
          <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mt-0.5 block">
            {stats?.total ?? memories.length}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic">Stored Moments</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
          <span className="text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-400 font-mono block">Featured Anchor</span>
          <span className="font-serif text-2xl sm:text-3xl font-medium text-amber-800 dark:text-amber-300 mt-0.5 block">
            {stats?.featuredCount ?? memories.filter((m) => m.favorite).length}
          </span>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-serif italic">نمایاں کہانیاں</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-[11px] uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-mono block">Acts of Kindness</span>
          <span className="font-serif text-2xl sm:text-3xl font-medium text-emerald-800 dark:text-emerald-300 mt-0.5 block">
            {stats?.kindnessCount ?? memories.filter((m) => m.category === 'Act of Kindness' || m.category === 'Acts That Matter').length}
          </span>
          <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-serif italic">نیکی اور احساس</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">Voice Memos</span>
          <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mt-0.5 block">
            {stats?.audioCount ?? memories.filter((m) => m.audioUrl).length}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic">Audio Auras</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">Regions Preserved</span>
          <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mt-0.5 block">
            {stats?.locationsCount ?? new Set(memories.map((m) => m.location).filter(Boolean)).size}
          </span>
          <span className="text-[11px] text-stone-500 font-serif italic">Across Pakistan</span>
        </div>
      </div>

      {/* SECTION 1: Featured Showcase (نمایاں کہانیاں) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600 dark:text-amber-400" />
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 dark:text-stone-100">
              Featured Listings (نمایاں انتخاب)
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-serif italic">
            Handpicked stories and anchor deeds with lasting cultural impact
          </span>
        </div>

        {/* Top Hero Highlight Card */}
        {topHeroItem && (
          <div
            onClick={() => {
              setSelectedMemoryId(topHeroItem.id);
              navigate(`/moments/${topHeroItem.id}`);
            }}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-950 text-white shadow-2xl border border-emerald-800/50 cursor-pointer transition-all duration-300 hover:border-emerald-600/70"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Cover Image with gradient overlay */}
              <div className="lg:col-span-7 relative h-72 lg:h-[420px] overflow-hidden">
                <img
                  src={topHeroItem.coverImageUrl || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=80'}
                  alt={topHeroItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-stone-950" />
                
                {/* Floating pill-free badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/90 text-stone-950 text-[11px] font-semibold tracking-wide shadow-sm flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Featured Anchor Story</span>
                  </span>
                  {topHeroItem.category === 'Act of Kindness' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-800/90 text-amber-100 text-[11px] font-serif shadow-sm">
                      نیکی اور سخاوت
                    </span>
                  )}
                </div>
              </div>

              {/* Story Content */}
              <div className="lg:col-span-5 p-6 lg:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-serif">
                    <span className="font-medium">{topHeroItem.category}</span>
                    <span>·</span>
                    <span>{formatDate(topHeroItem.date)}</span>
                    {topHeroItem.location && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-amber-400" />
                          {topHeroItem.location}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl lg:text-3xl font-light leading-snug text-white group-hover:text-amber-300 transition-colors">
                    {topHeroItem.title}
                  </h3>

                  <p className="text-stone-300 font-serif italic text-sm leading-relaxed line-clamp-4">
                    “{topHeroItem.story}”
                  </p>

                  {/* Emotional radar mini visualizer */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 block mb-1">
                      Emotional Fingerprint
                    </span>
                    <EmotionalPulseVisualizer
                      nervousElated={topHeroItem.emotionNervousElated}
                      lonelyConnected={topHeroItem.emotionLonelyConnected}
                      uncertainCertain={topHeroItem.emotionUncertainCertain}
                      heavyLight={topHeroItem.emotionHeavyLight}
                      quietElectric={topHeroItem.emotionQuietElectric}
                      size="sm"
                      showLabels={false}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    {topHeroItem.audioUrl && (
                      <span className="flex items-center gap-1 text-amber-400 font-serif italic">
                        <Volume2 size={13} /> Voice Aura included
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-stone-200 group-hover:text-amber-300 font-medium transition-colors">
                    <span>Read full story</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {featuredListings.slice(1, 4).map((item) => (
            <MemoryCard
              key={item.id}
              memory={item}
              onClick={() => {
                setSelectedMemoryId(item.id);
                navigate(`/moments/${item.id}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: All & Latest Database Listings */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-emerald-700 dark:text-emerald-400" />
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 dark:text-stone-100">
                Latest Database Listings (تازہ ترین کہانیاں)
              </h2>
            </div>
            <p className="mt-1 text-xs text-stone-500 font-serif italic">
              Showing {displayedListings.length} total entries from the live database
            </p>
          </div>

          {/* Layout Mode & View Switches */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif italic transition-all flex items-center gap-1.5 cursor-pointer ${
                filterFeaturedOnly
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300/80'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <Heart size={13} className={filterFeaturedOnly ? 'fill-current text-rose-600' : ''} />
              <span>{filterFeaturedOnly ? 'Showing Featured' : 'Featured Only'}</span>
            </button>

            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-400'
                }`}
                aria-label="Grid layout"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layoutMode === 'list'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-400'
                }`}
                aria-label="List layout"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Ribbon */}
        <div className="space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-amber-50 dark:bg-emerald-400 dark:text-stone-950 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800'
                }`}
              >
                {cat === 'Act of Kindness'
                  ? 'Act of Kindness (نیکی)'
                  : cat === 'Acts That Matter'
                  ? 'Acts That Matter (احساس)'
                  : cat}
              </button>
            ))}
          </div>

          {/* Contextual category moment prompt */}
          <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-300">
              <Sparkles size={15} className="text-amber-600 shrink-0" />
              <span>
                Add a new moment under <strong>{selectedCategory === 'All' ? 'any category' : selectedCategory}</strong> (maximum <strong>200 words</strong>).
              </span>
            </div>
            <button
              onClick={() => navigate('/moments/new')}
              className="px-4 py-2 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-serif text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <span>+ Add Moment ({selectedCategory === 'All' ? 'New' : selectedCategory})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Search & Sort Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:max-w-md">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search listings by title, story, city, or person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <span className="text-stone-400 font-serif italic">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="latest">Newest First (تازہ ترین)</option>
                <option value="oldest">Oldest First (ابتدائی)</option>
                <option value="kindness">Acts of Kindness First (نیکی ترجیح)</option>
                <option value="az">Title Alphabetical (الف تا ے)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Result Display */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw size={24} className="animate-spin mx-auto text-emerald-700 dark:text-emerald-400" />
            <p className="text-xs font-serif text-stone-500 italic">Reading database listings...</p>
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl space-y-3">
            <Bookmark size={28} className="mx-auto text-stone-300 dark:text-stone-700" />
            <h3 className="font-serif text-2xl text-stone-800 dark:text-stone-200">
              No matching listings found
            </h3>
            <p className="text-xs text-stone-500 font-serif italic max-w-sm mx-auto">
              Try adjusting your category filter, clearing your search query, or record a new moment.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setFilterFeaturedOnly(false);
                }}
                className="px-5 py-2 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div
            className={
              layoutMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {displayedListings.map((mem) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                layout={layoutMode}
                onClick={() => {
                  setSelectedMemoryId(mem.id);
                  navigate(`/moments/${mem.id}`);
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
