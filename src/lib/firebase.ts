import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, doc, getDoc, setDoc, serverTimestamp, getDocFromServer, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings for better connectivity in restricted environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Attempt to enable persistence silently
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Firestore persistence failed: failed-precondition');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn('Firestore persistence failed: unimplemented');
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Creates or updates a user document in Firestore on login.
 */
export const syncUserProfile = async (user: any) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user profile if it doesn't exist
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        settings: {
          theme: 'emerald',
          fontFamily: 'Inter',
          fontSize: 18,
          translation: 'en.sahih',
          reciter: 'ar.alafasy'
        },
        stats: {
          streakCount: 0,
          totalAyahsRead: 0,
          lastReadDate: serverTimestamp()
        },
        createdAt: serverTimestamp()
      });
      console.log('New user profile created in Firestore');
    }
  } catch (error) {
    console.error('Error syncing user profile:', error);
    // Don't throw here to avoid blocking sign-in if Firestore is down
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync profile after successful auth
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    
    if (error.code === 'auth/popup-blocked') {
      alert('Sign-in popup was blocked by your browser. Please allow popups for this site or open in a new tab.');
    } else if (error.code === 'auth/unauthorized-domain') {
      alert('This domain is not authorized for Google Sign-in. Please ensure it is added to the Authorized Domains in Firebase Console.');
    }
    
    throw error;
  }
};

export const logout = () => signOut(auth);

// Test connection as required by integration instructions, but handle errors gracefully
async function testConnection() {
  try {
    // We use a small timeout or just catch the potential "unavailable" error
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.code === 'unavailable' || (error instanceof Error && error.message.includes('the client is offline'))) {
      console.warn("Firestore backend unreachable (offline mode enabled).");
    } else {
      console.error("Firestore connection error:", error);
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
