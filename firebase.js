import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB1EvPw1VHgUXKryuNR3rU_vcepvAUobiI',
  authDomain: 'ai-logo-generator-5f7bc.firebaseapp.com',
  projectId: 'ai-logo-generator-5f7bc',
  storageBucket: 'ai-logo-generator-5f7bc.firebasestorage.app',
  messagingSenderId: '344938742423',
  appId: '1:344938742423:web:5b80a8a1021a9e6c469fd2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { db };
