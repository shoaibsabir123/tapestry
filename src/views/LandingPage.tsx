import React from 'react';
import { useTapestry } from '../context/TapestryContext';
import { ConstellationCanvas } from '../components/common/ConstellationCanvas';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  Heart,
  BookOpen,
  Volume2,
  Camera,
  HandHeart,
  Flame,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { memories, navigate, setPreviewMemory } = useTapestry();

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0D0F12] text-stone-900 dark:text-stone-100 selection:bg-[#EAE0D5] selection:text-stone-900">
      {/* Editorial Top Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-stone-200/50 dark:border-stone-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-950 dark:bg-emerald-900 text-amber-300 flex items-center justify-center shadow-sm">
            <span className="font-serif text-lg font-bold">ش</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl tracking-tight font-medium text-stone-900 dark:text-stone-100">Sheeraza</span>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-serif font-light">شیرازہ</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => navigate('/login')}
            className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-amber-50 font-medium transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Enter Sanctuary</span>
            <span className="text-amber-300/80 text-[11px]">خوش آمدید</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-serif italic mb-4">
          <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
          <span>شیرازۂ حیات — The Living Chronicle of Moments & The Acts That Matter</span>
        </div>

        <h1 className="mt-2 font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-stone-900 dark:text-stone-100 max-w-4xl mx-auto leading-tight">
          Your life, <span className="italic font-normal">woven together.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 font-serif max-w-2xl mx-auto leading-relaxed">
          Sheeraza is a digital sanctuary for preserving the moments that shaped you — quiet acts of kindness (نیکی اور احساس), ancestral roots, milestones, and the selfless deeds that truly matter.
        </p>

        {/* Acts of Kindness Badge Highlight */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-600 dark:text-stone-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60">
            <HandHeart size={14} className="text-rose-600 dark:text-rose-400" />
            <span>Quiet Acts of Kindness (نیکی)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60">
            <Flame size={14} className="text-amber-600 dark:text-amber-400" />
            <span>The Acts That Matter (احساس و وقار)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60">
            <Compass size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Living Constellation of Memories</span>
          </span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium text-sm flex items-center justify-center gap-2 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-md cursor-pointer group"
          >
            <span>Begin your chronicle</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm hover:border-stone-500 hover:text-stone-900 dark:hover:text-white transition-all cursor-pointer"
          >
            Explore living sanctuary
          </button>
        </div>

        <p className="mt-4 text-xs text-stone-400 font-serif italic">
          Collect the moments. Honor the kindness. See the story unfold.
        </p>
      </section>

      {/* Interactive Constellation Preview */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-mono">
            نظامِ کہکشاں · Interactive Map
          </span>
          <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-200 mt-1">
            Every memory is a star; together, they weave your Sheeraza
          </h2>
          <p className="text-xs text-stone-500 font-serif italic">
            Click on any glowing point below to inspect a moment, an act of kindness, or a milestone
          </p>
        </div>

        <div className="shadow-2xl rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800">
          <ConstellationCanvas
            memories={memories}
            onSelectMemory={(m) => setPreviewMemory(m)}
            height={480}
          />
        </div>
      </section>

      {/* Editorial Value Sections */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Section 1: Acts That Matter & Kindness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-serif text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              نیکی اور اخوت · Acts That Endure
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-100 mt-2 leading-snug">
              Not just what you achieved.<br />
              <span className="italic font-light text-emerald-800 dark:text-emerald-400">The kindness you gave in silence.</span>
            </h3>
            <p className="mt-4 text-stone-600 dark:text-stone-400 font-serif leading-relaxed text-sm md:text-base">
              In our cultural ethos, life is measured by the burdens we quietly lightened for others. Sheeraza elevates quiet acts of kindness — paying off an elder's secret grocery debt, sitting through the dark hospital night with a brother, or planting a tree in the neighborhood — giving them an honored place in your life’s tapestry.
            </p>
            <div className="mt-6 space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <HandHeart size={15} className="text-rose-600" />
                <span>Acts of Kindness (نیکی): Preserving quiet grace without bragging</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-amber-600" />
                <span>Acts That Matter (احساس): Pivotal moments of courage and steadfast presence</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 size={15} className="text-emerald-600" />
                <span>Audio Aura: Preserving the authentic sounds, laughter, and prayers of loved ones</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#FAF8F5]/80 dark:bg-stone-900/60 p-6 rounded-3xl border border-amber-200/60 dark:border-stone-800 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80"
              alt="Act of Kindness"
              className="w-full h-56 object-cover rounded-2xl mb-4"
            />
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="text-rose-600 font-medium">Act of Kindness (نیکی)</span>
              <span>April 14, 2026 · Rawalpindi</span>
            </div>
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              The Secret Kiryana Ledger in the Rain (خفیہ سخاوت)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic mt-1 leading-relaxed">
              “Without a word, I signaled the shopkeeper, cleared an elderly neighbor's monthly grocery debt, and slipped into the rain. Kindness is purest when it leaves no burden of gratitude behind.”
            </p>
          </div>
        </div>

        {/* Section 2: Multi-Sensory Memory Pod */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-stone-900 text-stone-100 p-8 rounded-3xl shadow-xl border border-stone-800">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">
              The 20-Minute Sanctuary Ritual
            </span>
            <h4 className="font-serif text-2xl md:text-3xl font-light mt-3 leading-snug">
              “Twenty minutes to remember what truly mattered.”
            </h4>
            <div className="mt-6 space-y-4 text-xs font-serif text-stone-300">
              <p>1. Choose a fleeting moment or an act of kindness that warms your chest.</p>
              <p>2. Describe what happened without rush — the scent of rain, the warmth of tea.</p>
              <p>3. Note the emotional tensions: nervous vs elated, heavy vs light.</p>
              <p>4. Answer the reflective prompt: What did this moment teach you about empathy?</p>
              <p>5. Watch the thread weave seamlessly into your living Sheeraza.</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-xs font-serif text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
              فکر و آگہی · Guided Reflection
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-100 mt-2 leading-snug">
              Slow down.<br />
              <span className="italic font-light">Reflection over productivity.</span>
            </h3>
            <p className="mt-4 text-stone-600 dark:text-stone-400 font-serif leading-relaxed text-sm md:text-base">
              The goal of Sheeraza is never to collect endless tasks or compete for vanity metrics. It is an unhurried sanctuary for quiet evenings, where you sit with a warm cup of cardamom chai, breathe, and honor the people, places, and deeds that define your life.
            </p>
          </div>
        </div>

        {/* Section 3: Privacy & Legacy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
            <Shield size={24} className="text-amber-600 mb-3" />
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Private By Default
            </h4>
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
              Your stories and acts of charity remain intimate and confidential. You maintain sovereign control over who, if anyone, ever views your reflections.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
            <Award size={24} className="text-emerald-600 mb-3" />
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Life Chapters (ابوابِ حیات)
            </h4>
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
              Memories naturally weave into overarching eras: "Bab-e-Umeed: Returning Home", "Karakoram Horizons", or "Courtyards & Quiet Grace".
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
            <BookOpen size={24} className="text-rose-600 mb-3" />
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Keepsake Book Export (شیرازہ نامہ)
            </h4>
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
              Transform your digital archive into a printable heirloom book, complete with photos, Urdu motifs, and voice notes preserved for generations.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-stone-900 text-stone-100 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">
            زندگی اک داستان ہے
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mt-3 leading-tight">
            Start weaving your Sheeraza today.
          </h2>
          <p className="mt-4 text-stone-400 font-serif text-sm">
            Step inside your sanctuary. Record the moments, celebrate the quiet kindness, and preserve what outlives us all.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-8 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-all shadow-lg cursor-pointer"
            >
              Begin your chronicle (شیرازہ بندی)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 border-t border-stone-200/60 dark:border-stone-800">
        <div className="flex items-center gap-2 font-serif italic">
          <span>Sheeraza (شیرازہ)</span>
          <span>·</span>
          <span>A sanctuary for the moments and acts of kindness that define who we are.</span>
        </div>
        <p className="mt-2 sm:mt-0 font-serif">
          حفاظت · خودمختاری · دوام
        </p>
      </footer>
    </div>
  );
};
