const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ✅ Function: Add Winnings to User Wallet
exports.addWinning = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
  }

  const uid = context.auth.uid;
  const amount = parseFloat(data.amount);

  if (isNaN(amount) || amount <= 0 || amount > 100000) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid amount.');
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      winningWallet: admin.firestore.FieldValue.increment(amount)
    });

    return { success: true, added: amount };
  } catch (error) {
    console.error("Add Winning Error:", error);
    throw new functions.https.HttpsError('internal', 'Failed to update wallet.');
  }
});

// ✅ Function: Recharge Wallet with Fee Logic
exports.rechargeWallet = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  const uid = context.auth.uid;
  const amount = parseFloat(data.amount);

  if (isNaN(amount) || amount < 10 || amount > 10000) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid recharge amount.');
  }

  const fee = amount <= 100 ? 2 : 0;
  const netAmount = amount - fee;

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      rechargeWallet: admin.firestore.FieldValue.increment(netAmount)
    });

    const adminRef = db.collection("admin").doc("fees");
    await adminRef.set({
      totalRechargeFee: admin.firestore.FieldValue.increment(fee)
    }, { merge: true });

    return { success: true, credited: netAmount, fee };
  } catch (error) {
    console.error("Recharge Wallet Error:", error);
    throw new functions.https.HttpsError('internal', 'Recharge failed.');
  }
});
