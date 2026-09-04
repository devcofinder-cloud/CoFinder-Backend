const { initializeApp, getApps, cert } = require("firebase-admin/app");

const serviceAccount = require("../../firebase-cred.json");

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

module.exports = firebaseApp;