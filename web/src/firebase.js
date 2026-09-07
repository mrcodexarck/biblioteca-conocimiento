import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAc5ReoLLTETiGi6iYgYbziH0m11KWFG34',
  authDomain: 'soporte-asistido.firebaseapp.com',
  projectId: 'soporte-asistido',
  storageBucket: 'soporte-asistido.firebasestorage.app',
  messagingSenderId: '165366260226',
  appId: '1:165366260226:web:a6e25ee3078a5f0a6a7d1b',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

auth.languageCode = 'es';

/**
 * The Firebase Web config is a public client configuration.
 * Real security comes from Authentication settings and Firebase Security Rules.
 */
export async function configurePersistence(rememberSession) {
  await setPersistence(
    auth,
    rememberSession ? browserLocalPersistence : browserSessionPersistence,
  );
}

export { auth, db };