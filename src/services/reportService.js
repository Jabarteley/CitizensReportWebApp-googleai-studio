import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { analyzeReport } from './gemini';
import { uploadToCloudinary } from './cloudinaryService';

const REPORTS_COLLECTION = 'reports';
const USERS_COLLECTION = 'users';

export async function submitReport(reportData, userId = 'anonymous') {
  try {
    let mediaUrl = null;
    if (reportData.mediaFile) {
      try {
        mediaUrl = await uploadMedia(reportData.mediaFile, userId);
      } catch (uploadError) {
        console.warn('Media upload failed. Report will submit without media.', uploadError.message);
      }
    }

    const reportDoc = {
      userId,
      type: reportData.type,
      description: reportData.description,
      location: reportData.location,
      mediaUrl,
      urgency: reportData.urgency,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isFlagged: false,
      flags: 0,
      aiAnalysis: null,
    };

    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), reportDoc);
    analyzeReportAsync(docRef.id, reportDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

async function analyzeReportAsync(reportId, reportData) {
  try {
    const analysis = await analyzeReport(reportData);
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await updateDoc(reportRef, { aiAnalysis: analysis, analyzedAt: serverTimestamp() });
  } catch (error) {
    // AI failure is non-critical — report still exists without analysis
    console.warn('AI analysis skipped:', error.message);
  }
}

export async function uploadMedia(file, userId) {
  return await uploadToCloudinary(file, `reports/${userId}`);
}

export async function getReports(filters = {}) {
  try {
    console.log('getReports called with filters:', filters);
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'), limit(500));
    const querySnapshot = await getDocs(q);
    console.log('Raw querySnapshot size:', querySnapshot.size);
    let reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Reports before filtering:', reports.length);

    if (filters.status && filters.status !== 'all') reports = reports.filter(r => r.status === filters.status);
    if (filters.urgency && filters.urgency !== 'all') reports = reports.filter(r => r.urgency === filters.urgency);
    if (filters.type && filters.type !== 'all') reports = reports.filter(r => r.type === filters.type);
    console.log('Reports after filtering:', reports.length);
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Fallback: try without ordering (handles case where createdAt is missing)
    try {
      const q = query(collection(db, REPORTS_COLLECTION), limit(500));
      const querySnapshot = await getDocs(q);
      let reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reports.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
        return bTime - aTime;
      });
      if (filters.status) reports = reports.filter(r => r.status === filters.status);
      if (filters.urgency) reports = reports.filter(r => r.urgency === filters.urgency);
      if (filters.type) reports = reports.filter(r => r.type === filters.type);
      return reports;
    } catch (e2) {
      console.error('Fallback query also failed:', e2);
      return [];
    }
  }
}

export async function getReportsForMap() {
  try {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'), limit(200));
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reports.filter(r => !r.isFlagged);
  } catch (error) {
    console.error('Error fetching reports for map:', error);
    return [];
  }
}

export async function getReportById(reportId) {
  try {
    const docSnap = await getDoc(doc(db, REPORTS_COLLECTION, reportId));
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

export async function updateReportStatus(reportId, status) {
  try {
    await updateDoc(doc(db, REPORTS_COLLECTION, reportId), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

export async function flagReport(reportId) {
  try {
    const snap = await getDoc(doc(db, REPORTS_COLLECTION, reportId));
    const data = snap.data();
    await updateDoc(doc(db, REPORTS_COLLECTION, reportId), {
      flags: (data?.flags || 0) + 1,
      isFlagged: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error flagging report:', error);
  }
}

export async function deleteReport(reportId) {
  try {
    await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

export async function saveUserProfile(userData) {
  try {
    const userRef = doc(db, 'users', userData.uid);
    await updateDoc(userRef, {
      ...userData,
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    try {
      await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    } catch (createError) {
      // Non-critical — user is authenticated even if profile save fails
      console.warn('User profile not saved (check Firestore rules):', createError.message);
    }
  }
}
