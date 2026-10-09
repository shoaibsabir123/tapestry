import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { ArrowRight, Check, Sparkles, Heart } from 'lucide-react';
import { MemoryCategory } from '../types';

export const OnboardingView: React.FC = () => {
  const { user, updateProfile, addMemory, navigate } = useTapestry();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.displayName || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Adventures',
    'Transitions',
    'Family'
  ]);
  const [firstMomentTitle, setFirstMomentTitle] = useState('');
  const [firstMomentStory, setFirstMomentStory] = useState('');
  const [firstMomentCategory, setFirstMomentCategory] = useState<MemoryCategory>('Transition');
  const [isFinishing, setIsFinishing] = useState(false);

  const interestOptions = [
    'Acts of Kindness',
    'Moments That Matter',
    'Achievements',
    'Adventures',
    'Relationships',
    'Family',
    'Creativity',
    'Personal growth',
    'Transitions',
    'Everyday moments'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFinishOnboarding = async () => {
    setIsFinishing(true);
    await updateProfile({
      displayName: name.trim() || 'Traveler',
      onboardingCompleted: true
    });

    if (firstMomentTitle.trim()) {
      await addMemory({
        title: firstMomentTitle.trim(),
        story: firstMomentStory.trim() || 'The beginning of an intentional archive.',
        category: firstMomentCategory,
        date: new Date().toISOString().split('T')[0],
        coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        favorite: true
      });
    }

    setIsFinishing(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF8F5] dark:bg-[#0D0F12] text-stone-900 dark:text-stone-100">
      <div className="w-full max-w-xl bg-white/70 dark:bg-stone-900/60 p-8 sm:p-12 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs font-serif text-stone-400">
          <span>Sanctuary Initiation</span>
          <span>Step {step} of 4</span>
        </div>

        {/* STEP 1: What should we call you? */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                Step 1
              </span>
              <h2 className="font-serif text-3xl font-light mt-1">
                What should we call you?
              </h2>
              <p className="text-xs text-stone-500 font-serif italic mt-0.5">
                Every autobiography begins with an authentic identity.
              </p>
            </div>

            <div>
              <input
                type="text"
                autoFocus
                placeholder="Your name or preferred moniker..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-lg font-serif focus:outline-none focus:border-stone-600"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (name.trim()) updateProfile({ displayName: name.trim() });
                  setStep(2);
                }}
                className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: What would you like to remember? */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                Step 2
              </span>
              <h2 className="font-serif text-3xl font-light mt-1">
                What would you like to remember?
              </h2>
              <p className="text-xs text-stone-500 font-serif italic mt-0.5">
                Select the currents of life you wish to protect from forgetting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`p-3 rounded-xl border text-left text-xs font-serif transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={14} className="text-amber-600" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-stone-500 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: First Memory */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                Step 3
              </span>
              <h2 className="font-serif text-3xl font-light mt-1">
                What is one moment you'll never forget?
              </h2>
              <p className="text-xs text-stone-500 font-serif italic mt-0.5">
                Anchor your sanctuary with its initial thread.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. The first morning in my own apartment..."
                  value={firstMomentTitle}
                  onChange={(e) => setFirstMomentTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-serif focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  One or two sentences about that feeling
                </label>
                <textarea
                  rows={3}
                  placeholder="Start anywhere. What happened?"
                  value={firstMomentStory}
                  onChange={(e) => setFirstMomentStory(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-serif leading-relaxed focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs text-stone-500 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isFinishing}
                className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={14} />
                <span>{isFinishing ? 'Weaving...' : 'Weave first memory'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Your tapestry has begun */}
        {step === 4 && (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto shadow-xl">
              <Sparkles size={36} className="animate-pulse" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-mono">
                شیرازہ بندی مکمل · Complete
              </span>
              <h1 className="font-serif text-4xl font-light text-stone-900 dark:text-stone-100 mt-2">
                Your chronicle has begun.
              </h1>
              <p className="text-sm text-stone-500 font-serif italic mt-2 max-w-sm mx-auto">
                Welcome to your sanctuary, {name || 'Seeker'}. Your life is a collection of moments, and Sheeraza is here to weave the story they create.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-amber-50 text-sm font-medium transition-all shadow-md cursor-pointer"
              >
                Enter your living Sheeraza (شیرازہ)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
