import React, { useState } from 'react';
import { useTapestry } from '../../context/TapestryContext';
import { X, Mic, Image, Sparkles, Feather, ArrowRight, Check } from 'lucide-react';
import { MemoryCategory } from '../../types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullCreation: () => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onOpenFullCreation
}) => {
  const { addMemory, navigate } = useTapestry();
  const [title, setTitle] = useState('');
  const [sentence, setSentence] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Discovery');
  const [imageUrl, setImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceMemo, setHasVoiceMemo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !sentence.trim()) return;

    setIsSubmitting(true);
    await addMemory({
      title: title.trim() || 'Fleeting Moment',
      story: sentence.trim() || 'A brief impression captured in the moment.',
      category,
      coverImageUrl: imageUrl || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80',
      date: new Date().toISOString().split('T')[0],
      emotionNervousElated: 60,
      emotionLonelyConnected: 70,
      emotionUncertainCertain: 60,
      emotionHeavyLight: 75,
      emotionQuietElectric: 65,
      audioUrl: hasVoiceMemo ? 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg' : '',
      audioDuration: hasVoiceMemo ? 15 : 0
    });
    setIsSubmitting(false);
    onClose();
    setTitle('');
    setSentence('');
    setImageUrl('');
    setHasVoiceMemo(false);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasVoiceMemo(true);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
            Fleeting Impression
          </span>
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
            Capture what just happened
          </h2>
          <p className="text-xs text-stone-500 font-serif italic mt-0.5">
            Hold the moment now. You can return to write the full story later.
          </p>
        </div>

        <form onSubmit={handleQuickSave} className="space-y-4">
          <div>
            <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
              Give this moment a name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Standing on the bridge at sunrise..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-600 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
              One sentence to anchor the feeling
            </label>
            <textarea
              rows={2}
              placeholder="Start anywhere. What did it feel like?"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-600 font-serif text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="Act of Kindness">Act of Kindness</option>
                <option value="Acts That Matter">Acts That Matter</option>
                <option value="Discovery">Discovery</option>
                <option value="Achievement">Achievement</option>
                <option value="Adventure">Adventure</option>
                <option value="Connection">Connection</option>
                <option value="Transition">Transition</option>
                <option value="Creativity">Creativity</option>
                <option value="Family">Family</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                Photo URL (optional)
              </label>
              <input
                type="text"
                placeholder="Paste image link..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Voice Aura Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSimulateVoice}
              disabled={isRecording || hasVoiceMemo}
              className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                hasVoiceMemo
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : isRecording
                  ? 'border-rose-400 bg-rose-50 text-rose-800 animate-pulse'
                  : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {hasVoiceMemo ? (
                <>
                  <Check size={14} /> Voice Aura attached (15s)
                </>
              ) : isRecording ? (
                <>
                  <Mic size={14} className="text-rose-600" /> Recording fleeting thought...
                </>
              ) : (
                <>
                  <Mic size={14} /> Record quick voice note (15s)
                </>
              )}
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/record-chronicle');
                }}
                className="font-serif text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors cursor-pointer font-medium"
              >
                <Feather size={13} />
                <span>Write 2,000-word Chronicle under category</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullCreation();
                }}
                className="font-serif text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
              >
                <span>Or take guided 6-step reflection</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Weaving...' : 'Save moment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
