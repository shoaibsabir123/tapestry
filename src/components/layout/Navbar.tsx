import React, { useState } from 'react';
import { useTapestry } from '../../context/TapestryContext';
import {
  Search,
  Moon,
  Sun,
  Plus,
  Compass,
  Sparkles,
  BookOpen,
  Calendar,
  Image,
  Heart,
  User,
  Sliders,
  LogOut,
  Layers,
  ChevronDown,
  Feather,
  Shield
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    navigate,
    currentRoute,
    setIsQuickCaptureOpen,
    searchQuery,
    setSearchQuery,
    logout
  } = useTapestry();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/moments');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-[#0D0F12]/90 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-stone-100 dark:text-stone-900 shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif text-sm font-semibold tracking-wider">ش</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100 block leading-tight">
                  Sheeraza
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-serif font-light">
                  شیرازہ
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-serif italic block -mt-0.5">
                Living Chronicle · نیکی و یادیں
              </span>
            </div>
          </button>

          {/* Desktop primary links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-stone-600 dark:text-stone-300">
            <button
              onClick={() => navigate('/dashboard')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentRoute === '/dashboard' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              Living Sanctuary
            </button>
            <button
              onClick={() => navigate('/constellation')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentRoute === '/constellation' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              Constellation
            </button>
            <button
              onClick={() => navigate('/listings')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 flex items-center gap-1 ${
                currentRoute === '/listings' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              <span>Featured & Latest</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-serif">نمایاں</span>
            </button>
            <button
              onClick={() => navigate('/record-chronicle')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-medium ${
                currentRoute === '/record-chronicle' ? 'border-b-2 border-emerald-600' : ''
              }`}
              title="Record up to 2,000 words under each category"
            >
              <Feather size={13} />
              <span>Record Chronicle</span>
              <span className="text-[10px] opacity-75 font-serif">قلم</span>
            </button>
            <button
              onClick={() => navigate('/corporate')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 flex items-center gap-1.5 ${
                currentRoute === '/corporate' || currentRoute === '/governance' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
              title="Corporate Governance, Database & Audit"
            >
              <Shield size={13} className="text-amber-600" />
              <span>Governance</span>
            </button>
            <button
              onClick={() => navigate('/moments')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentRoute === '/moments' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              Moments
            </button>
            <button
              onClick={() => navigate('/chapters')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentRoute === '/chapters' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              Chapters
            </button>
            <button
              onClick={() => navigate('/reflections')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentRoute === '/reflections' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              Reflections
            </button>
            <button
              onClick={() => navigate('/gallery')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentRoute === '/gallery' ? 'font-medium text-stone-900 dark:text-white border-b-2 border-amber-600' : ''
              }`}
            >
              Gallery
            </button>
          </nav>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search your life..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 rounded-full text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
            />
          </form>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Toggle night sky theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Global + Add moment */}
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium text-xs flex items-center gap-1.5 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add moment</span>
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <img
                src={user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-stone-700"
              />
              <ChevronDown size={13} className="text-stone-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-serif font-medium text-stone-900 dark:text-stone-100">
                      {user?.displayName || 'Traveler'}
                    </p>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/60">
                      {user?.role || 'admin'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 truncate">
                    {user?.email || 'sanctuary@sheeraza.life'}
                  </p>
                </div>

                <div className="py-1 text-xs text-stone-600 dark:text-stone-300">
                  <button
                    onClick={() => navigate('/corporate')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer text-amber-800 dark:text-amber-400 font-medium"
                  >
                    <Shield size={14} className="text-amber-600" />
                    <span>Corporate Governance & DB</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <User size={14} className="text-stone-400" />
                    <span>Your Sanctuary Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/listings')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer text-emerald-800 dark:text-emerald-400 font-medium"
                  >
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Featured & Latest Listings (نمایاں)</span>
                  </button>
                  <button
                    onClick={() => navigate('/record-chronicle')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer text-emerald-800 dark:text-emerald-400 font-medium"
                  >
                    <Feather size={14} className="text-emerald-600" />
                    <span>Record Chronicle (Max 2,000w)</span>
                  </button>
                  <button
                    onClick={() => navigate('/timeline')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Calendar size={14} className="text-stone-400" />
                    <span>Chronological Timeline</span>
                  </button>
                  <button
                    onClick={() => navigate('/favorites')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Heart size={14} className="text-stone-400" />
                    <span>Close to Heart</span>
                  </button>
                  <button
                    onClick={() => navigate('/export')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen size={14} className="text-stone-400" />
                    <span>Keepsake Book Export</span>
                  </button>
                  <button
                    onClick={() => navigate('/insights')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sparkles size={14} className="text-stone-400" />
                    <span>Life Insights</span>
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sliders size={14} className="text-stone-400" />
                    <span>Settings & Privacy</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
