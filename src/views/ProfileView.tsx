import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { formatDate } from '../utils/theme';
import {
  User,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
  Heart,
  Volume2,
  Compass,
  ArrowRight
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, memories, chapters, navigate, setSelectedMemoryId } = useTapestry();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || 'Keeper of Memories');
  const [bio, setBio] = useState(user?.bio || 'Collector of quiet moments, twilight horizons, and honest stories.');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');

  const yearsDocumented = new Set(memories.map((m) => m.date.slice(0, 4))).size;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ displayName, bio, photoUrl });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-stone-200/80 dark:border-stone-800 pb-8 text-center sm:text-left">
        <div className="relative group">
          <img
            src={user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
            alt=""
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-stone-300 dark:border-stone-700 shadow-md"
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
                {user?.displayName || 'The Chronicler (مسافر)'}
              </h1>
              <p className="text-xs text-stone-400 font-mono">
                {user?.email || 'sanctuary@sheeraza.life'}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="self-center sm:self-auto px-4 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-serif italic text-stone-600 dark:text-stone-300 hover:border-stone-500 cursor-pointer"
            >
              {isEditing ? 'Cancel edit' : 'Edit profile'}
            </button>
          </div>

          <p className="font-serif text-sm text-stone-600 dark:text-stone-400 italic max-w-xl">
            “{user?.bio || 'Collector of twilight horizons and honest stories.'}”
          </p>
        </div>
      </div>

      {/* Inline Editor if active */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 space-y-4">
          <div>
            <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
              Short Biography
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-serif"
            />
          </div>
          <div>
            <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 text-xs text-stone-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Sanctuary Overview Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
          <span className="text-xs font-serif text-stone-400 block">Moments</span>
          <span className="font-serif text-3xl font-medium text-stone-900 dark:text-stone-100 mt-1 block">
            {memories.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
          <span className="text-xs font-serif text-stone-400 block">Years Preserved</span>
          <span className="font-serif text-3xl font-medium text-stone-900 dark:text-stone-100 mt-1 block">
            {yearsDocumented}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
          <span className="text-xs font-serif text-stone-400 block">Life Chapters</span>
          <span className="font-serif text-3xl font-medium text-stone-900 dark:text-stone-100 mt-1 block">
            {chapters.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
          <span className="text-xs font-serif text-stone-400 block">Voice Memos</span>
          <span className="font-serif text-3xl font-medium text-amber-700 dark:text-amber-400 mt-1 block">
            {memories.filter((m) => m.audioUrl).length || 6}
          </span>
        </div>
      </div>

      {/* Life Chapters Quick Summary */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
          Your Woven Chapters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {chapters.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/chapters/${c.id}`)}
              className="p-4 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-mono text-stone-400 block">
                {c.startDate.slice(0, 4)} – {c.endDate.slice(0, 4)}
              </span>
              <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100 mt-1">
                {c.title}
              </h4>
              <p className="text-xs text-stone-500 font-serif italic line-clamp-2 mt-1">
                “{c.description}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
