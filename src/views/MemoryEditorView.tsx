import React, { useState, useEffect } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { Memory, MemoryCategory } from '../types';
import { CATEGORY_COLORS } from '../utils/theme';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';
import { AudioAuraRecorder } from '../components/common/AudioAuraRecorder';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Volume2,
  Image,
  Upload,
  X,
  Compass,
  MapPin,
  Users,
  Tag,
  Feather,
  Wand2,
  AlertCircle
} from 'lucide-react';

interface MemoryEditorViewProps {
  editMemoryId?: string | null;
}

export const MemoryEditorView: React.FC<MemoryEditorViewProps> = ({ editMemoryId }) => {
  const { memories, addMemory, updateMemory, chapters, people, navigate, setSelectedMemoryId } = useTapestry();

  // Find existing memory if editing
  const existing = editMemoryId ? memories.find((m) => m.id === editMemoryId) : null;

  // Step state (1 to 6, plus 7 for celebration finish)
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [createdMemoryId, setCreatedMemoryId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState(existing?.title || '');
  const [date, setDate] = useState(existing?.date || new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(existing?.location || '');
  const [category, setCategory] = useState<MemoryCategory>(existing?.category || 'Adventure');
  const [story, setStory] = useState(existing?.story || '');
  
  // Emotional Pulse sliders (0-100)
  const [emotionNervousElated, setEmotionNervousElated] = useState(existing?.emotionNervousElated ?? 65);
  const [emotionLonelyConnected, setEmotionLonelyConnected] = useState(existing?.emotionLonelyConnected ?? 75);
  const [emotionUncertainCertain, setEmotionUncertainCertain] = useState(existing?.emotionUncertainCertain ?? 60);
  const [emotionHeavyLight, setEmotionHeavyLight] = useState(existing?.emotionHeavyLight ?? 80);
  const [emotionQuietElectric, setEmotionQuietElectric] = useState(existing?.emotionQuietElectric ?? 70);

  // Audio Aura
  const [audioUrl, setAudioUrl] = useState(existing?.audioUrl || '');
  const [audioDuration, setAudioDuration] = useState(existing?.audioDuration || 0);

  // Artifacts & Images
  const [coverImageUrl, setCoverImageUrl] = useState(existing?.coverImageUrl || '');
  const [artifactUrls, setArtifactUrls] = useState<string[]>(existing?.artifactUrls || []);
  const [newArtifactInput, setNewArtifactInput] = useState('');

  // Reflection & Metadata
  const [reflectionPrompt, setReflectionPrompt] = useState(
    existing?.reflectionPrompt || 'What did you notice first when this happened?'
  );
  const [reflectionAnswer, setReflectionAnswer] = useState(existing?.reflectionAnswer || '');
  const [selectedPeople, setSelectedPeople] = useState<string[]>(existing?.people || []);
  const [newPersonName, setNewPersonName] = useState('');
  const [tags, setTags] = useState<string[]>(existing?.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>(existing?.chapterIds || []);

  // Word limits (maximum 2000 words)
  const MAX_WORDS = 2000;
  const storyWordsArray = story.trim() ? story.trim().split(/\s+/).filter(Boolean) : [];
  const storyWordCount = storyWordsArray.length;
  const isStoryOverLimit = storyWordCount > MAX_WORDS;

  const handleTrimStory = () => {
    if (isStoryOverLimit) {
      const trimmed = storyWordsArray.slice(0, MAX_WORDS).join(' ');
      setStory(trimmed);
    }
  };

  // AI Assistant state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);

  const categoryPresets: MemoryCategory[] = [
    'Act of Kindness',
    'Acts That Matter',
    'Achievement',
    'Adventure',
    'Connection',
    'Transition',
    'Discovery',
    'Creativity',
    'Family',
    'Other'
  ];

  // Curated prompts based on category
  const defaultPromptsByCategory: Record<MemoryCategory, string[]> = {
    'Act of Kindness': [
      'What prompted you to step forward when you could have walked away?',
      'Who was touched by this quiet grace, and what shifted in the room?',
      'What unexpected ripple did this moment set in motion?'
    ],
    'Acts That Matter': [
      'Why did this moment matter more than any external applause or status?',
      'What did this teach you about quiet presence and loyalty?',
      'What truth about your own humanity did this hour solidify?'
    ],
    Achievement: [
      'What did it take to get here that nobody else ever saw?',
      'What would you tell the version of yourself who began this journey?',
      'What almost stopped you from continuing?'
    ],
    Adventure: [
      'What did the air smell like in that exact second?',
      'What surprised you about how the world felt far from home?',
      'What would you remember if the photographs disappeared?'
    ],
    Connection: [
      'What was left unsaid between you in that moment?',
      'What did this person awaken in your understanding of yourself?',
      'What do you hope you will always remember about their presence?'
    ],
    Transition: [
      'What were you quietly leaving behind at the threshold?',
      'What were you most afraid of losing by moving forward?',
      'What changed within you once the decision was sealed?'
    ],
    Discovery: [
      'What did you notice first when your perception shifted?',
      'How did this quiet moment reorient your priorities?',
      'What mystery remained after the discovery?'
    ],
    Creativity: [
      'What were you trying to express that words could not capture?',
      'When did the work finally begin to feel real?',
      'What made you keep returning to the blank page?'
    ],
    Family: [
      'What generational thread did you feel passing through this hour?',
      'What ordinary gesture felt sacred in retrospect?',
      'What do you wish your ancestors or descendants knew about this day?'
    ],
    Other: [
      'What does this moment mean to you when you look back on it now?',
      'What feeling still lingers like an afterglow?'
    ]
  };

  useEffect(() => {
    const list = defaultPromptsByCategory[category] || defaultPromptsByCategory.Other;
    setSuggestedPrompts(list);
    if (!existing?.reflectionPrompt) {
      setReflectionPrompt(list[0]);
    }
  }, [category]);

  // AI Assist handler
  const handleAiAssist = async (action: 'clarify' | 'expand' | 'emotional-core' | 'begin') => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/writing-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: story,
          category,
          title
        })
      });
      const data = await res.json();
      setAiSuggestion(data.suggestion);
    } catch {
      setAiSuggestion('Looking back, the silence of that hour held a quiet truth that took months to understand.');
    } finally {
      setAiLoading(false);
    }
  };

  // Add Artifact URL
  const handleAddArtifact = () => {
    if (!newArtifactInput.trim()) return;
    setArtifactUrls((prev) => [...prev, newArtifactInput.trim()]);
    setNewArtifactInput('');
  };

  // Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
    }
    setNewTagInput('');
  };

  // Add Person
  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    if (!selectedPeople.includes(newPersonName.trim())) {
      setSelectedPeople((prev) => [...prev, newPersonName.trim()]);
    }
    setNewPersonName('');
  };

  // Save Memory
  const handleSaveMemory = async () => {
    setIsFinishing(true);

    const payload: Partial<Memory> = {
      title: title.trim() || 'Untitled Moment',
      date,
      location,
      category,
      coverImageUrl:
        coverImageUrl ||
        artifactUrls[0] ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      artifactUrls,
      story: story.trim(),
      emotionNervousElated,
      emotionLonelyConnected,
      emotionUncertainCertain,
      emotionHeavyLight,
      emotionQuietElectric,
      audioUrl,
      audioDuration,
      people: selectedPeople,
      tags,
      chapterIds: selectedChapters,
      reflectionPrompt,
      reflectionAnswer,
      favorite: existing?.favorite || false,
      visibility: 'private'
    };

    let savedId = '';
    if (existing) {
      await updateMemory(existing.id, payload);
      savedId = existing.id;
    } else {
      const created = await addMemory(payload);
      savedId = created.id;
    }

    setCreatedMemoryId(savedId);
    setCurrentStep(7); // Show woven celebration
    setIsFinishing(false);
  };

  // Step 7: Glowing Constellation Weaving Celebration
  if (currentStep === 7) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Glowing constellation node pulsing */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-amber-400/20 dark:bg-amber-400/10 animate-ping absolute inset-0" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-rose-400 to-sky-400 p-0.5 shadow-2xl flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-full bg-[#FAF8F5] dark:bg-stone-900 flex items-center justify-center">
              <Sparkles size={32} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
          شیرازۂ حیات · The Living Chronicle
        </span>
        <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-light text-stone-900 dark:text-stone-100">
          Another thread has been woven.
        </h1>
        <p className="mt-3 text-base text-stone-500 dark:text-stone-400 font-serif italic max-w-md">
          “{title || 'This moment'}” has taken its place in your constellation. Your story is becoming clearer.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => {
              if (createdMemoryId) {
                setSelectedMemoryId(createdMemoryId);
                navigate(`/moments/${createdMemoryId}`);
              } else {
                navigate('/moments');
              }
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-sm font-medium hover:bg-stone-800 transition-all shadow-md cursor-pointer"
          >
            View memory
          </button>
          <button
            onClick={() => navigate('/constellation')}
            className="w-full sm:w-auto px-7 py-3 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm hover:border-stone-500 transition-all cursor-pointer"
          >
            Explore constellation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Progress */}
      <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4">
        <button
          onClick={() => navigate('/moments')}
          className="text-xs font-serif text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Archive</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-serif text-stone-400">Step {currentStep} of 6</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === currentStep
                    ? 'w-6 bg-stone-900 dark:bg-stone-100'
                    : s < currentStep
                    ? 'w-2 bg-stone-400 dark:bg-stone-600'
                    : 'w-2 bg-stone-200 dark:bg-stone-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: THE MOMENT */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Step 1
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
              What happened?
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Anchor this moment with a title, a place, and a date.
            </p>
          </div>

          <div className="space-y-4 bg-white/60 dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800">
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                Title of the moment
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Day I Finally Said Yes, or Standing by the AlUla Canyons..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-600 font-serif text-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                  When did this take place?
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                  Where were you standing?
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="e.g. Riyadh, Kyoto, Old Family Kitchen..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoryPresets.map((cat) => {
                  const cfg = CATEGORY_COLORS[cat];
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-stone-100 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: cfg.accent }}
                      />
                      <span className="text-xs font-medium">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: TELL THE STORY */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Step 2
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
              Tell the story in your own words.
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Start anywhere. Don’t worry about grammar or polished prose—capture the raw truth.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-stone-500">
              <span className="font-serif italic text-stone-600 dark:text-stone-400">
                Write up to 2,000 words:
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={
                    isStoryOverLimit
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : storyWordCount > 1800
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-stone-700 dark:text-stone-300'
                  }
                >
                  {storyWordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
                </span>
                {isStoryOverLimit && (
                  <button
                    type="button"
                    onClick={handleTrimStory}
                    className="text-xs text-rose-600 hover:text-rose-700 underline font-sans cursor-pointer"
                  >
                    Trim excess
                  </button>
                )}
              </div>
            </div>

            {/* Word count progress bar */}
            <div className="w-full h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  isStoryOverLimit ? 'bg-rose-500' : storyWordCount > 1800 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (storyWordCount / MAX_WORDS) * 100)}%` }}
              />
            </div>

            {isStoryOverLimit && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-600" />
                <span>
                  Maximum 2,000 words allowed. Please edit or click <strong>Trim excess</strong> before proceeding.
                </span>
              </div>
            )}

            <textarea
              rows={8}
              placeholder="I remember sitting in my car for almost twenty minutes before calling back... The desert heat was fading into that soft violet dusk..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-4 py-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-600 font-serif text-base leading-relaxed resize-y"
            />

            {/* AI Writing Companions (Assistive, respectful of original voice) */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-serif text-stone-400 flex items-center gap-1">
                  <Wand2 size={13} className="text-amber-600" />
                  <span>AI Reflection Assistance:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleAiAssist('begin')}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 hover:border-stone-400 cursor-pointer"
                >
                  Help me begin
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAssist('clarify')}
                  disabled={aiLoading || !story}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 hover:border-stone-400 cursor-pointer disabled:opacity-40"
                >
                  Make this clearer
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAssist('expand')}
                  disabled={aiLoading || !story}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 hover:border-stone-400 cursor-pointer disabled:opacity-40"
                >
                  Sensory expansion
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAssist('emotional-core')}
                  disabled={aiLoading || !story}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 hover:border-stone-400 cursor-pointer disabled:opacity-40"
                >
                  Find emotional core
                </button>
              </div>

              {aiLoading && (
                <p className="mt-2 text-xs font-serif italic text-amber-700 animate-pulse">
                  Listening to the cadence of your memory...
                </p>
              )}

              {aiSuggestion && !aiLoading && (
                <div className="mt-3 p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
                  <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-serif font-medium mb-1">
                    <span>Suggested Reflection</span>
                    <button
                      type="button"
                      onClick={() => setAiSuggestion(null)}
                      className="text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs font-serif italic text-stone-700 dark:text-stone-300 leading-relaxed">
                    “{aiSuggestion}”
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setStory((prev) => (prev ? `${prev}\n\n${aiSuggestion}` : aiSuggestion));
                        setAiSuggestion(null);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-800 text-white text-[11px] hover:bg-amber-900 cursor-pointer"
                    >
                      Append to story
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EMOTIONAL PULSE */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Step 3
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
              Emotional Pulse
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Slide to map the emotional currents of that moment. Your choices create an enduring harmonic fingerprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/60 dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800">
            {/* Sliders */}
            <div className="space-y-5">
              {/* Slider 1: Nervous <-> Elated */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>Nervous</span>
                  <span className="font-mono text-stone-400">{emotionNervousElated}</span>
                  <span>Elated</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionNervousElated}
                  onChange={(e) => setEmotionNervousElated(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Slider 2: Lonely <-> Connected */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>Lonely</span>
                  <span className="font-mono text-stone-400">{emotionLonelyConnected}</span>
                  <span>Connected</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionLonelyConnected}
                  onChange={(e) => setEmotionLonelyConnected(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Slider 3: Uncertain <-> Certain */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>Uncertain</span>
                  <span className="font-mono text-stone-400">{emotionUncertainCertain}</span>
                  <span>Certain</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionUncertainCertain}
                  onChange={(e) => setEmotionUncertainCertain(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Slider 4: Heavy <-> Light */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>Heavy</span>
                  <span className="font-mono text-stone-400">{emotionHeavyLight}</span>
                  <span>Light</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionHeavyLight}
                  onChange={(e) => setEmotionHeavyLight(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Slider 5: Quiet <-> Electric */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>Quiet</span>
                  <span className="font-mono text-stone-400">{emotionQuietElectric}</span>
                  <span>Electric</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionQuietElectric}
                  onChange={(e) => setEmotionQuietElectric(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Visualizer Radar */}
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-800 pt-6 md:pt-0 md:pl-6">
              <span className="text-xs uppercase tracking-widest text-stone-400 mb-3">
                Live Harmonic Aura
              </span>
              <EmotionalPulseVisualizer
                nervousElated={emotionNervousElated}
                lonelyConnected={emotionLonelyConnected}
                uncertainCertain={emotionUncertainCertain}
                heavyLight={emotionHeavyLight}
                quietElectric={emotionQuietElectric}
                size="md"
                showLabels={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: AUDIO AURA */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Step 4
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
              Audio Aura
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Record a 60-second voice memo. Say what the photograph or written words can’t capture.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800">
            <AudioAuraRecorder
              existingAudioUrl={audioUrl}
              existingDuration={audioDuration}
              onAudioSaved={(url, duration) => {
                setAudioUrl(url);
                setAudioDuration(duration);
              }}
            />
          </div>
        </div>
      )}

      {/* STEP 5: ARTIFACTS & PHOTOGRAPHS */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Step 5
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
              Artifacts & Evidence
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Preserve the visual keepsakes: photos, tickets, scans, or handwritten notes.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-6">
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                Primary Cover Photograph URL
              </label>
              <input
                type="text"
                placeholder="Paste photograph link (Unsplash or direct image URL)..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none"
              />
              {coverImageUrl && (
                <div className="mt-3 w-48 h-32 rounded-xl overflow-hidden border border-stone-200">
                  <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                Additional Artifacts & Keepsake Images
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste artifact image URL..."
                  value={newArtifactInput}
                  onChange={(e) => setNewArtifactInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddArtifact}
                  className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Add artifact
                </button>
              </div>

              {/* Artifacts grid */}
              {artifactUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {artifactUrls.map((url, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden h-28 border border-stone-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setArtifactUrls((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: REFLECTION PROMPTS & WEAVING METADATA */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Step 6
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
              Reflection & Connections
            </h2>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Stay here for a moment. Answer the deeper question and link the people who made it sacred.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-6">
            {/* Reflection question select / custom */}
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                Category Reflection Prompt
              </label>
              <select
                value={reflectionPrompt}
                onChange={(e) => setReflectionPrompt(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none mb-2"
              >
                {suggestedPrompts.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>

              <textarea
                rows={3}
                placeholder="What did you learn about yourself? What does this mean now?"
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-xs font-serif italic focus:outline-none leading-relaxed"
              />
            </div>

            {/* People tagging */}
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                <Users size={13} className="text-stone-400" />
                <span>Who was with you?</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Sarah, Dad, Ahmed..."
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPerson}
                  className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Tag person
                </button>
              </div>

              {selectedPeople.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPeople.map((person) => (
                    <span
                      key={person}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300"
                    >
                      {person}
                      <button
                        type="button"
                        onClick={() => setSelectedPeople((prev) => prev.filter((p) => p !== person))}
                        className="text-stone-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-stone-400" />
                <span>Tags / Themes</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. turning-point, courage, travel..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Add tag
                </button>
              </div>

              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs text-stone-600 dark:text-stone-300"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => setTags((prev) => prev.filter((item) => item !== t))}
                        className="text-stone-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Chapter connection */}
            {chapters.length > 0 && (
              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                  Associate with Life Chapter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {chapters.map((chap) => {
                    const isChecked = selectedChapters.includes(chap.id);
                    return (
                      <button
                        key={chap.id}
                        type="button"
                        onClick={() => {
                          setSelectedChapters((prev) =>
                            isChecked ? prev.filter((id) => id !== chap.id) : [...prev, chap.id]
                          );
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'border-amber-600 bg-amber-50/60 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        <span className="font-serif font-medium">{chap.title}</span>
                        {isChecked && <Check size={14} className="text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons Between Steps */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 dark:border-stone-800">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium hover:border-stone-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1 && !title.trim()) {
                setTitle('A Moment in Time');
              }
              setCurrentStep((prev) => prev + 1);
            }}
            className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSaveMemory}
            disabled={isFinishing}
            className="px-7 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={15} />
            <span>{isFinishing ? 'Weaving thread...' : 'Weave this into your tapestry'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
