// src/firebase.ts
import admin from "firebase-admin";
import fs from "fs";

// Load your Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync("./vac-tracker-app-eac07-firebase-adminsdk-fbsvc-d0d5135cbb.json", "utf8")
);

// Initialize Firebase if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
