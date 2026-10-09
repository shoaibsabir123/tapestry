import React from 'react';
import { useTapestry } from '../../context/TapestryContext';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/Toast';
import { QuickCaptureModal } from '../common/QuickCaptureModal';
import { MemoryPreviewModal } from '../common/MemoryPreviewModal';
import {
  Compass,
  Sparkles,
  BookOpen,
  Image,
  Plus,
  Home,
  User
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    currentRoute,
    navigate,
    previewMemory,
    setPreviewMemory,
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    setSelectedMemoryId
  } = useTapestry();

  const isPublicOrLanding = currentRoute === '/' || currentRoute.startsWith('/shared/') || currentRoute === '/login' || currentRoute === '/signup' || currentRoute === '/onboarding';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0D0F12] text-[#1E1B18] dark:text-[#F3F1EC] transition-colors duration-300">
      {/* Top Navbar only on authenticated / inside-app views */}
      {!isPublicOrLanding && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible only on small screens for app views) */}
      {!isPublicOrLanding && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#0D0F12]/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800 px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer ${
              currentRoute === '/dashboard' ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-stone-400'
            }`}
          >
            <Home size={19} />
            <span className="text-[10px]">Sheeraza</span>
          </button>

          <button
            onClick={() => navigate('/constellation')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer ${
              currentRoute === '/constellation' ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-stone-400'
            }`}
          >
            <Compass size={19} />
            <span className="text-[10px]">Constellation</span>
          </button>

          {/* Prominent Center Add Button */}
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="-mt-5 w-12 h-12 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
            aria-label="Add moment"
          >
            <Plus size={22} />
          </button>

          <button
            onClick={() => navigate('/moments')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer ${
              currentRoute === '/moments' ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-stone-400'
            }`}
          >
            <BookOpen size={19} />
            <span className="text-[10px]">Moments</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer ${
              currentRoute === '/profile' ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-stone-400'
            }`}
          >
            <User size={19} />
            <span className="text-[10px]">Profile</span>
          </button>
        </nav>
      )}

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onOpenFullCreation={() => navigate('/moments/new')}
      />

      {/* Memory Preview Modal */}
      <MemoryPreviewModal
        memory={previewMemory}
        onClose={() => setPreviewMemory(null)}
        onViewFull={(id) => {
          setSelectedMemoryId(id);
          navigate(`/moments/${id}`);
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
