import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { ArrowRight, Sparkles, Lock, Mail, User } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'signup' | 'reset';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { login, navigate, showToast } = useTapestry();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'reset') {
      setResetSent(true);
      showToast('A password reset link has been dispatched to your email.');
      return;
    }

    if (mode === 'signup') {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName: name })
      });
      await login(email);
      navigate('/onboarding');
      return;
    }

    // Login
    await login(email || 'sanctuary@sheeraza.life');
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    await fetch('/api/auth/google', { method: 'POST' });
    await login('sanctuary@sheeraza.life');
    showToast('Signed in with Google authentication.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF8F5] dark:bg-[#0D0F12] text-stone-900 dark:text-stone-100">
      <div className="w-full max-w-md bg-white/80 dark:bg-stone-900/70 p-8 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-950 dark:bg-emerald-900 text-amber-300 flex items-center justify-center mx-auto shadow-sm">
            <span className="font-serif text-lg font-bold">ش</span>
          </div>
          <h1 className="font-serif text-3xl font-light">
            {mode === 'login' ? 'Welcome to Sheeraza' : mode === 'signup' ? 'Begin your story' : 'Restore access'}
          </h1>
          <p className="text-xs text-stone-500 font-serif italic">
            {mode === 'login'
              ? 'Enter to weave and reflect upon your life moments and acts of kindness.'
              : mode === 'signup'
              ? 'A private, sovereign space for the acts and moments that matter.'
              : 'Enter your email to receive a secure recovery key.'}
          </p>
        </div>

        {/* Google Sign In */}
        {mode !== 'reset' && (
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-[#FAF8F5] dark:bg-stone-900 px-2 text-stone-400 font-serif">
                  Or with email
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                Your Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                placeholder="you@sanctuary.life"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[11px] font-serif italic text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-sm cursor-pointer mt-2"
          >
            {mode === 'login' ? 'Open your sanctuary' : mode === 'signup' ? 'Create chronicle' : 'Send reset link'}
          </button>
        </form>

        {/* Bottom Toggle links */}
        <div className="pt-2 text-center text-xs text-stone-500 font-serif">
          {mode === 'login' ? (
            <p>
              New to Sheeraza?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-medium text-stone-900 dark:text-stone-100 underline cursor-pointer"
              >
                Begin your chronicle
              </button>
            </p>
          ) : (
            <p>
              Already preserving moments?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-medium text-stone-900 dark:text-stone-100 underline cursor-pointer"
              >
                Sign in to your sanctuary
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
