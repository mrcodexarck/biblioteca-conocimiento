import { db } from '@site/src/firebase';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'gameProgress';

/* =========================================================
   Guardar progreso del usuario en Firestore
   ========================================================= */
export async function saveProgress(userId, progress) {
  if (!userId) return;
  try {
    const ref = doc(db, 'users', userId, COLLECTION, progress.caseId);
    await setDoc(
      ref,
      {
        ...progress,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error guardando progreso:', err);
  }
}

/* =========================================================
   Leer progreso del usuario para un caso
   ========================================================= */
export async function getProgress(userId, caseId) {
  if (!userId || !caseId) return null;
  try {
    const ref = doc(db, 'users', userId, COLLECTION, caseId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.error('Error leyendo progreso:', err);
    return null;
  }
}

/* =========================================================
   Borrar progreso (al ganar o reiniciar)
   ========================================================= */
export async function clearProgress(userId, caseId) {
  if (!userId || !caseId) return;
  try {
    const ref = doc(db, 'users', userId, COLLECTION, caseId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Error borrando progreso:', err);
  }
}