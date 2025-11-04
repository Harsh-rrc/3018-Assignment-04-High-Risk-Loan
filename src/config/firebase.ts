import admin from "firebase-admin";
import path from "path";

// Load your Firebase service account key JSON
const serviceAccountPath = path.join(__dirname, "../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export const auth = admin.auth();