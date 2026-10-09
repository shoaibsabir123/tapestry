import React from 'react';
import { useTapestry } from '../../context/TapestryContext';
import { Sparkles } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useTapestry();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-900/95 dark:bg-stone-100/95 text-stone-100 dark:text-stone-900 shadow-xl backdrop-blur-md border border-stone-800 dark:border-stone-200 animate-in slide-in-from-bottom-3 duration-300"
        >
          <Sparkles size={16} className="text-amber-400 dark:text-amber-600 shrink-0" />
          <p className="text-xs font-serif italic tracking-wide">
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
};
