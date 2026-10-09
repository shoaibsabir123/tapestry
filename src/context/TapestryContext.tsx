import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Memory,
  Chapter,
  Person,
  ReflectionSession,
  MonthlyReflection,
  UserProfile,
  CorporateRole,
  AuditLog
} from '../types';
import {
  testFirestoreConnection,
  ensureAuthenticated,
  subscribeToMemories,
  saveMemoryToDb,
  updateMemoryInDb,
  deleteMemoryFromDb,
  verifyChronicleInDb,
  subscribeToAuditLogs,
  recordAuditLog,
  syncUserProfileToDb
} from '../services/firebase';

interface ToastItem {
  id: string;
  message: string;
}

interface TapestryContextType {
  memories: Memory[];
  chapters: Chapter[];
  people: Person[];
  reflections: ReflectionSession[];
  monthlyReflections: MonthlyReflection[];
  auditLogs: AuditLog[];
  user: UserProfile | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentRoute: string;
  navigate: (route: string) => void;
  selectedMemoryId: string | null;
  setSelectedMemoryId: (id: string | null) => void;
  selectedChapterId: string | null;
  setSelectedChapterId: (id: string | null) => void;
  previewMemory: Memory | null;
  setPreviewMemory: (m: Memory | null) => void;
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastItem[];
  showToast: (msg: string) => void;
  loading: boolean;
  firestoreConnected: boolean;
  
  // Corporate RBAC & Governance
  corporateRole: CorporateRole;
  setCorporateRole: (role: CorporateRole) => void;
  corporateDepartment: string;
  setCorporateDepartment: (dept: string) => void;
  verifyChronicle: (id: string, status: boolean) => Promise<void>;
  
  // CRUD
  addMemory: (mem: Partial<Memory>) => Promise<Memory>;
  updateMemory: (id: string, mem: Partial<Memory>) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  addChapter: (chap: Partial<Chapter>) => Promise<Chapter>;
  updateChapter: (id: string, chap: Partial<Chapter>) => Promise<Chapter>;
  deleteChapter: (id: string) => Promise<boolean>;
  addPerson: (p: Partial<Person>) => Promise<Person>;
  addReflection: (data: any) => Promise<any>;
  addMonthlyReflection: (data: any) => Promise<any>;
  updateProfile: (prof: Partial<UserProfile>) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TapestryContext = createContext<TapestryContextType | undefined>(undefined);

export function TapestryProvider({ children }: { children: React.ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [reflections, setReflections] = useState<ReflectionSession[]>([]);
  const [monthlyReflections, setMonthlyReflections] = useState<MonthlyReflection[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  // Corporate User Profile
  const [user, setUser] = useState<UserProfile | null>({
    id: 'corp-user-1',
    email: 'executive@sheeraza.corp',
    displayName: 'The Chronicler (مسافر)',
    bio: 'Preserving quiet acts of kindness (نیکی) and organizational chronicles.',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    department: 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
    organization: 'Sheeraza Enterprise Group (شیرازہ گروپ)',
    securityClearance: 'Level 4 — Enterprise Governance',
    onboardingCompleted: true,
    theme: 'light',
    aiEnabled: true,
    createdAt: new Date().toISOString()
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [previewMemory, setPreviewMemory] = useState<Memory | null>(null);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  // Sync route with browser history
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', route);
    } catch {
      // In iframe or sandboxed mode
    }
  };

  const showToast = (message: string) => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  // Role switch helper
  const setCorporateRole = (role: CorporateRole) => {
    setUser((prev) => (prev ? { ...prev, role } : null));
    showToast(`Corporate role changed to: ${role.toUpperCase()}`);
    recordAuditLog('ROLE_CHANGE', 'USER', user?.id || 'corp-user', `Switched active role to ${role}`, user);
  };

  const setCorporateDepartment = (department: string) => {
    setUser((prev) => (prev ? { ...prev, department } : null));
    showToast(`Active Department set to: ${department}`);
  };

  // BOOT: Test Firestore Connection & Initialize
  useEffect(() => {
    let unsubscribeMemories: (() => void) | null = null;
    let unsubscribeAudit: (() => void) | null = null;

    async function initDatabase() {
      try {
        setLoading(true);
        // 1. Mandatory Firestore Connection test
        const isOnline = await testFirestoreConnection();
        setFirestoreConnected(isOnline);
        await ensureAuthenticated();

        // 2. Fetch server seeds / fallback
        const [memRes, chapRes, peopleRes, monRes, refRes, userRes] = await Promise.allSettled([
          fetch('/api/memories'),
          fetch('/api/chapters'),
          fetch('/api/people'),
          fetch('/api/monthly-reflections'),
          fetch('/api/reflections'),
          fetch('/api/auth/me')
        ]);

        if (userRes.status === 'fulfilled' && userRes.value.ok) {
          const userData = await userRes.value.json();
          if (userData.user) {
            setUser((prev) => ({
              ...userData.user,
              role: prev?.role || 'admin',
              department: prev?.department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
              organization: prev?.organization || 'Sheeraza Enterprise Group (شیرازہ گروپ)'
            }));
          }
        }

        if (chapRes.status === 'fulfilled' && chapRes.value.ok) {
          const chapData = await chapRes.value.json();
          setChapters(chapData.chapters || []);
        }

        if (peopleRes.status === 'fulfilled' && peopleRes.value.ok) {
          const peopleData = await peopleRes.value.json();
          setPeople(peopleData.people || []);
        }

        if (monRes.status === 'fulfilled' && monRes.value.ok) {
          const monData = await monRes.value.json();
          setMonthlyReflections(monData.monthlyReflections || []);
        }

        if (refRes.status === 'fulfilled' && refRes.value.ok) {
          const refData = await refRes.value.json();
          setReflections(refData.reflections || []);
        }

        // Default initial server memories if Firestore is fresh
        let initialMems: Memory[] = [];
        if (memRes.status === 'fulfilled' && memRes.value.ok) {
          const memData = await memRes.value.json();
          initialMems = memData.memories || [];
          setMemories(initialMems);
        }

        // 3. Connect real-time Firestore listeners
        unsubscribeMemories = subscribeToMemories(
          (liveMemories) => {
            if (liveMemories && liveMemories.length > 0) {
              setMemories(liveMemories);
            }
          },
          (err) => console.warn('Firestore live memories notice:', err)
        );

        unsubscribeAudit = subscribeToAuditLogs(
          (logs) => {
            if (logs && logs.length > 0) {
              setAuditLogs(logs);
            }
          },
          (err) => console.warn('Firestore live audit notice:', err)
        );

        // Initial audit log for corporate session
        await recordAuditLog('LOGIN', 'SYSTEM', 'session', 'Enterprise session initialized with persistent database', user);
      } catch (err) {
        console.error('Database initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initDatabase();

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path && path !== '/') {
        setCurrentRoute(path);
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (unsubscribeMemories) unsubscribeMemories();
      if (unsubscribeAudit) unsubscribeAudit();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ADD MEMORY / CHRONICLE
  const addMemory = async (mem: Partial<Memory>): Promise<Memory> => {
    const wordCount = mem.story ? mem.story.trim().split(/\s+/).filter(Boolean).length : 0;
    const newMemory: Memory = {
      id: mem.id || `mem-${Date.now()}`,
      userId: user?.id || 'corp-user-1',
      title: mem.title || 'Untitled Chronicle',
      date: mem.date || new Date().toISOString().split('T')[0],
      location: mem.location || '',
      category: mem.category || 'Act of Kindness',
      coverImageUrl:
        mem.coverImageUrl ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      artifactUrls: mem.artifactUrls || [],
      story: mem.story || '',
      emotionNervousElated: mem.emotionNervousElated ?? 65,
      emotionLonelyConnected: mem.emotionLonelyConnected ?? 80,
      emotionUncertainCertain: mem.emotionUncertainCertain ?? 70,
      emotionHeavyLight: mem.emotionHeavyLight ?? 75,
      emotionQuietElectric: mem.emotionQuietElectric ?? 60,
      audioUrl: mem.audioUrl || '',
      audioDuration: mem.audioDuration || 0,
      people: mem.people || [],
      tags: mem.tags || [],
      chapterIds: mem.chapterIds || [],
      reflectionPrompt: mem.reflectionPrompt || '',
      reflectionAnswer: mem.reflectionAnswer || '',
      favorite: !!mem.favorite,
      visibility: mem.visibility || 'department',
      department: mem.department || user?.department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
      verified: false,
      wordCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Optimistic Local Update
    setMemories((prev) => [newMemory, ...prev]);

    // 2. Persist to Firestore & Audit Log
    try {
      await saveMemoryToDb(newMemory, user || undefined);
    } catch (e) {
      console.warn('Firestore write warning (falling back to server API):', e);
    }

    // 3. Sync to Express backend API
    try {
      await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemory)
      });
    } catch {
      // Ignore
    }

    showToast(`Chronicle preserved in persistent database (${wordCount} words).`);
    return newMemory;
  };

  // UPDATE MEMORY
  const updateMemory = async (id: string, mem: Partial<Memory>): Promise<Memory> => {
    const updated: Partial<Memory> = {
      ...mem,
      updatedAt: new Date().toISOString()
    };
    if (mem.story) {
      updated.wordCount = mem.story.trim().split(/\s+/).filter(Boolean).length;
    }

    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));

    try {
      await updateMemoryInDb(id, updated, user || undefined);
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }

    try {
      await fetch(`/api/memories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {
      // Ignore
    }

    showToast('Chronicle updated across enterprise database.');
    return { ...memories.find((m) => m.id === id)!, ...updated } as Memory;
  };

  // DELETE MEMORY
  const deleteMemory = async (id: string): Promise<boolean> => {
    setMemories((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteMemoryFromDb(id, user || undefined);
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }

    try {
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }

    showToast('Chronicle purged from active database.');
    return true;
  };

  // VERIFY CHRONICLE (Corporate Certification)
  const verifyChronicle = async (id: string, status: boolean): Promise<void> => {
    if (!user) return;
    setMemories((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              verified: status,
              verifiedBy: user.displayName,
              verifiedAt: new Date().toISOString()
            }
          : m
      )
    );

    try {
      await verifyChronicleInDb(id, user, status);
      showToast(status ? 'Chronicle certified & verified.' : 'Verification revoked.');
    } catch (e) {
      console.warn('Verification save error:', e);
    }
  };

  // TOGGLE FAVORITE
  const toggleFavorite = async (id: string) => {
    const mem = memories.find((m) => m.id === id);
    if (!mem) return;
    const nextFav = !mem.favorite;

    await updateMemory(id, { favorite: nextFav });
    showToast(nextFav ? 'Marked as Anchor Chronicle.' : 'Unmarked anchor.');
  };

  // CHAPTERS
  const addChapter = async (chap: Partial<Chapter>): Promise<Chapter> => {
    const newChap: Chapter = {
      id: `chap-${Date.now()}`,
      userId: user?.id || 'corp-user-1',
      title: chap.title || 'New Chapter',
      description: chap.description || '',
      coverImageUrl:
        chap.coverImageUrl ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      startDate: chap.startDate || '2025-01-01',
      endDate: chap.endDate || '2026-12-31',
      themeColor: chap.themeColor || '#059669',
      memoryIds: chap.memoryIds || [],
      department: user?.department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
      createdAt: new Date().toISOString()
    };

    setChapters((prev) => [...prev, newChap]);
    try {
      await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChap)
      });
      await recordAuditLog('CREATE', 'CHAPTER', newChap.id, `Created corporate chapter "${newChap.title}"`, user);
    } catch {
      // Ignore
    }

    showToast('New organizational chapter created.');
    return newChap;
  };

  const updateChapter = async (id: string, chap: Partial<Chapter>): Promise<Chapter> => {
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, ...chap } : c)));
    try {
      await fetch(`/api/chapters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chap)
      });
    } catch {
      // Ignore
    }
    showToast('Chapter details updated.');
    return { ...chapters.find((c) => c.id === id)!, ...chap } as Chapter;
  };

  const deleteChapter = async (id: string): Promise<boolean> => {
    setChapters((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/chapters/${id}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }
    showToast('Chapter archived.');
    return true;
  };

  // PEOPLE
  const addPerson = async (p: Partial<Person>): Promise<Person> => {
    const fallbackPerson: Person = {
      id: `p-${Date.now()}`,
      name: p.name || 'Colleague / Companion',
      relationship: p.relationship || 'Associate',
      notes: p.notes || '',
      photoUrl:
        p.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };
    setPeople((prev) => [...prev, fallbackPerson]);
    try {
      await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPerson)
      });
    } catch {
      // Ignore
    }
    showToast(`${p.name} recorded in connections.`);
    return fallbackPerson;
  };

  // REFLECTIONS
  const addReflection = async (data: any) => {
    const fallback = { id: `ref-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    setReflections((prev) => [fallback, ...prev]);
    try {
      await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {
      // Ignore
    }
    showToast('Reflection inscribed into the sanctuary.');
    return fallback;
  };

  const addMonthlyReflection = async (data: any) => {
    const fallback = { id: `mref-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    setMonthlyReflections((prev) => [fallback, ...prev]);
    try {
      await fetch('/api/monthly-reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {
      // Ignore
    }
    showToast('Monthly governance reflection preserved.');
    return fallback;
  };

  // PROFILE
  const updateProfile = async (prof: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...prof };
      syncUserProfileToDb(updated);
      return updated;
    });
    try {
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prof)
      });
    } catch {
      // Ignore
    }
    showToast('Corporate profile updated.');
  };

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setUser((prev) => ({
        ...data.user,
        role: prev?.role || 'admin',
        department: prev?.department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
        organization: prev?.organization || 'Sheeraza Enterprise Group (شیرازہ گروپ)'
      }));
      showToast(`Corporate session active: ${data.user.displayName}`);
    } catch {
      // Fallback
      setUser((prev) => (prev ? { ...prev, email } : null));
    }
  };

  const logout = async () => {
    showToast('Corporate session signed out.');
    navigate('/login');
  };

  return (
    <TapestryContext.Provider
      value={{
        memories,
        chapters,
        people,
        reflections,
        monthlyReflections,
        auditLogs,
        user,
        theme,
        toggleTheme,
        currentRoute,
        navigate,
        selectedMemoryId,
        setSelectedMemoryId,
        selectedChapterId,
        setSelectedChapterId,
        previewMemory,
        setPreviewMemory,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        loading,
        firestoreConnected,
        corporateRole: user?.role || 'admin',
        setCorporateRole,
        corporateDepartment: user?.department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)',
        setCorporateDepartment,
        verifyChronicle,
        addMemory,
        updateMemory,
        deleteMemory,
        toggleFavorite,
        addChapter,
        updateChapter,
        deleteChapter,
        addPerson,
        addReflection,
        addMonthlyReflection,
        updateProfile,
        login,
        logout
      }}
    >
      {children}
    </TapestryContext.Provider>
  );
}

export function useTapestry() {
  const context = useContext(TapestryContext);
  if (!context) {
    throw new Error('useTapestry must be used within a TapestryProvider');
  }
  return context;
}
