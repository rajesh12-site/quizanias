import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { handleMatchCompletion } from "./utils/matchHandler";

admin.initializeApp();

export const onMatchComplete = functions.firestore
  .document("matches/{matchId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const matchId = context.params.matchId;

    if (!before.completed && after.completed) {
      await handleMatchCompletion(after, matchId);
    }
  });