# AI Logo Generator (React Native + Firebase)

A mobile app that allows users to describe their dream logo, choose a style, and simulate an AI-generated design. This case study demonstrates a real-world product flow using Expo (React Native), Firebase Firestore, and Firebase Functions (Node.js).

---

## 🌟 Features

- Beautifully styled multi-step UI based on Figma mockup
- Prompt + style input screen with live form validation
- Status chip with loading animation and state transitions
- Output screen with generated mock image and prompt copy
- Firebase Firestore integration for saving prompt data
- Firebase Cloud Function (Node.js) for simulating asynchronous AI generation
- Real-time Firestore updates via `onSnapshot`

---

## ⚙️ Technologies Used

| Area          | Stack                                      |
|---------------|---------------------------------------------|
| Frontend      | React Native (Expo)                         |
| Backend       | Firebase Functions (Node.js / JavaScript)   |
| Database      | Firestore (Firebase)                        |
| Real-time     | Firestore `onSnapshot` listener             |
| Deployment    | Firebase CLI                                |

---

## ⚡ Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/gorkeygorkem/ai-logo-generator.git
cd ai-logo-generator
npm install
```

### 2. Firebase Setup
- Create a Firebase project
- Enable Firestore (test mode)
- Enable Firebase Functions (requires Blaze plan)
- Copy config to `firebase.js`

```js
// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = { ... }; // from Firebase Console
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3. Firebase Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

---

## 🛠️ Firebase Function (Node.js)
The Cloud Function runs when a new generation is created with `status: "processing"`.

```js
exports.processPrompt = onDocumentCreated("generations/{docId}", async (event) => {
  await delay(30-60s);
  await db.collection("generations").doc(docId).update({ status: "done" });
});
```

---

## 📲 Screens

### Input Screen
- Prompt field + "Surprise me" button
- Style selector (chips)
- Create button
- Status chip with live updates ("processing" → "done")

### Output Screen
- Mockup image
- Prompt + copy button
- Style tag

---

## 🚀 Developer Notes

- App uses modular Firebase SDK (`firebase@11.6.0`)
- `experimentalForceLongPolling` is used for compatibility with Expo
- Cloud Function uses latest `firebase-functions@6.x` modular API
- Firestore document changes are observed with `onSnapshot`

---

## 📄 License

MIT

---

## 🙌 Special Notes

This project was completed as part of a software engineering case study. The use of Firebase Cloud Functions instead of a frontend-only simulation showcases backend integration skills and real-time async processing.

