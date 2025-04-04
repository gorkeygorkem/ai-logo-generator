/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
const { onDocumentCreated } = require('firebase-functions/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

exports.processPrompt = onDocumentCreated(
  'generations/{docId}',
  async (event) => {
    const docId = event.params.docId;
    const data = event.data.data();

    if (data.status !== 'processing') return;

    const delay = Math.floor(Math.random() * (60 - 30 + 1) + 30) * 1000;
    console.log(`⏳ Delaying generation for ${delay / 1000}s for ${docId}`);

    await new Promise((resolve) => setTimeout(resolve, delay));

    await db.collection('generations').doc(docId).update({
      status: 'done',
      finishedAt: FieldValue.serverTimestamp(),
    });

    console.log(`✅ Updated ${docId} to done`);
  },
);
