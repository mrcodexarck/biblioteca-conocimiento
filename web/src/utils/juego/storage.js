import { db } from '@site/src/firebase';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  increment,
} from 'firebase/firestore';

const COLLECTION = 'gameProgress';

/* =========================================================
   PROGRESO DEL CASO (por usuario)
   ========================================================= */
export async function saveProgress(userId, progress) {
  if (!userId) return;
  try {
    const ref = doc(db, 'users', userId, COLLECTION, progress.caseId);
    await setDoc(ref, { ...progress, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Error guardando progreso:', err);
  }
}

export async function getProgress(userId, caseId) {
  if (!userId || !caseId) return null;
  try {
    const ref = doc(db, 'users', userId, COLLECTION, caseId);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error('Error leyendo progreso:', err);
    return null;
  }
}

export async function clearProgress(userId, caseId) {
  if (!userId || !caseId) return;
  try {
    await deleteDoc(doc(db, 'users', userId, COLLECTION, caseId));
  } catch (err) {
    console.error('Error borrando progreso:', err);
  }
}

/* =========================================================
   CÁLCULO DE PUNTOS POR VELOCIDAD
   ========================================================= */
export function calculatePoints(timeUsedSeconds, difficulty = 1) {
  let base = 100;
  if (timeUsedSeconds < 3 * 60) base = 500;
  else if (timeUsedSeconds < 6 * 60) base = 350;
  else if (timeUsedSeconds < 10 * 60) base = 200;
  else base = 100;

  // Multiplicador por dificultad (1 -> 1.0, 2 -> 1.2, ... 5 -> 1.8)
  const multiplier = 1 + (difficulty - 1) * 0.2;
  return Math.round(base * multiplier);
}

/* =========================================================
   REGISTRAR VICTORIA (userStats + leaderboard)
   ========================================================= */
export async function registerCaseWin(userId, userName, caseId, caseTitle, timeUsed, difficulty) {
  if (!userId) return null;
  try {
    const points = calculatePoints(timeUsed, difficulty);

    /* ---------- 1. Stats del usuario ---------- */
    const userRef = doc(db, 'users', userId, 'gameStats', 'main');
    const userSnap = await getDoc(userRef);

    let current = userSnap.exists()
      ? userSnap.data()
      : { xp: 0, completedCases: [], bestTimes: {}, casesSolved: 0 };

    const completedCases = current.completedCases || [];
    const bestTimes = current.bestTimes || {};
    const isFirstTime = !completedCases.includes(caseId);

    // Puntos: solo se suman la primera vez. Las siguientes solo actualizan récord.
    const pointsEarned = isFirstTime ? points : 0;
    const newXP = (current.xp || 0) + pointsEarned;

    if (!completedCases.includes(caseId)) completedCases.push(caseId);

    const prevBest = bestTimes[caseId];
    if (!prevBest || timeUsed < prevBest) bestTimes[caseId] = timeUsed;

    await setDoc(
      userRef,
      {
        xp: newXP,
        completedCases,
        bestTimes,
        casesSolved: completedCases.length,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    /* ---------- 2. Leaderboard (documento público) ---------- */
    const lbRef = doc(db, 'leaderboard', userId);
    await setDoc(
      lbRef,
      {
        userId,
        displayName: userName || 'Detective Anónimo',
        xp: increment(pointsEarned),
        casesSolved: completedCases.length,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { points, pointsEarned, isFirstTime };
  } catch (err) {
    console.error('Error registrando victoria:', err);
    return null;
  }
}

/* =========================================================
   LEER STATS DEL JUGADOR
   ========================================================= */
export async function getPlayerStats(userId) {
  if (!userId) return null;
  try {
    const ref = doc(db, 'users', userId, 'gameStats', 'main');
    const snap = await getDoc(ref);
    return snap.exists()
      ? snap.data()
      : { xp: 0, completedCases: [], bestTimes: {}, casesSolved: 0 };
  } catch (err) {
    console.error('Error leyendo stats:', err);
    return null;
  }
}

/* =========================================================
   LEER LEADERBOARD (top N usuarios)
   ========================================================= */
export async function getLeaderboard(max = 20) {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('xp', 'desc'),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
  } catch (err) {
    console.error('Error leyendo leaderboard:', err);
    return [];
  }
}
/* =========================================================
   XP POR CASO (para mostrar en el selector)
   ========================================================= */
const CASE_XP = {
  'case-001': 500,
  'case-002': 700,
  'case-003': 900,
  'case-004': 600,
};

export function getCaseXP(caseId) {
  return CASE_XP[caseId] || 500;
}