import React, { useState, useEffect, useMemo } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { MemoryCategory } from '../types';
import { CATEGORY_COLORS } from '../utils/theme';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';
import { AudioAuraRecorder } from '../components/common/AudioAuraRecorder';
import {
  Feather,
  BookOpen,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Calendar,
  Users,
  Tag,
  Heart,
  Volume2,
  Image as ImageIcon,
  Sliders,
  Maximize2,
  Minimize2,
  Info,
  AlertCircle,
  Clock,
  Compass,
  FileText,
  RotateCcw,
  Save,
  CheckCircle2,
  Bookmark,
  Building2
} from 'lucide-react';

const MAX_WORDS = 2000;

interface CategoryMeta {
  category: MemoryCategory;
  urdu: string;
  subtitle: string;
  description: string;
  prompts: string[];
  suggestedTags: string[];
}

const CATEGORY_DETAILS: Record<MemoryCategory, CategoryMeta> = {
  'Act of Kindness': {
    category: 'Act of Kindness',
    urdu: 'نیکی و خدمت',
    subtitle: 'Quiet grace and selfless deeds that alleviated someone’s burden',
    description: 'Record an act of compassion—either extended by you or received in a moment of vulnerability—that asked for nothing in return.',
    prompts: [
      'What prompted this quiet act when walking away would have been effortless?',
      'Whose eyes met yours in that moment, and what unspoken relief passed between you?',
      'What unseen ripple did this deed set off in your own spirit?',
      'How did this act remind you of the sacred duty of human tenderness?'
    ],
    suggestedTags: ['kindness', 'service', 'compassion', 'grace', 'community']
  },
  'Acts That Matter': {
    category: 'Acts That Matter',
    urdu: 'احساس و وفا',
    subtitle: 'Moments of moral courage, steadfast loyalty, and enduring presence',
    description: 'Chronicle a turning point where loyalty, dignity, and holding ground mattered far more than praise, recognition, or worldly status.',
    prompts: [
      'Why did staying firm in this hour define your internal compass?',
      'What did you sacrifice quietly without announcing it to anyone?',
      'Who stood beside you, or whose memory gave you strength to endure?',
      'What truth about human dignity was permanently etched into you here?'
    ],
    suggestedTags: ['courage', 'integrity', 'loyalty', 'presence', 'truth']
  },
  'Achievement': {
    category: 'Achievement',
    urdu: 'کامیابی و ثمر',
    subtitle: 'Milestones wrought from perseverance, hidden tears, and quiet grit',
    description: 'Document an achievement whose true cost was known only to you—the long nights, the doubts overcome, and the harvest reaped.',
    prompts: [
      'What did it demand of you in the lonely months before anyone cheered?',
      'What would you whisper now to the version of you who almost surrendered?',
      'Who believed in you when your own hands were trembling?',
      'How did this triumph alter how you view your own capacity?'
    ],
    suggestedTags: ['milestone', 'grit', 'accomplishment', 'harvest', 'growth']
  },
  'Adventure': {
    category: 'Adventure',
    urdu: 'سفر و مہم جوئی',
    subtitle: 'Journeys across high passes, forgotten trails, and unknown horizons',
    description: 'Capture the sensory intoxication of unfamiliar paths—the wind through mountain cols, unfamiliar tongues, and the thrill of the open road.',
    prompts: [
      'What did the mountain air or ocean salt smell like in that exact minute?',
      'What unexpected threshold did you cross when all plans dissolved?',
      'What did the landscape reveal to you about your own smallness and wonder?',
      'What memory would endure even if every photograph were lost to time?'
    ],
    suggestedTags: ['travel', 'mountains', 'horizons', 'wilderness', 'wanderlust']
  },
  'Connection': {
    category: 'Connection',
    urdu: 'تعلق و رفاقت',
    subtitle: 'Souls intersecting in profound intimacy, understanding, and fellowship',
    description: 'Immortalize a conversation, an embrace, or a shared silence that dissolved loneliness and made two lives permanently entangled.',
    prompts: [
      'What words were left unsaid because the eyes had already communicated them?',
      'What warmth lingered in the room after the tea had cooled?',
      'How did this person remind you of your own goodness?',
      'What sacred promise—spoken or silent—was forged between you?'
    ],
    suggestedTags: ['friendship', 'kinship', 'conversation', 'belonging', 'love']
  },
  'Transition': {
    category: 'Transition',
    urdu: 'موڑ و تغیر',
    subtitle: 'Crossroads, departures, new beginnings, and irreversible farewells',
    description: 'Write about the sacred boundary between who you once were and who you had to become—a move, a career leap, a release, or a rebirth.',
    prompts: [
      'What were you leaving behind on the doorstep as you stepped into the mist?',
      'What fear felt immense beforehand, only to dissolve once you leapt?',
      'How did the unfamiliar sky look on your very first morning afterward?',
      'What gratitude do you carry for the old chapter that came to a close?'
    ],
    suggestedTags: ['crossroads', 'beginnings', 'farewells', 'transformation', 'courage']
  },
  'Discovery': {
    category: 'Discovery',
    urdu: 'دریافت و بصیرت',
    subtitle: 'Epiphanies, sudden illuminations, and philosophical awakenings',
    description: 'Record the sudden clarity when the world rearranged itself—a book line that struck like lightning, or a quiet realization under starlight.',
    prompts: [
      'What did you believe with certainty right before this veil lifted?',
      'What was the catalyst—a stranger’s remark, a passage of poetry, or silence?',
      'How does this insight continue to guide your daily choices today?',
      'What freedom arrived once you saw the world through this clearer lens?'
    ],
    suggestedTags: ['wisdom', 'epiphany', 'clarity', 'insight', 'revelation']
  },
  'Creativity': {
    category: 'Creativity',
    urdu: 'تخلیق و ہنر',
    subtitle: 'The spark of invention, craftsmanship, poetry, and artistic flow',
    description: 'Chronicle the feverish joy of bringing something into existence out of raw imagination—art, code, melody, poetry, or architecture.',
    prompts: [
      'Where did the first spark emerge, and how did it refuse to let you sleep?',
      'What did your hands feel like as the creation took shape before you?',
      'What piece of your soul did you weave into this work?',
      'What surprised you about what was born through you?'
    ],
    suggestedTags: ['art', 'writing', 'craft', 'melody', 'inspiration']
  },
  'Family': {
    category: 'Family',
    urdu: 'خاندان و روایت',
    subtitle: 'Ancestral roots, elders’ blessings, heirloom recipes, and heritage',
    description: 'Preserve the stories of those whose blood flows in your veins—the courtyard dinners, grandparent sayings, and legacies handed down.',
    prompts: [
      'What scent or sound instantly evokes the warmth of that family home?',
      'What sacrifice made by your elders made this current breath possible?',
      'What proverb or phrase echoes in your ears in their exact cadence?',
      'What tradition do you vow to carry forward into future generations?'
    ],
    suggestedTags: ['heritage', 'ancestors', 'elders', 'roots', 'legacy']
  },
  'Other': {
    category: 'Other',
    urdu: 'دیگر یادیں',
    subtitle: 'Uncategorized wanderings, dreamscapes, and serendipitous moments',
    description: 'For every memory that defies neat containers—the serendipitous wonders, midnight thoughts, and unclassifiable miracles.',
    prompts: [
      'Why does this particular memory refuse to leave your consciousness?',
      'What mood or aura captures this moment better than any single word?',
      'What makes this memory uniquely yours?'
    ],
    suggestedTags: ['reflection', 'serendipity', 'wonder', 'solitude']
  }
};

const SAMPLE_COVERS: Record<MemoryCategory, string> = {
  'Act of Kindness': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80',
  'Acts That Matter': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80',
  'Achievement': 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1600&q=80',
  'Adventure': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
  'Connection': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
  'Transition': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
  'Discovery': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'Creativity': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
  'Family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80',
  'Other': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80'
};

export const RecordChronicleView: React.FC = () => {
  const { addMemory, navigate, showToast } = useTapestry();

  // Retrieve initial category from search query or default to 'Act of Kindness'
  const initialCategory: MemoryCategory = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat && cat in CATEGORY_DETAILS) {
        return cat as MemoryCategory;
      }
    } catch {
      // Ignore
    }
    return 'Act of Kindness';
  }, []);

  // Form State
  const [category, setCategory] = useState<MemoryCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [story, setStory] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [customCoverInput, setCustomCoverInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [department, setDepartment] = useState('CSR & Cultural Heritage (نیکی و خیرخواہی)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Emotional sliders
  const [emotionNervousElated, setEmotionNervousElated] = useState(65);
  const [emotionLonelyConnected, setEmotionLonelyConnected] = useState(80);
  const [emotionUncertainCertain, setEmotionUncertainCertain] = useState(70);
  const [emotionHeavyLight, setEmotionHeavyLight] = useState(75);
  const [emotionQuietElectric, setEmotionQuietElectric] = useState(60);

  // UI Modes
  const [isZenMode, setIsZenMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'atmosphere' | 'reflection'>('write');
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  // Set default cover when category changes if none set
  useEffect(() => {
    if (!coverImageUrl) {
      setCoverImageUrl(SAMPLE_COVERS[category]);
    }
  }, [category]);

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sheeraza_chronicle_draft_${category}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.story && !story) {
          setTitle(parsed.title || '');
          setLocation(parsed.location || '');
          setStory(parsed.story || '');
          setDate(parsed.date || new Date().toISOString().split('T')[0]);
          setTags(parsed.tags || []);
          setPeople(parsed.people || []);
          setDraftSavedTime('Restored previous draft');
        }
      }
    } catch (e) {
      console.warn('Could not load draft:', e);
    }
  }, [category]);

  // Auto-save draft every 10 seconds if dirty
  useEffect(() => {
    if (!story && !title) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          `sheeraza_chronicle_draft_${category}`,
          JSON.stringify({ title, location, story, date, tags, people })
        );
        const now = new Date();
        setDraftSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.warn('Failed to save draft:', e);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, story, location, date, tags, people, category]);

  // Calculate live word count
  const wordStats = useMemo(() => {
    const trimmed = story.trim();
    if (!trimmed) {
      return { words: 0, characters: 0, paragraphs: 0, readingTimeMinutes: 0, isOverLimit: false, percentage: 0 };
    }
    const wordsArray = trimmed.split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const characters = story.length;
    const paragraphs = story.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 220));
    const isOverLimit = words > MAX_WORDS;
    const percentage = Math.min(100, Math.round((words / MAX_WORDS) * 100));

    return { words, characters, paragraphs, readingTimeMinutes, isOverLimit, percentage };
  }, [story]);

  // Trim excess words action
  const handleTrimToMaxWords = () => {
    const wordsArray = story.trim().split(/\s+/).filter(Boolean);
    if (wordsArray.length > MAX_WORDS) {
      const trimmedStory = wordsArray.slice(0, MAX_WORDS).join(' ');
      setStory(trimmedStory);
      showToast(`Trimmed chronicle to exactly ${MAX_WORDS} words.`);
    }
  };

  // Add Tag
  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || newTag).trim().toLowerCase();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Add Person
  const handleAddPerson = () => {
    const val = newPerson.trim();
    if (val && !people.includes(val)) {
      setPeople([...people, val]);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (personToRemove: string) => {
    setPeople(people.filter((p) => p !== personToRemove));
  };

  // Insert formatting into textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('chronicle-story-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = story.substring(start, end);
    const replacement = `${prefix}${selected || 'highlighted thought'}${suffix}`;

    const newStory = story.substring(0, start) + replacement + story.substring(end);
    setStory(newStory);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 'highlighted thought'.length));
    }, 10);
  };

  // Submit Chronicle to Database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide a title for your chronicle.');
      return;
    }

    if (!story.trim()) {
      showToast('Please write your chronicle before saving.');
      return;
    }

    if (wordStats.words > MAX_WORDS) {
      showToast(`Your chronicle exceeds the ${MAX_WORDS}-word limit by ${wordStats.words - MAX_WORDS} words. Please trim to continue.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newMemory = await addMemory({
        title: title.trim(),
        story: story.trim(),
        date: date || new Date().toISOString().split('T')[0],
        location: location.trim() || 'Undisclosed Sanctuary',
        category,
        coverImageUrl: coverImageUrl || SAMPLE_COVERS[category],
        artifactUrls: [],
        emotionNervousElated,
        emotionLonelyConnected,
        emotionUncertainCertain,
        emotionHeavyLight,
        emotionQuietElectric,
        people,
        tags: tags.length > 0 ? tags : [category.toLowerCase()],
        chapterIds: [],
        reflectionPrompt: selectedPrompt || CATEGORY_DETAILS[category].prompts[0],
        reflectionAnswer: reflectionAnswer.trim() || '',
        favorite: isFavorite,
        visibility: 'department',
        department: department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)'
      });

      // Clear draft
      try {
        localStorage.removeItem(`sheeraza_chronicle_draft_${category}`);
      } catch {
        // Ignore
      }

      showToast(`Chronicle recorded under "${category}" (${wordStats.words} words). Woven into your sanctuary.`);
      navigate(`/moments/${newMemory.id}`);
    } catch (err) {
      console.error('Error saving chronicle:', err);
      showToast('Failed to record chronicle to database. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategoryMeta = CATEGORY_DETAILS[category];
  const categoryConfig = CATEGORY_COLORS[category];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isZenMode ? 'bg-[#0f172a] text-slate-100' : 'bg-stone-50/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100'}`}>
      {/* Zen Mode Header Bar */}
      {isZenMode && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-amber-400">Zen Chronicle Sanctuary</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {category} ({currentCategoryMeta.urdu})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={wordStats.isOverLimit ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
              {wordStats.words.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
            </span>
            <button
              onClick={() => setIsZenMode(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Minimize2 size={14} />
              <span>Exit Zen Mode</span>
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 ${isZenMode ? 'pt-16 max-w-4xl' : ''}`}>
        {/* Navigation Breadcrumb & Back */}
        {!isZenMode && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate('/listings')}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Database Listings</span>
            </button>

            <div className="flex items-center gap-3">
              {draftSavedTime && (
                <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                  <Save size={12} className="text-emerald-500" />
                  <span>Autosaved {draftSavedTime}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsZenMode(true)}
                className="px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Enter distraction-free writing sanctuary"
              >
                <Maximize2 size={13} />
                <span>Zen Mode</span>
              </button>
            </div>
          </div>
        )}

        {/* Hero Header */}
        {!isZenMode && (
          <div className="mb-8 border-b border-stone-200/80 dark:border-stone-800 pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
                قلم برداشتہ · Deep Chronicle Form
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-serif border border-emerald-200 dark:border-emerald-800">
                Maximum 2,000 Words
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100 tracking-tight">
              Record a Chronicle Under Category
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 font-serif italic max-w-3xl leading-relaxed">
              Pour your unhurried truth onto the digital parchment. Select any category below to access tailored reflection prompts, evoke cultural memory, and write an extensive chronicle of up to 2,000 words.
            </p>
          </div>
        )}

        {/* CATEGORY SELECTOR CAROUSEL / GRID */}
        {!isZenMode && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Select Category to Record Under:
              </span>
              <span className="text-xs text-stone-400 font-serif italic">
                Active: <span className="font-semibold text-stone-800 dark:text-stone-200">{category}</span> ({currentCategoryMeta.urdu})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {(Object.keys(CATEGORY_DETAILS) as MemoryCategory[]).map((cat) => {
                const meta = CATEGORY_DETAILS[cat];
                const cfg = CATEGORY_COLORS[cat];
                const isSelected = category === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setSelectedPrompt('');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-emerald-700 dark:border-emerald-500 bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30'
                        : 'border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 text-stone-800 dark:text-stone-200 hover:border-stone-400 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: isSelected ? '#34d399' : cfg.accent }}
                      />
                      <span
                        className={`text-[11px] font-serif ${
                          isSelected ? 'text-emerald-200' : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                        }`}
                      >
                        {meta.urdu}
                      </span>
                    </div>
                    <div className="font-serif text-xs font-medium truncate">{cat}</div>
                  </button>
                );
              })}
            </div>

            {/* Category Purpose & Guidance Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-serif font-semibold text-amber-900 dark:text-amber-200">
                    {category} · {currentCategoryMeta.subtitle}
                  </span>
                </div>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/70 font-serif leading-relaxed">
                  {currentCategoryMeta.description}
                </p>
              </div>

              {/* Fast prompt selector */}
              <div className="flex flex-wrap gap-1.5 md:max-w-md">
                {currentCategoryMeta.prompts.slice(0, 2).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPrompt(p);
                      if (!story) {
                        setStory(`[Reflection on: "${p}"]\n\n`);
                      }
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-amber-200 dark:border-stone-800 hover:border-amber-400 transition-colors text-left truncate cursor-pointer max-w-[210px]"
                    title={p}
                  >
                    💡 {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top metadata grid (Title, Date, Location) */}
          <div className="bg-white/80 dark:bg-stone-900/70 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5">
                Chronicle Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={`e.g. The Secret Kiryana Ledger in the Rain, Standing Beside Tariq...`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 font-serif text-lg md:text-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                  <Calendar size={13} className="text-stone-400" />
                  <span>Date of Occurrence</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                  <MapPin size={13} className="text-stone-400" />
                  <span>Location or Sanctuary</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bhati Gate, Lahore / Margalla Foothills"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                  <Building2 size={13} className="text-stone-400" />
                  <span>Corporate Department</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="CSR & Cultural Heritage (نیکی و خیرخواہی)">CSR & Cultural Heritage (نیکی و خیرخواہی)</option>
                  <option value="Executive Leadership & Strategy">Executive Leadership & Strategy</option>
                  <option value="Operations & Northern Logistics">Operations & Northern Logistics</option>
                  <option value="Employee Wellbeing & Culture">Employee Wellbeing & Culture</option>
                  <option value="Global Diaspora Relations">Global Diaspora Relations</option>
                </select>
              </div>

              <div className="flex items-center sm:pt-6">
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-serif flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFavorite
                      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                  }`}
                >
                  <Heart size={14} className={isFavorite ? 'fill-current text-rose-600' : ''} />
                  <span>{isFavorite ? 'Marked as Sacred Favorite' : 'Keep as Sacred Favorite'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* THE 2000-WORD CHRONICLE WRITING CANVAS */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
            {/* Canvas Toolbar & Live Word Meter */}
            <div className="px-6 py-4 border-b border-stone-200/70 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex flex-wrap items-center justify-between gap-4">
              {/* Left formatting tools */}
              <div className="flex items-center gap-1 text-xs">
                <span className="font-serif italic text-stone-500 mr-2">Form Tools:</span>
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold transition-colors cursor-pointer"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 italic transition-colors cursor-pointer"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n> "', '"\n')}
                  className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-serif transition-colors cursor-pointer"
                  title="Quote"
                >
                  “ Quote
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n- ')}
                  className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                  title="Bullet point"
                >
                  • Bullet
                </button>
              </div>

              {/* Right Live Word Count Status */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                  <Clock size={13} />
                  <span>~{wordStats.readingTimeMinutes} min read</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">|</span>
                  <div className="text-right">
                    <span
                      className={`text-sm font-semibold tracking-tight ${
                        wordStats.isOverLimit
                          ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                          : wordStats.words > 1800
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {wordStats.words.toLocaleString()}
                    </span>
                    <span className="text-stone-400 text-xs"> / {MAX_WORDS.toLocaleString()} words</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Word Progress Indicator Bar */}
            <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 relative overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  wordStats.isOverLimit
                    ? 'bg-rose-500'
                    : wordStats.percentage > 90
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (wordStats.words / MAX_WORDS) * 100)}%` }}
              />
            </div>

            {/* Word Limit Warning Banner if exceeding 2000 words */}
            {wordStats.isOverLimit && (
              <div className="px-6 py-3 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>
                    Your chronicle has reached <strong>{wordStats.words.toLocaleString()} words</strong>, exceeding the 2,000-word limit by{' '}
                    <strong>{(wordStats.words - MAX_WORDS).toLocaleString()} words</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTrimToMaxWords}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shrink-0 cursor-pointer"
                >
                  Trim to 2,000 words
                </button>
              </div>
            )}

            {/* Textarea */}
            <div className="p-6 md:p-8">
              <textarea
                id="chronicle-story-area"
                rows={16}
                required
                placeholder={`Begin your chronicle under ${category}...\n\nCapture the sounds, the dust, the spoken words, and the unspoken weight. There is space here for your deepest narrative—up to 2,000 words...`}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 font-serif text-base md:text-lg leading-relaxed resize-y selection:bg-emerald-200 dark:selection:bg-emerald-900"
              />
            </div>

            {/* Canvas Footer with Paragraphs & Prompts Helper */}
            <div className="px-6 py-3 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/40 dark:bg-stone-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-4">
                <span>{wordStats.characters.toLocaleString()} characters</span>
                <span>•</span>
                <span>{wordStats.paragraphs} paragraphs</span>
                <span>•</span>
                <span>Category: {category} ({currentCategoryMeta.urdu})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-serif italic">Prompts:</span>
                <button
                  type="button"
                  onClick={() => {
                    const randomP = currentCategoryMeta.prompts[Math.floor(Math.random() * currentCategoryMeta.prompts.length)];
                    setSelectedPrompt(randomP);
                    setStory((prev) => (prev ? `${prev}\n\n[Reflecting on: ${randomP}]\n` : `[Reflecting on: ${randomP}]\n`));
                  }}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Sparkles size={12} />
                  <span>Insert Prompt</span>
                </button>
              </div>
            </div>
          </div>

          {/* DEEPER DIMENSIONS: Reflection, Emotional Pulse, Artifacts, Tags */}
          <div className="bg-white/80 dark:bg-stone-900/70 p-6 md:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100 font-medium">
                  Atmosphere & Resonance Dimensions
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-serif italic">Optional Enrichment</span>
            </div>

            {/* Selected Category Reflection Prompt */}
            <div className="space-y-2">
              <label className="block text-xs font-serif text-stone-700 dark:text-stone-300 font-medium">
                Reflective Inquiry for {category}:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentCategoryMeta.prompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPrompt(p)}
                    className={`p-3 rounded-xl border text-left text-xs font-serif leading-relaxed transition-all cursor-pointer ${
                      selectedPrompt === p
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    “{p}”
                  </button>
                ))}
              </div>

              {selectedPrompt && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Short reflection answer or key takeaway..."
                    value={reflectionAnswer}
                    onChange={(e) => setReflectionAnswer(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}
            </div>

            {/* Emotional Spectrum Sliders */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <h4 className="text-xs font-serif font-medium text-stone-800 dark:text-stone-200 mb-4">
                Emotional Resonance Spectrum:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  {/* Nervous <-> Elated */}
                  <div>
                    <div className="flex justify-between text-[11px] font-serif text-stone-500 mb-1">
                      <span>Anxious / Hesitant (نحیف)</span>
                      <span className="font-mono text-stone-700 dark:text-stone-300">{emotionNervousElated}%</span>
                      <span>Exhilarated / Joyful (شادمان)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={emotionNervousElated}
                      onChange={(e) => setEmotionNervousElated(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Lonely <-> Connected */}
                  <div>
                    <div className="flex justify-between text-[11px] font-serif text-stone-500 mb-1">
                      <span>Isolated / Solitary (تنہا)</span>
                      <span className="font-mono text-stone-700 dark:text-stone-300">{emotionLonelyConnected}%</span>
                      <span>Deeply Entangled (پیوستہ)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={emotionLonelyConnected}
                      onChange={(e) => setEmotionLonelyConnected(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Heavy <-> Light */}
                  <div>
                    <div className="flex justify-between text-[11px] font-serif text-stone-500 mb-1">
                      <span>Heavy Heart (بھاری)</span>
                      <span className="font-mono text-stone-700 dark:text-stone-300">{emotionHeavyLight}%</span>
                      <span>Unburdened / Weightless (سبک)</span>
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
                </div>

                <div className="flex justify-center p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/50 dark:border-stone-800">
                  <div className="text-center">
                    <EmotionalPulseVisualizer
                      nervousElated={emotionNervousElated}
                      lonelyConnected={emotionLonelyConnected}
                      uncertainCertain={emotionUncertainCertain}
                      heavyLight={emotionHeavyLight}
                      quietElectric={emotionQuietElectric}
                      size="md"
                    />
                    <span className="block mt-2 text-[10px] font-mono uppercase tracking-widest text-stone-400">
                      Harmonic Pulse
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Imagery & Preset Sanctuary Backgrounds */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <label className="block text-xs font-serif font-medium text-stone-800 dark:text-stone-200 mb-2">
                Cover Image or Atmosphere:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {Object.entries(SAMPLE_COVERS).slice(0, 4).map(([catKey, url]) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCoverImageUrl(url)}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      coverImageUrl === url ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={catKey} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded truncate font-serif">
                      {catKey}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste custom image URL (Unsplash, etc.)..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Tags & Key People */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tags */}
              <div>
                <label className="block text-xs font-serif font-medium text-stone-800 dark:text-stone-200 mb-1.5 flex items-center gap-1">
                  <Tag size={13} className="text-stone-400" />
                  <span>Thematic Tags</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag (press Enter)..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg text-xs hover:bg-stone-300 dark:hover:bg-stone-600 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-500 cursor-pointer text-stone-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {currentCategoryMeta.suggestedTags.map((st) => (
                    !tags.includes(st) && (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAddTag(st)}
                        className="text-[10px] text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-mono underline cursor-pointer"
                      >
                        +{st}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* People */}
              <div>
                <label className="block text-xs font-serif font-medium text-stone-800 dark:text-stone-200 mb-1.5 flex items-center gap-1">
                  <Users size={13} className="text-stone-400" />
                  <span>Souls Present (Companions / Elders)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add person name..."
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPerson();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg text-xs hover:bg-stone-300 dark:hover:bg-stone-600 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {people.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => handleRemovePerson(p)}
                        className="hover:text-rose-500 cursor-pointer text-stone-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 dark:border-stone-800">
            <div className="text-xs text-stone-500 dark:text-stone-400 font-serif italic text-center sm:text-left">
              <span>Chronicle will be preserved under category </span>
              <strong className="text-stone-800 dark:text-stone-200">{category}</strong>
              <span> with permanent database persistence.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/listings')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-serif hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || wordStats.isOverLimit}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-full text-xs font-serif font-medium tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  wordStats.isOverLimit
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed dark:bg-stone-800 dark:text-stone-500'
                    : 'bg-emerald-900 hover:bg-emerald-800 text-amber-50 shadow-emerald-900/20 active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                    <span>Inscribing into Sanctuary...</span>
                  </>
                ) : (
                  <>
                    <Feather size={15} />
                    <span>Inscribe Chronicle ({wordStats.words} words)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
