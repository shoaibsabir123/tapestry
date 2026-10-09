import React, { useState } from 'react';
import { useTapestry } from '../context/TapestryContext';
import {
  Feather,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  Heart,
  Volume2
} from 'lucide-react';
import { EmotionalPulseVisualizer } from '../components/common/EmotionalPulseVisualizer';

export const ReflectionsView: React.FC = () => {
  const {
    memories,
    monthlyReflections,
    addMonthlyReflection,
    addReflection,
    addMemory,
    navigate
  } = useTapestry();

  const [activeTab, setActiveTab] = useState<'guided' | 'monthly'>('guided');

  // Guided 5-Step Reflection State
  const [guidedStep, setGuidedStep] = useState(1);
  const [selectedMemoryTitle, setSelectedMemoryTitle] = useState('');
  const [step1Moment, setStep1Moment] = useState('');
  const [step2Happened, setStep2Happened] = useState('');
  const [step3Feelings, setStep3Feelings] = useState({ nervousElated: 60, heavyLight: 70, quietElectric: 65 });
  const [step4Sensory, setStep4Sensory] = useState('');
  const [step5Meaning, setStep5Meaning] = useState('');
  const [isFinishingGuided, setIsFinishingGuided] = useState(false);
  const [guidedCompleted, setGuidedCompleted] = useState(false);

  // Monthly Reflection State
  const [monthlyMonth, setMonthlyMonth] = useState('2026-09');
  const [whatChanged, setWhatChanged] = useState('');
  const [whatMattered, setWhatMattered] = useState('');
  const [whatSurprised, setWhatSurprised] = useState('');
  const [whoMattered, setWhoMattered] = useState('');
  const [monthlySummary, setMonthlySummary] = useState('');
  const [isSavingMonthly, setIsSavingMonthly] = useState(false);

  const handleFinishGuided = async () => {
    setIsFinishingGuided(true);
    // Add both reflection and memory
    const title = selectedMemoryTitle || step1Moment || 'A Reflection from the Sanctuary';
    await addMemory({
      title,
      story: step2Happened,
      category: 'Transition',
      emotionNervousElated: step3Feelings.nervousElated,
      emotionHeavyLight: step3Feelings.heavyLight,
      emotionQuietElectric: step3Feelings.quietElectric,
      reflectionPrompt: 'What do you remember that a photograph can’t capture?',
      reflectionAnswer: `${step4Sensory}\n\nMeaning now: ${step5Meaning}`,
      date: new Date().toISOString().split('T')[0]
    });

    await addReflection({
      momentTitle: title,
      stepResponses: [
        { prompt: 'What happened?', response: step2Happened },
        { prompt: 'What do you remember that a photograph can’t capture?', response: step4Sensory },
        { prompt: 'What does this moment mean to you now?', response: step5Meaning }
      ]
    });

    setIsFinishingGuided(false);
    setGuidedCompleted(true);
  };

  const handleSaveMonthly = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMonthly(true);
    await addMonthlyReflection({
      yearMonth: monthlyMonth,
      summary: monthlySummary || `${monthlyMonth} Reflection`,
      whatChanged,
      whatMattered,
      whoMattered: whoMattered ? whoMattered.split(',').map((s) => s.trim()) : []
    });
    setIsSavingMonthly(false);
    setWhatChanged('');
    setWhatMattered('');
    setWhatSurprised('');
    setWhoMattered('');
    setMonthlySummary('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-medium">
          فکر و آگہی · Sanctuary Rituals
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-stone-100">
          Reflections & Acts That Matter
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif italic">
          “20 minutes to remember what mattered.” A quiet pause for moments, quiet acts of kindness (نیکی), and seasons of grace.
        </p>

        {/* Tab switch */}
        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('guided')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'guided'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            20-Minute Guided Ritual
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Monthly Reflection
          </button>
        </div>
      </div>

      {activeTab === 'guided' ? (
        guidedCompleted ? (
          <div className="py-16 text-center space-y-4 bg-white/60 dark:bg-stone-900/40 rounded-3xl border border-stone-200/80 dark:border-stone-800">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto shadow-md">
              <Check size={28} />
            </div>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100">
              Moment woven into your tapestry.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-serif italic max-w-md mx-auto">
              Your 20-minute ritual is complete. The insights and quiet currents of this moment are preserved in your living archive.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setGuidedCompleted(false);
                  setGuidedStep(1);
                  setStep1Moment('');
                  setStep2Happened('');
                  setStep4Sensory('');
                  setStep5Meaning('');
                }}
                className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-stone-500 cursor-pointer"
              >
                Reflect on another moment
              </button>
              <button
                onClick={() => navigate('/moments')}
                className="px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium hover:bg-stone-800 cursor-pointer"
              >
                View life archive
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step progress */}
            <div className="flex items-center justify-between text-xs text-stone-400 font-serif">
              <span>20 minutes for your story</span>
              <span>Step {guidedStep} of 5</span>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 space-y-6">
              {/* Step 1: Choose a moment */}
              {guidedStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                    Step 1: Choose a moment that calls to you.
                  </h3>
                  <p className="text-xs text-stone-500 font-serif italic">
                    Select a memory from your existing tapestry, or name a new moment you’ve been carrying.
                  </p>

                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-serif text-stone-600 dark:text-stone-400">
                      Name the moment
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The late-night drive after signing the lease..."
                      value={step1Moment}
                      onChange={(e) => setStep1Moment(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
                    />

                    {memories.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] text-stone-400 block mb-2">Or choose from your archive:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {memories.slice(0, 4).map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setSelectedMemoryTitle(m.title);
                                setStep1Moment(m.title);
                                setStep2Happened(m.story);
                              }}
                              className={`p-3 text-left rounded-xl border text-xs font-serif transition-colors cursor-pointer ${
                                step1Moment === m.title
                                  ? 'border-amber-600 bg-amber-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              <div className="line-clamp-1 font-medium">{m.title}</div>
                              <div className="text-[11px] text-stone-400">{m.date}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: What happened? */}
              {guidedStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                    Step 2: What actually happened?
                  </h3>
                  <p className="text-xs text-stone-500 font-serif italic">
                    Where were you? Who was speaking? Describe the physical scene without rushing to interpret it yet.
                  </p>
                  <textarea
                    rows={6}
                    placeholder="We were parked under the eucalyptus trees. The engine was ticking as it cooled. I took out the keys..."
                    value={step2Happened}
                    onChange={(e) => setStep2Happened(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-serif leading-relaxed focus:outline-none"
                  />
                </div>
              )}

              {/* Step 3: What did you feel? */}
              {guidedStep === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                    Step 3: What did you feel in that second?
                  </h3>
                  <p className="text-xs text-stone-500 font-serif italic">
                    Move the sliders to map the unspoken tensions.
                  </p>

                  <div className="space-y-4 max-w-lg">
                    <div>
                      <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                        <span>Nervous</span>
                        <span>Elated</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={step3Feelings.nervousElated}
                        onChange={(e) =>
                          setStep3Feelings({ ...step3Feelings, nervousElated: Number(e.target.value) })
                        }
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                        <span>Heavy</span>
                        <span>Light</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={step3Feelings.heavyLight}
                        onChange={(e) =>
                          setStep3Feelings({ ...step3Feelings, heavyLight: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                        <span>Quiet</span>
                        <span>Electric</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={step3Feelings.quietElectric}
                        onChange={(e) =>
                          setStep3Feelings({ ...step3Feelings, quietElectric: Number(e.target.value) })
                        }
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: What a photograph can't capture */}
              {guidedStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                    Step 4: What do you remember that a photograph can't capture?
                  </h3>
                  <p className="text-xs text-stone-500 font-serif italic">
                    The smell in the air, the tone of a whispered sentence, the physical heaviness in your stomach, or the silence between words.
                  </p>
                  <textarea
                    rows={5}
                    placeholder="The photograph only shows us smiling on the bridge. It can’t show how cold the wind was, or how frightened we both were of running out of money..."
                    value={step4Sensory}
                    onChange={(e) => setStep4Sensory(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-serif leading-relaxed focus:outline-none"
                  />
                </div>
              )}

              {/* Step 5: What does this moment mean now? */}
              {guidedStep === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                    Step 5: What does this moment mean to you now?
                  </h3>
                  <p className="text-xs text-stone-500 font-serif italic">
                    Looking back across the days that followed, how did this moment weave into who you have become?
                  </p>
                  <textarea
                    rows={5}
                    placeholder="It was the pivot point. If I hadn’t stayed in that room, I would still be living someone else’s expectations..."
                    value={step5Meaning}
                    onChange={(e) => setStep5Meaning(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-serif leading-relaxed focus:outline-none"
                  />
                </div>
              )}

              {/* Controls */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                {guidedStep > 1 ? (
                  <button
                    onClick={() => setGuidedStep((prev) => prev - 1)}
                    className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-medium cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {guidedStep < 5 ? (
                  <button
                    onClick={() => {
                      if (guidedStep === 1 && !step1Moment.trim()) {
                        setStep1Moment('An Unspoken Moment');
                      }
                      setGuidedStep((prev) => prev + 1);
                    }}
                    className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next step</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishGuided}
                    disabled={isFinishingGuided}
                    className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles size={14} />
                    <span>{isFinishingGuided ? 'Weaving thread...' : 'Complete reflection ritual'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        /* Monthly Reflection Tab */
        <div className="space-y-8 animate-in fade-in">
          {/* Monthly Form */}
          <form
            onSubmit={handleSaveMonthly}
            className="p-6 md:p-8 rounded-3xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 space-y-6"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                Monthly Chronicle
              </span>
              <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
                Reflect on this season
              </h2>
              <p className="text-xs text-stone-500 font-serif italic mt-0.5">
                Summarize what mattered, what challenged you, and who accompanied your steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={monthlyMonth}
                  onChange={(e) => setMonthlyMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                  One-sentence seasonal title
                </label>
                <input
                  type="text"
                  placeholder="e.g. A season of quiet focus and desert rains..."
                  value={monthlySummary}
                  onChange={(e) => setMonthlySummary(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                What changed this month?
              </label>
              <textarea
                rows={2}
                value={whatChanged}
                onChange={(e) => setWhatChanged(e.target.value)}
                placeholder="What shifted in your routine, heart, or direction?"
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                What truly mattered?
              </label>
              <textarea
                rows={2}
                value={whatMattered}
                onChange={(e) => setWhatMattered(e.target.value)}
                placeholder="Which hours would you regret forgetting?"
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-serif text-stone-600 dark:text-stone-400 mb-1">
                Who mattered this month? (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Dad, Sarah, Ahmed..."
                value={whoMattered}
                onChange={(e) => setWhoMattered(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingMonthly}
                className="px-6 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer shadow-sm hover:bg-stone-800"
              >
                {isSavingMonthly ? 'Preserving...' : 'Save Monthly Reflection'}
              </button>
            </div>
          </form>

          {/* Past monthly reflections */}
          {monthlyReflections.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                Preserved Monthly Chronicles
              </h3>
              <div className="space-y-3">
                {monthlyReflections.map((mr) => (
                  <div
                    key={mr.id}
                    className="p-5 rounded-2xl bg-white/70 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-medium font-serif">{mr.yearMonth}</span>
                      <span>Recorded</span>
                    </div>
                    <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                      {mr.summary}
                    </h4>
                    {mr.whatChanged && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic">
                        <span className="font-semibold not-italic">Changed: </span>
                        {mr.whatChanged}
                      </p>
                    )}
                    {mr.whoMattered && mr.whoMattered.length > 0 && (
                      <p className="text-[11px] text-stone-400">
                        With {mr.whoMattered.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
