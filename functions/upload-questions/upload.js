const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const questions = JSON.parse(fs.readFileSync("questions.json", "utf8"));

async function uploadQuestions() {
  const batch = db.batch();

  questions.forEach((q) => {
    const docRef = db.collection("questions").doc(); // auto ID
    batch.set(docRef, q);
  });

  await batch.commit();
  console.log("? All questions uploaded successfully.");
}

uploadQuestions().catch(console.error);
