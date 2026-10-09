import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initial Seed Data with Pakistani atmosphere and evocative moments
const initialMemories = [
  {
    id: 'mem-1',
    userId: 'user-default',
    title: 'The Decision to Return to Islamabad',
    date: '2025-03-12',
    location: 'Margalla Hills Trail 3, Islamabad',
    category: 'Transition',
    coverImageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ],
    story: 'Walking along the pine ridge of Trail 3 after a sudden spring downpour. The scent of rain-soaked red earth (sondhi mitti) hung over the valley below, with the white marble minarets of the mosque gleaming in the twilight mist. For two years abroad, I had questioned whether leaving the diaspora was sensible. But as the fog parted over the foothills and the evening call to prayer echoed from sector to sector, the anxiety gave way to absolute clarity. I was home.',
    emotionNervousElated: 76,
    emotionLonelyConnected: 85,
    emotionUncertainCertain: 82,
    emotionHeavyLight: 88,
    emotionQuietElectric: 71,
    audioUrl: '',
    audioDuration: 34,
    tags: ['homecoming', 'margalla', 'courage', 'roots'],
    people: ['Ahmed', 'Sarah'],
    chapterIds: ['chap-1'],
    reflectionPrompt: 'What were you afraid of losing by returning?',
    reflectionAnswer: 'I was afraid that stepping away from the Western rat race would look like retreat. In truth, returning home was the bravest forward step I had ever taken.',
    favorite: true,
    visibility: 'private',
    createdAt: '2025-03-12T18:30:00Z',
    updatedAt: '2025-03-12T18:30:00Z'
  },
  {
    id: 'mem-2',
    userId: 'user-default',
    title: 'The Passu Cones at Twilight',
    date: '2025-05-18',
    location: 'Passu, Hunza Valley, Karakoram',
    category: 'Adventure',
    coverImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    story: 'The jagged granite cathedrals of the Passu Cones caught the final amber flare of the sun across the turquoise glacial melt. We turned off the jeep engine and sat on the roadside rocks sipping steaming noon-chai with mountain herbs. In the immense silence of northern Pakistan, nobody spoke. It felt as though centuries of starlight were whispering through the glacier breeze.',
    emotionNervousElated: 88,
    emotionLonelyConnected: 90,
    emotionUncertainCertain: 84,
    emotionHeavyLight: 94,
    emotionQuietElectric: 86,
    audioUrl: '',
    audioDuration: 28,
    tags: ['hunza', 'karakoram', 'mountains', 'firsts'],
    people: ['Maya', 'Tariq'],
    chapterIds: ['chap-2'],
    reflectionPrompt: 'What would you remember if the photographs disappeared?',
    reflectionAnswer: 'The bone-deep chill of the glacial wind, the scent of wild mountain thyme, and the awe of feeling infinitesimally small beneath the Karakoram peaks.',
    favorite: true,
    visibility: 'public',
    createdAt: '2025-05-18T20:15:00Z',
    updatedAt: '2025-05-18T20:15:00Z'
  },
  {
    id: 'mem-3',
    userId: 'user-default',
    title: 'Midnight Rooftop Chai in Old Lahore',
    date: '2025-08-04',
    location: 'Delhi Gate, Androon Lahore',
    category: 'Connection',
    coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
    ],
    story: 'A sudden monsoon shower had cooled the red brick terracotta of the old haveli rooftop. Looking out over the historic cupolas and narrow brick alleys, an elderly neighbor brewed cardamom doodh-patti in an aged copper pot. We stayed on woven charpais until 2 AM talking about generational sacrifices and the courage it takes to live unhurriedly in a fast world.',
    emotionNervousElated: 62,
    emotionLonelyConnected: 96,
    emotionUncertainCertain: 78,
    emotionHeavyLight: 88,
    emotionQuietElectric: 45,
    audioUrl: '',
    audioDuration: 42,
    tags: ['lahore', 'androon-shehr', 'chai', 'friendship'],
    people: ['Sarah'],
    chapterIds: ['chap-2'],
    reflectionPrompt: 'What was left unsaid?',
    reflectionAnswer: 'That neither of us knew where life would scatter us next year, yet both felt anchored by an unspoken promise to never lose touch.',
    favorite: false,
    visibility: 'private',
    createdAt: '2025-08-04T23:45:00Z',
    updatedAt: '2025-08-04T23:45:00Z'
  },
  {
    id: 'mem-4',
    userId: 'user-default',
    title: 'Launching the First Urdu Digital Heritage Archive',
    date: '2025-11-15',
    location: 'Rawalpindi Studio',
    category: 'Achievement',
    coverImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    story: 'At 4:18 AM, after eleven consecutive months of crafting digital calligraphy ligatures, debugging, and rewrites, I pressed the production deploy button. My hands were trembling. When the first hundred messages arrived from writers and teachers in Lahore, Karachi, and Peshawar expressing relief that their mother tongue was given digital dignity, I rested my forehead on the wooden desk in quiet gratitude.',
    emotionNervousElated: 92,
    emotionLonelyConnected: 85,
    emotionUncertainCertain: 90,
    emotionHeavyLight: 95,
    emotionQuietElectric: 90,
    audioUrl: '',
    audioDuration: 51,
    tags: ['milestone', 'urdu', 'heritage', 'craft'],
    people: ['Dad', 'Ahmed'],
    chapterIds: ['chap-1'],
    reflectionPrompt: 'What would you tell the version of yourself who started?',
    reflectionAnswer: 'Do not hurry through the agonizing drafts; that is where the soul of the work is actually forged.',
    favorite: true,
    visibility: 'private',
    createdAt: '2025-11-15T04:20:00Z',
    updatedAt: '2025-11-15T04:20:00Z'
  },
  {
    id: 'mem-5',
    userId: 'user-default',
    title: 'The Courtyard on Eid Morning',
    date: '2026-02-10',
    location: 'Ancestral Home Courtyard, Karachi',
    category: 'Family',
    coverImageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [],
    story: 'Waking up before dawn to the clinking of silver bangles and the rich aroma of roasted vermicelli (sheer khurma) simmering with cardamom, saffron, and almonds. Dad was quietly adjusting his crisp starched cotton kurta before the Eid prayers. It made me realize how fast years slip by, and how sacred these quiet family traditions truly are.',
    emotionNervousElated: 40,
    emotionLonelyConnected: 95,
    emotionUncertainCertain: 88,
    emotionHeavyLight: 85,
    emotionQuietElectric: 30,
    audioUrl: '',
    audioDuration: 22,
    tags: ['eid', 'family', 'tradition', 'gratitude'],
    people: ['Dad'],
    chapterIds: ['chap-3'],
    reflectionPrompt: 'What do you hope you’ll always remember?',
    reflectionAnswer: 'The quiet reverence with which Dad prepared breakfast every single morning without ever asking for praise or recognition.',
    favorite: true,
    visibility: 'private',
    createdAt: '2026-02-10T06:15:00Z',
    updatedAt: '2026-02-10T06:15:00Z'
  },
  {
    id: 'mem-6',
    userId: 'user-default',
    title: 'The Solitary Heron at Rawal Lake',
    date: '2026-06-22',
    location: 'Rawal Lake, Islamabad',
    category: 'Discovery',
    coverImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [],
    story: 'I had set out at 6 AM with a mind packed with anxious deadlines. About two kilometers into the water edge, a giant grey-blue heron landed on a weathered rock ten feet from me. It stood completely still for fifteen minutes. Watching it forced my breathing to slow down. I turned off my phone for the rest of that afternoon and rediscovered presence.',
    emotionNervousElated: 55,
    emotionLonelyConnected: 82,
    emotionUncertainCertain: 70,
    emotionHeavyLight: 91,
    emotionQuietElectric: 40,
    audioUrl: '',
    audioDuration: 18,
    tags: ['nature', 'rawal-lake', 'solitude', 'presence'],
    people: [],
    chapterIds: ['chap-3'],
    reflectionPrompt: 'What did you notice first?',
    reflectionAnswer: 'The absolute stillness of its yellow eye and how ripples traveled outward against the current.',
    favorite: false,
    visibility: 'private',
    createdAt: '2026-06-22T17:40:00Z',
    updatedAt: '2026-06-22T17:40:00Z'
  },
  {
    id: 'mem-7',
    userId: 'user-default',
    title: "The Secret Kiryana Ledger in the Rain (خفیہ سخاوت)",
    date: '2026-04-14',
    location: 'Bazaari Mohalla, Rawalpindi',
    category: 'Act of Kindness',
    coverImageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [],
    story: 'It was past 10 PM during a torrential monsoon downpour. An elderly uncle at the neighborhood corner kiryana was quietly setting back his lentils and tea, crestfallen because his modest pension was delayed. The shopkeeper was about to record it in the debt ledger. Without a word, I signaled the shopkeeper, quietly cleared his entire grocery bill for the month, and slipped into the rain before he could turn around. Dignity in our culture is sacred; kindness is purest when it leaves no burden of gratitude behind.',
    emotionNervousElated: 60,
    emotionLonelyConnected: 98,
    emotionUncertainCertain: 88,
    emotionHeavyLight: 96,
    emotionQuietElectric: 78,
    audioUrl: '',
    audioDuration: 25,
    tags: ['sadqah', 'ehsaas', 'kindness', 'grace', 'dignity'],
    people: ['Elder at Kiryana'],
    chapterIds: ['chap-3'],
    reflectionPrompt: 'What prompted you to step forward when you could have looked away?',
    reflectionAnswer: 'Dignity is fragile. Sometimes stepping forward without ceremony is the greatest gift you can offer another human being.',
    favorite: true,
    visibility: 'private',
    createdAt: '2026-04-14T23:15:00Z',
    updatedAt: '2026-04-14T23:15:00Z'
  },
  {
    id: 'mem-8',
    userId: 'user-default',
    title: 'Sitting Beside Tariq Until the Dawn Broke',
    date: '2026-07-03',
    location: 'Mayo Hospital Corridor, Lahore',
    category: 'Acts That Matter',
    coverImageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: [],
    story: 'Tariq had received frightening hospital news that evening. In our culture, grief is not cured by speeches; it is met with silent presence. I simply sat on the cold terrazzo bench beside him for seven hours through the night, bringing hot dhabba chai when his hands shook. When the morning call to prayer rose above the hospital courtyard trees, he turned and said, "Bhai, you didn’t leave." That was all that mattered.',
    emotionNervousElated: 38,
    emotionLonelyConnected: 99,
    emotionUncertainCertain: 80,
    emotionHeavyLight: 85,
    emotionQuietElectric: 45,
    audioUrl: '',
    audioDuration: 30,
    tags: ['presence', 'loyalty', 'brotherhood', 'acts-that-matter'],
    people: ['Tariq'],
    chapterIds: ['chap-1'],
    reflectionPrompt: 'What did this teach you about quiet presence over words?',
    reflectionAnswer: 'True presence does not demand answers. It only asks for the willingness to share the weight of silence.',
    favorite: true,
    visibility: 'private',
    createdAt: '2026-07-03T06:00:00Z',
    updatedAt: '2026-07-03T06:00:00Z'
  }
];

const initialChapters = [
  {
    id: 'chap-1',
    userId: 'user-default',
    title: 'Bab-e-Umeed: Returning & Building',
    description: 'Leaving behind the comfortable shore abroad to build something true at home, and standing beside those who needed an anchor.',
    coverImageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    themeColor: '#D4AF37',
    memoryIds: ['mem-1', 'mem-4', 'mem-8'],
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'chap-2',
    userId: 'user-default',
    title: 'Safar-e-Shamal: The Karakoram Horizons',
    description: 'Encounters with the high valleys, night conversations over Kashmiri chai, and the silence of ancient mountains.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    themeColor: '#3B7A9E',
    memoryIds: ['mem-2', 'mem-3'],
    createdAt: '2025-04-10T00:00:00Z'
  },
  {
    id: 'chap-3',
    userId: 'user-default',
    title: 'Dharohar: Courtyards, Elders & Quiet Grace',
    description: 'Moments of return, Eid mornings, unexpected kindness extended to strangers, and finding stillness in everyday rituals.',
    coverImageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    themeColor: '#2E8B75',
    memoryIds: ['mem-5', 'mem-6', 'mem-7'],
    createdAt: '2026-01-05T00:00:00Z'
  }
];

const initialPeople = [
  { id: 'p-1', name: 'Sarah', relationship: 'Best Friend & Confidante', notes: 'Known since university, always shares deep evening teas over old city rooftops.', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: 'p-2', name: 'Dad', relationship: 'Father & Anchor', notes: 'Cardamom doodh-patti and quiet wisdom at dawn.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 'p-3', name: 'Ahmed', relationship: 'Co-founder & Brother', notes: 'First believer in the project and steady during storms.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'p-4', name: 'Maya', relationship: 'Travel Companion', notes: 'Never hesitates to turn down an uncharted Karakoram mountain road.', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: 'p-5', name: 'Tariq', relationship: 'Lifelong Friend & Brother', notes: 'Shared hospital vigil and unbroken loyalty.', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
];

// In-Memory Database store with mock user session
type ServerMemory = (typeof initialMemories)[number] & {
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  department?: string;
  wordCount?: number;
};
type ServerChapter = (typeof initialChapters)[number] & {
  department?: string;
};
let memories: ServerMemory[] = [...initialMemories];
let chapters: ServerChapter[] = [...initialChapters];
let people = [...initialPeople];
let reflections: any[] = [];
let monthlyReflections: any[] = [
  {
    id: 'mref-2026-08',
    yearMonth: '2026-08',
    summary: 'A season of steady creative output, quiet reconnection with family, and spontaneous acts of kindness in the bazaar.',
    whatChanged: 'I learned to decline commitments that compromise my evening peace and look out for elders in need.',
    whatMattered: 'The quiet mornings in the courtyard, helping a stranger in the rain, and dusk walks by Rawal Lake.',
    whoMattered: ['Dad', 'Sarah', 'Tariq'],
    createdAt: '2026-08-31T20:00:00Z'
  }
];

let currentUser = {
  id: 'user-default',
  email: 'executive@sheeraza.corp',
  displayName: 'The Chronicler (مسافر)',
  bio: 'Preserving quiet acts of kindness (نیکی) and organizational chronicles.',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'admin',
  department: 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
  organization: 'Sheeraza Enterprise Group (شیرازہ گروپ)',
  securityClearance: 'Level 4 — Enterprise Governance',
  onboardingCompleted: true,
  theme: 'light',
  aiEnabled: true,
  createdAt: '2025-01-01T00:00:00Z'
};

// API ROUTES

// 1. Auth routes
app.get('/api/auth/me', (req, res) => {
  res.json({ user: currentUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  currentUser.email = email || currentUser.email;
  res.json({ user: currentUser, token: 'session-token-valid' });
});

app.post('/api/auth/google', (req, res) => {
  res.json({ user: currentUser, token: 'session-token-google' });
});

app.post('/api/auth/register', (req, res) => {
  const { email, displayName } = req.body;
  currentUser = {
    ...currentUser,
    email: email || currentUser.email,
    displayName: displayName || currentUser.displayName,
    onboardingCompleted: false
  };
  res.json({ user: currentUser });
});

app.post('/api/auth/profile', (req, res) => {
  currentUser = { ...currentUser, ...req.body };
  res.json({ user: currentUser });
});

app.post('/api/auth/reset-password', (req, res) => {
  res.json({ message: 'A password reset link has been dispatched to your email address.' });
});

// 2. Memories routes
app.get('/api/memories', (req, res) => {
  const { category, search, tag, person, favorite, year } = req.query;
  let result = [...memories];

  if (category && category !== 'All') {
    result = result.filter(m => m.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (favorite === 'true') {
    result = result.filter(m => m.favorite);
  }

  if (tag) {
    result = result.filter(m => m.tags.includes(tag as string));
  }

  if (person) {
    result = result.filter(m => m.people.includes(person as string));
  }

  if (year) {
    result = result.filter(m => m.date.startsWith(year as string));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.story.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q)) ||
      m.people.some(p => p.toLowerCase().includes(q))
    );
  }

  // Sort by date descending
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({ memories: result });
});

app.get('/api/listings', (req, res) => {
  const { category, search, sort = 'latest' } = req.query;
  let allListings = [...memories];

  if (category && category !== 'All') {
    allListings = allListings.filter(m => m.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    allListings = allListings.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.story.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q)) ||
      m.people.some(p => p.toLowerCase().includes(q))
    );
  }

  if (sort === 'oldest') {
    allListings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sort === 'kindness') {
    allListings.sort((a, b) => {
      const aIsKind = a.category === 'Act of Kindness' || a.category === 'Acts That Matter' ? 1 : 0;
      const bIsKind = b.category === 'Act of Kindness' || b.category === 'Acts That Matter' ? 1 : 0;
      return bIsKind - aIsKind || new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } else if (sort === 'az') {
    allListings.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    allListings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const featured = memories
    .filter(m => m.favorite || m.category === 'Act of Kindness' || m.category === 'Acts That Matter')
    .slice(0, 6);

  const latest = [...memories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12);

  const stats = {
    total: memories.length,
    featuredCount: memories.filter(m => m.favorite).length,
    kindnessCount: memories.filter(m => m.category === 'Act of Kindness' || m.category === 'Acts That Matter').length,
    audioCount: memories.filter(m => m.audioUrl).length,
    locationsCount: new Set(memories.map(m => m.location).filter(Boolean)).size,
    chaptersCount: chapters.length
  };

  res.json({
    listings: allListings,
    featured,
    latest,
    stats
  });
});

app.get('/api/memories/:id', (req, res) => {
  const memory = memories.find(m => m.id === req.params.id);
  if (!memory) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  // Find related memories based on shared tags, people, category, or chapter
  const related = memories
    .filter(m => m.id !== memory.id)
    .map(other => {
      let score = 0;
      if (other.category === memory.category) score += 2;
      const sharedPeople = other.people.filter(p => memory.people.includes(p));
      score += sharedPeople.length * 3;
      const sharedTags = other.tags.filter(t => memory.tags.includes(t));
      score += sharedTags.length * 2;
      return { memory: other, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.memory);

  res.json({ memory, related });
});

app.post('/api/memories', (req, res) => {
  const newMemory = {
    id: `mem-${Date.now()}`,
    userId: currentUser.id,
    title: req.body.title || 'Untitled Moment',
    date: req.body.date || new Date().toISOString().split('T')[0],
    location: req.body.location || '',
    category: req.body.category || 'Discovery',
    coverImageUrl: req.body.coverImageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    artifactUrls: req.body.artifactUrls || [],
    story: req.body.story || '',
    emotionNervousElated: req.body.emotionNervousElated ?? 50,
    emotionLonelyConnected: req.body.emotionLonelyConnected ?? 50,
    emotionUncertainCertain: req.body.emotionUncertainCertain ?? 50,
    emotionHeavyLight: req.body.emotionHeavyLight ?? 50,
    emotionQuietElectric: req.body.emotionQuietElectric ?? 50,
    audioUrl: req.body.audioUrl || '',
    audioDuration: req.body.audioDuration || 0,
    tags: req.body.tags || [],
    people: req.body.people || [],
    chapterIds: req.body.chapterIds || [],
    reflectionPrompt: req.body.reflectionPrompt || '',
    reflectionAnswer: req.body.reflectionAnswer || '',
    favorite: !!req.body.favorite,
    visibility: req.body.visibility || 'private',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  memories.unshift(newMemory);

  // Link to chapters
  if (newMemory.chapterIds.length > 0) {
    chapters = chapters.map(chap => {
      if (newMemory.chapterIds.includes(chap.id) && !chap.memoryIds.includes(newMemory.id)) {
        return { ...chap, memoryIds: [...chap.memoryIds, newMemory.id] };
      }
      return chap;
    });
  }

  res.status(201).json({ memory: newMemory });
});

app.put('/api/memories/:id', (req, res) => {
  const index = memories.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Memory not found' });

  memories[index] = {
    ...memories[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({ memory: memories[index] });
});

app.post('/api/memories/:id/toggle-favorite', (req, res) => {
  const index = memories.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Memory not found' });

  memories[index].favorite = !memories[index].favorite;
  res.json({ memory: memories[index] });
});

app.post('/api/memories/:id/verify', (req, res) => {
  const index = memories.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Memory not found' });

  const status = req.body.verified !== undefined ? req.body.verified : true;
  memories[index] = {
    ...memories[index],
    verified: status,
    verifiedBy: req.body.verifiedBy || currentUser.displayName,
    verifiedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json({ memory: memories[index] });
});

let serverAuditLogs: any[] = [];

app.get('/api/audit-logs', (req, res) => {
  res.json({ auditLogs: serverAuditLogs });
});

app.post('/api/audit-logs', (req, res) => {
  const log = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    userId: req.body.userId || currentUser.id,
    userEmail: req.body.userEmail || currentUser.email,
    action: req.body.action || 'UPDATE',
    resourceType: req.body.resourceType || 'SYSTEM',
    resourceId: req.body.resourceId || '',
    details: req.body.details || '',
    timestamp: new Date().toISOString()
  };
  serverAuditLogs.unshift(log);
  if (serverAuditLogs.length > 200) serverAuditLogs.pop();
  res.status(201).json({ auditLog: log });
});

app.delete('/api/memories/:id', (req, res) => {
  memories = memories.filter(m => m.id !== req.params.id);
  // Remove from chapters
  chapters = chapters.map(c => ({
    ...c,
    memoryIds: c.memoryIds.filter(id => id !== req.params.id)
  }));
  res.json({ success: true });
});

// 3. Chapters routes
app.get('/api/chapters', (req, res) => {
  // Populate memories for each chapter
  const enriched = chapters.map(chap => ({
    ...chap,
    memories: memories.filter(m => chap.memoryIds.includes(m.id))
  }));
  res.json({ chapters: enriched });
});

app.get('/api/chapters/:id', (req, res) => {
  const chapter = chapters.find(c => c.id === req.params.id);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const chapterMemories = memories.filter(m => chapter.memoryIds.includes(m.id));
  res.json({ chapter: { ...chapter, memories: chapterMemories } });
});

app.post('/api/chapters', (req, res) => {
  const newChap = {
    id: `chap-${Date.now()}`,
    userId: currentUser.id,
    title: req.body.title || 'New Chapter',
    description: req.body.description || '',
    coverImageUrl: req.body.coverImageUrl || memories[0]?.coverImageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    startDate: req.body.startDate || '2025-01-01',
    endDate: req.body.endDate || '2026-12-31',
    themeColor: req.body.themeColor || '#D4AF37',
    memoryIds: req.body.memoryIds || [],
    createdAt: new Date().toISOString()
  };
  chapters.push(newChap);
  res.status(201).json({ chapter: newChap });
});

app.put('/api/chapters/:id', (req, res) => {
  const index = chapters.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Chapter not found' });

  chapters[index] = { ...chapters[index], ...req.body };
  res.json({ chapter: chapters[index] });
});

app.delete('/api/chapters/:id', (req, res) => {
  chapters = chapters.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// 4. People routes
app.get('/api/people', (req, res) => {
  const enriched = people.map(p => {
    const personMemories = memories.filter(m => m.people.includes(p.name));
    return {
      ...p,
      memoryCount: personMemories.length,
      recentMemory: personMemories[0] || null
    };
  });
  res.json({ people: enriched });
});

app.post('/api/people', (req, res) => {
  const newPerson = {
    id: `p-${Date.now()}`,
    name: req.body.name,
    relationship: req.body.relationship || 'Friend',
    notes: req.body.notes || '',
    photoUrl: req.body.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  };
  people.push(newPerson);
  res.status(201).json({ person: newPerson });
});

// 5. Guided Reflection & Monthly Review
app.get('/api/reflections', (req, res) => {
  res.json({ reflections });
});

app.post('/api/reflections', (req, res) => {
  const newRef = {
    id: `ref-${Date.now()}`,
    userId: currentUser.id,
    memoryId: req.body.memoryId,
    momentTitle: req.body.momentTitle,
    stepResponses: req.body.stepResponses,
    createdAt: new Date().toISOString()
  };
  reflections.unshift(newRef);
  res.status(201).json({ reflection: newRef });
});

app.get('/api/monthly-reflections', (req, res) => {
  res.json({ monthlyReflections });
});

app.post('/api/monthly-reflections', (req, res) => {
  const newMonRef = {
    id: `mref-${Date.now()}`,
    userId: currentUser.id,
    yearMonth: req.body.yearMonth,
    summary: req.body.summary,
    whatChanged: req.body.whatChanged,
    whatMattered: req.body.whatMattered,
    whoMattered: req.body.whoMattered || [],
    createdAt: new Date().toISOString()
  };
  monthlyReflections.unshift(newMonRef);
  res.status(201).json({ monthlyReflection: newMonRef });
});

// 6. Constellation Graph Data
app.get('/api/constellation', (req, res) => {
  // Generate nodes from memories
  const nodes = memories.map((m, index) => {
    // Generate organic layout coordinates or calculate based on date/category
    const dateNum = new Date(m.date).getTime();
    return {
      id: m.id,
      title: m.title,
      date: m.date,
      category: m.category,
      coverImageUrl: m.coverImageUrl,
      intensity: (m.emotionQuietElectric + m.emotionHeavyLight) / 2,
      story: m.story.substring(0, 140) + '...',
      tags: m.tags,
      people: m.people,
      favorite: m.favorite
    };
  });

  // Calculate links between nodes
  const links: { source: string; target: string; reason: string; strength: number }[] = [];
  for (let i = 0; i < memories.length; i++) {
    for (let j = i + 1; j < memories.length; j++) {
      const a = memories[i];
      const b = memories[j];
      const commonPeople = a.people.filter(p => b.people.includes(p));
      const commonTags = a.tags.filter(t => b.tags.includes(t));
      const sameCategory = a.category === b.category;
      const commonChapters = (a.chapterIds || []).filter(c => (b.chapterIds || []).includes(c));

      if (commonPeople.length > 0) {
        links.push({ source: a.id, target: b.id, reason: `Shared person: ${commonPeople.join(', ')}`, strength: 0.8 });
      } else if (commonChapters.length > 0) {
        links.push({ source: a.id, target: b.id, reason: 'Same Chapter', strength: 0.7 });
      } else if (commonTags.length > 0) {
        links.push({ source: a.id, target: b.id, reason: `Shared theme: ${commonTags[0]}`, strength: 0.5 });
      } else if (sameCategory && Math.random() > 0.4) {
        links.push({ source: a.id, target: b.id, reason: `Category: ${a.category}`, strength: 0.3 });
      }
    }
  }

  res.json({ nodes, links });
});

// 7. AI-Assisted Features with @google/genai
app.post('/api/ai/prompts', async (req, res) => {
  const { title, category, story } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptText = `You are Sheeraza (شیرازہ), a poetic, deeply compassionate and reflective Pakistani companion for preserving life moments, quiet acts of kindness (نیکی اور احساس), and the deeds that truly matter.
The user is documenting a memory in the category "${category || 'Life'}".
Title: "${title || 'Untitled'}"
User's raw story: "${story || 'Just began reminiscing...'}"

Generate 3 deeply moving, non-intrusive questions that help the user uncover what this moment really felt like—sensory details, unsaid words, or quiet truths.
Return only valid JSON array of 3 strings: ["question 1", "question 2", "question 3"].`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText
      });
      const text = response.text || '';
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const questions = JSON.parse(match[0]);
        return res.json({ questions });
      }
    } catch (err) {
      console.error('Gemini prompt generation failed, falling back to curated prompts', err);
    }
  }

  // Graceful curated fallbacks
  const fallbacks: Record<string, string[]> = {
    Achievement: [
      'What did it take to get here that nobody else ever saw?',
      'What would you tell the version of yourself who began this path?',
      'What did you learn about your own capacity for endurance?'
    ],
    Adventure: [
      'What did the air smell like in that exact second?',
      'What would you remember if all the photographs disappeared?',
      'What surprised you about how the world felt far from home?'
    ],
    Connection: [
      'What was left unsaid between you in that moment?',
      'What did this person awaken in your understanding of yourself?',
      'What small gesture made this hour feel timeless?'
    ],
    Transition: [
      'What were you quietly leaving behind at the threshold?',
      'What were you most afraid of losing by saying yes?',
      'What changed within you after the dust settled?'
    ],
    'Act of Kindness': [
      'What prompted you to step forward when you could have walked away?',
      'Who was touched by this quiet grace, and what shifted in the room?',
      'What unexpected ripple did this moment set in motion?'
    ],
    'Acts That Matter': [
      'Why did this moment matter more than any external applause or status?',
      'What did this teach you about quiet presence and loyalty?',
      'What truth about your own humanity did this hour solidify?'
    ]
  };

  res.json({ questions: fallbacks[category] || [
    'What do you notice when you close your eyes and return to this moment?',
    'What did this second change about your story?',
    'What do you want your future self to remember about this feeling?'
  ]});
});

app.post('/api/ai/writing-assist', async (req, res) => {
  const { action, text, category, title } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && text) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      let instructions = '';
      if (action === 'clarify') {
        instructions = 'Refine this memory narrative for emotional clarity while keeping the user’s exact voice, rhythm, and authenticity intact.';
      } else if (action === 'expand') {
        instructions = 'Gently invite more sensory depth (sounds, textures, silence, light) into this memory without fabricating artificial drama.';
      } else if (action === 'emotional-core') {
        instructions = 'Distill the single emotional heartbeat and realization of this memory in 2-3 poetic sentences.';
      } else {
        instructions = 'Offer a gentle opening paragraph to help the user begin writing this moment.';
      }

      const prompt = `Context: Memory titled "${title || 'Moment'}" under category "${category || 'Life'}".
User text: "${text}"
Task: ${instructions}
Return only the suggested prose, pure and respectful of their life.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return res.json({ suggestion: response.text?.trim() });
    } catch (err) {
      console.error('Gemini assist error', err);
    }
  }

  // Fallback assist
  let fallbackText = '';
  if (action === 'emotional-core') {
    fallbackText = `At its core, this was the quiet realization that some moments do not ask for explanations; they simply ask to be felt and carried forward.`;
  } else if (action === 'clarify') {
    fallbackText = text ? `${text.trim()} Looking back now, the stillness of that hour remains completely unblemished by the rush of whatever came next.` : 'Begin with where you were standing and what you heard first.';
  } else {
    fallbackText = `The day held an unusual quiet. Before the decision was made, there was a suspended second where everything hung in balance.`;
  }

  res.json({ suggestion: fallbackText });
});

// 8. Public Shared Links
app.get('/api/shared/:id', (req, res) => {
  const memory = memories.find(m => m.id === req.params.id);
  if (memory) {
    return res.json({ type: 'memory', item: memory, author: currentUser.displayName });
  }

  const chapter = chapters.find(c => c.id === req.params.id);
  if (chapter) {
    const chapterMemories = memories.filter(m => chapter.memoryIds.includes(m.id));
    return res.json({ type: 'chapter', item: { ...chapter, memories: chapterMemories }, author: currentUser.displayName });
  }

  res.status(404).json({ error: 'Shared moment or chapter not found' });
});

// 9. Export Keepsake
app.get('/api/export/data', (req, res) => {
  res.json({
    exportedAt: new Date().toISOString(),
    user: currentUser,
    memories,
    chapters,
    people,
    reflections,
    monthlyReflections
  });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sheeraza Living Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
