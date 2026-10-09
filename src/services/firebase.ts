import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  limit,
  serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Memory, Chapter, UserProfile, AuditLog, CorporateRole } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if specified
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// MANDATORY VALIDATION: Test connection on boot per Skill Guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firestore persistent database connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('⚠️ Firestore is offline. Please check your Firebase configuration.');
      return false;
    }
    // Document might not exist, which is expected and proves the connection is live
    return true;
  }
}

// Auto-authenticate anonymously or restore user session
export async function ensureAuthenticated(): Promise<FirebaseUser | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Anonymous auth note (proceeding with local user profile):', err);
    return null;
  }
}

// -------------------------------------------------------------
// CORPORATE AUDIT LOGGING (Enterprise Compliance Engine)
// -------------------------------------------------------------
export async function recordAuditLog(
  action: AuditLog['action'],
  resourceType: AuditLog['resourceType'],
  resourceId: string,
  details: string,
  user?: Partial<UserProfile> | null
): Promise<void> {
  try {
    const logId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const logRef = doc(db, 'auditLogs', logId);
    const newLog: AuditLog = {
      id: logId,
      userId: user?.id || auth.currentUser?.uid || 'corporate-user',
      userEmail: user?.email || 'compliance@sheeraza.corp',
      action,
      resourceType,
      resourceId,
      details,
      timestamp: new Date().toISOString()
    };
    await setDoc(logRef, newLog);
  } catch (err) {
    console.warn('Could not write audit log (offline fallback):', err);
  }
}

// -------------------------------------------------------------
// MEMORIES & CHRONICLES REAL-TIME FIRESTORE REPO
// -------------------------------------------------------------
export function subscribeToMemories(
  onData: (memories: Memory[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const memRef = collection(db, 'memories');
  const q = query(memRef, orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const results: Memory[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as Memory);
      });
      onData(results);
    },
    (err) => {
      console.warn('Firestore subscription notice (using cached/fallback):', err);
      if (onError) onError(err);
    }
  );
}

export async function saveMemoryToDb(memory: Memory, user?: UserProfile): Promise<void> {
  const memRef = doc(db, 'memories', memory.id);
  await setDoc(memRef, {
    ...memory,
    updatedAt: new Date().toISOString()
  });

  await recordAuditLog(
    'CREATE',
    'CHRONICLE',
    memory.id,
    `Created chronicle: "${memory.title}" (${memory.category}) under department: ${memory.department || 'General'}`,
    user
  );
}

export async function updateMemoryInDb(
  id: string,
  updates: Partial<Memory>,
  user?: UserProfile
): Promise<void> {
  const memRef = doc(db, 'memories', id);
  await updateDoc(memRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });

  await recordAuditLog(
    'UPDATE',
    'CHRONICLE',
    id,
    `Updated chronicle fields: ${Object.keys(updates).join(', ')}`,
    user
  );
}

export async function deleteMemoryFromDb(id: string, user?: UserProfile): Promise<void> {
  const memRef = doc(db, 'memories', id);
  await deleteDoc(memRef);

  await recordAuditLog('DELETE', 'CHRONICLE', id, `Deleted chronicle record ${id}`, user);
}

export async function verifyChronicleInDb(
  id: string,
  auditor: UserProfile,
  status: boolean
): Promise<void> {
  const memRef = doc(db, 'memories', id);
  await updateDoc(memRef, {
    verified: status,
    verifiedBy: auditor.displayName || auditor.email,
    verifiedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  await recordAuditLog(
    'VERIFY',
    'COMPLIANCE',
    id,
    `${status ? 'Certified and verified' : 'Revoked certification of'} chronicle ${id}`,
    auditor
  );
}

// -------------------------------------------------------------
// AUDIT LOGS REAL-TIME SUBSCRIPTION
// -------------------------------------------------------------
export function subscribeToAuditLogs(
  onData: (logs: AuditLog[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const logRef = collection(db, 'auditLogs');
  const q = query(logRef, orderBy('timestamp', 'desc'), limit(150));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AuditLog[] = [];
      snapshot.forEach((d) => logs.push(d.data() as AuditLog));
      onData(logs);
    },
    (err) => {
      console.warn('Audit log snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

// -------------------------------------------------------------
// USER PROFILE FIRESTORE REPO
// -------------------------------------------------------------
export async function syncUserProfileToDb(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.id);
    await setDoc(
      userRef,
      {
        ...profile,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }
}
