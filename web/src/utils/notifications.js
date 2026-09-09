import { collection, doc, addDoc, updateDoc, query, where, orderBy, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Crea una notificación para un usuario
 */
export async function createNotification(userId, suggestionId, suggestionTitle, type, message) {
  if (!userId) return;
  try {
    const ref = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      userId,
      suggestionId,
      suggestionTitle,
      type,
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error('Error creando notificación:', error);
    throw error;
  }
}

/**
 * Obtiene todas las notificaciones no leídas de un usuario
 */
export async function getUnreadNotifications(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error obteniendo notificaciones no leídas:', error);
    return [];
  }
}

/**
 * Marca una notificación como leída
 */
export async function markAsRead(notificationId) {
  if (!notificationId) return;
  try {
    const ref = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(ref, { read: true });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
  }
}

/**
 * Marca todas las notificaciones de un usuario como leídas
 */
export async function markAllAsRead(userId) {
  if (!userId) return;
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
  }
}

/**
 * Escucha en tiempo real las notificaciones no leídas de un usuario
 */
export function listenNotifications(userId, callback) {
  if (!userId) return () => {};
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(notifications);
  }, (error) => {
    console.error('Error escuchando notificaciones:', error);
  });
  return unsubscribe;
}