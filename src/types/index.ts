export type MemoryCategory = 
  | 'Act of Kindness'
  | 'Acts That Matter'
  | 'Achievement' 
  | 'Adventure' 
  | 'Connection' 
  | 'Transition' 
  | 'Discovery' 
  | 'Creativity' 
  | 'Family' 
  | 'Other';

export interface EmotionalPulse {
  nervousElated: number; // 0 (Nervous) to 100 (Elated)
  lonelyConnected: number; // 0 (Lonely) to 100 (Connected)
  uncertainCertain: number; // 0 (Uncertain) to 100 (Certain)
  heavyLight: number; // 0 (Heavy) to 100 (Light)
  quietElectric: number; // 0 (Quiet) to 100 (Electric)
}

export type CorporateRole = 'admin' | 'executive' | 'chronicler' | 'auditor';

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'VERIFY' | 'LOGIN' | 'ROLE_CHANGE';
  resourceType: 'CHRONICLE' | 'CHAPTER' | 'USER' | 'SYSTEM' | 'COMPLIANCE';
  resourceId?: string;
  details: string;
  timestamp: string;
}

export interface Memory {
  id: string;
  userId: string;
  title: string;
  story: string;
  date: string; // YYYY-MM-DD
  location: string;
  category: MemoryCategory;
  coverImageUrl: string;
  artifactUrls: string[];
  audioUrl?: string;
  audioDuration?: number;
  emotionNervousElated: number;
  emotionLonelyConnected: number;
  emotionUncertainCertain: number;
  emotionHeavyLight: number;
  emotionQuietElectric: number;
  people: string[];
  tags: string[];
  chapterIds: string[];
  reflectionPrompt?: string;
  reflectionAnswer?: string;
  favorite: boolean;
  visibility: 'private' | 'shared' | 'public' | 'department';
  department?: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  startDate: string;
  endDate: string;
  themeColor: string;
  memoryIds: string[];
  department?: string;
  createdAt: string;
  memories?: Memory[];
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  notes?: string;
  photoUrl?: string;
  memoryCount?: number;
  recentMemory?: Memory;
}

export interface ReflectionSession {
  id: string;
  userId: string;
  memoryId?: string;
  momentTitle: string;
  stepResponses: {
    prompt: string;
    response: string;
  }[];
  createdAt: string;
}

export interface MonthlyReflection {
  id: string;
  yearMonth: string; // e.g. "2026-09"
  summary: string;
  whatChanged: string;
  whatMattered: string;
  whoMattered: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  photoUrl: string;
  role: CorporateRole;
  department: string;
  organization: string;
  securityClearance?: string;
  onboardingCompleted: boolean;
  theme: 'light' | 'dark';
  aiEnabled: boolean;
  createdAt: string;
}

export interface ConstellationNode {
  id: string;
  title: string;
  date: string;
  category: MemoryCategory;
  coverImageUrl: string;
  intensity: number;
  story: string;
  tags: string[];
  people: string[];
  favorite: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface ConstellationLink {
  source: string;
  target: string;
  reason: string;
  strength: number;
}
