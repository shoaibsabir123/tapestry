import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import {
  Sliders,
  Moon,
  Sun,
  Shield,
  Bell,
  Sparkles,
  Download,
  Trash2,
  Lock,
  Key,
  Check
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, theme, toggleTheme, updateProfile, showToast, navigate } = useTapestry();
  const [aiEnabled, setAiEnabled] = useState(user?.aiEnabled ?? true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDay, setReminderDay] = useState('Last Sunday of Month');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    showToast('Sanctuary password updated.');
    setTimeout(() => {
      setPasswordSuccess(false);
      setOldPassword('');
      setNewPassword('');
    }, 3000);
  };

  const handleToggleAi = async () => {
    const next = !aiEnabled;
    setAiEnabled(next);
    await updateProfile({ aiEnabled: next });
    showToast(next ? 'AI reflection assistance enabled.' : 'AI assistance disabled. Pure manual writing mode.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely certain? This will delete your local profile, all woven moments, audio auras, and chapters. This action cannot be reversed.')) {
      localStorage.clear();
      showToast('Account data cleared.');
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
          Preferences
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
          Settings & Sanctuary Controls
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
          Configure privacy boundaries, atmospheric theme, and reflection notifications.
        </p>
      </div>

      {/* Theme Section */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-4">
        <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
          Atmospheric Appearance
        </h3>
        <p className="text-xs text-stone-500 font-serif italic">
          Choose between Warm Ivory (gentle day journal) and Quiet Night Sky (deep starlight cosmos).
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-stone-900 bg-stone-100 text-stone-900 shadow-xs'
                : 'border-stone-200 text-stone-500 hover:border-stone-400'
            }`}
          >
            <Sun size={15} />
            <span>Warm Ivory (Light)</span>
          </button>

          <button
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-stone-100 bg-stone-800 text-stone-100 shadow-xs'
                : 'border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            <Moon size={15} />
            <span>Quiet Night Sky (Dark)</span>
          </button>
        </div>
      </div>

      {/* AI Assistance Toggle */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              <span>AI-Assisted Reflection Companions</span>
            </h3>
            <p className="text-xs text-stone-500 font-serif italic max-w-lg">
              When enabled, Sheeraza offers optional prompts, clarity suggestions, and chapter themes. Your voice is never overwritten.
            </p>
          </div>

          <button
            onClick={handleToggleAi}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              aiEnabled ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                aiEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Monthly Reflection Reminder */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Bell size={16} className="text-stone-400" />
              <span>Monthly Reflection Ritual Reminders</span>
            </h3>
            <p className="text-xs text-stone-500 font-serif italic">
              A gentle notification: “Your September story is waiting.”
            </p>
          </div>

          <button
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              reminderEnabled ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-stone-900 transition-transform ${
                reminderEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security & Password */}
      <form onSubmit={handlePasswordSubmit} className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-4">
        <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Lock size={16} className="text-stone-400" />
          <span>Security & Password</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-serif text-stone-500 mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-serif text-stone-500 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Dangerous Zone */}
      <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/10 space-y-3">
        <h3 className="font-serif text-lg font-medium text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <Trash2 size={16} />
          <span>Erase Sanctuary Archive</span>
        </h3>
        <p className="text-xs text-rose-700/80 dark:text-rose-400 font-serif italic">
          Permanently delete all woven threads, voice recordings, and life chapters.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Clear Archive & Reset
        </button>
      </div>
    </div>
  );
};
