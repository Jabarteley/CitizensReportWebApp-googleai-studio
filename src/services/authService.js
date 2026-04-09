import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously as firebaseSignInAnonymously,
  linkWithCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { saveUserProfile } from './reportService';

/**
 * Sign in with Google
 * @returns {Promise<Object>} User object
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save/update user profile
    await saveUserProfile({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      provider: 'google',
      role: 'citizen' // Default role
    });
    
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
}

/**
 * Create new account with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {string} displayName 
 * @returns {Promise<Object>} User object
 */
export async function signUpWithEmail(email, password, displayName = 'Anonymous') {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Save user profile
    await saveUserProfile({
      uid: user.uid,
      displayName,
      email,
      provider: 'email',
      role: 'citizen'
    });
    
    return user;
  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
}

/**
 * Sign in anonymously (only if enabled in Firebase Console > Auth > Sign-in method)
 * @returns {Promise<Object>} User object
 */
export async function signInAnonymously() {
  try {
    const result = await firebaseSignInAnonymously(auth);
    const user = result.user;
    
    // Save anonymous user profile
    await saveUserProfile({
      uid: user.uid,
      displayName: 'Anonymous User',
      isAnonymous: true,
      provider: 'anonymous',
      role: 'citizen'
    });
    
    return user;
  } catch (error) {
    console.error('Anonymous sign-in error:', error);
    // Check if anonymous auth is enabled
    if (error.code === 'auth/admin-restricted-operation') {
      throw new Error('Anonymous sign-in is not enabled. Please enable it in Firebase Console > Authentication > Sign-in method, or use Google/Email sign-in instead.');
    }
    throw error;
  }
}

/**
 * Link anonymous account to permanent account
 * @param {Object} credential - Email or Google credential
 * @returns {Promise<Object>} User object
 */
export async function linkAnonymousAccount(credential) {
  try {
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Link account error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

/**
 * Get current user auth state
 * @returns {Promise<Object|null>} User object or null
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth };
