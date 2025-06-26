import * as admin from "firebase-admin";

const db = admin.firestore();

export async function handleMatchCompletion(matchData: any, matchId: string) {
  const players = matchData.players;
  if (players.length !== 2) return;

  const [p1, p2] = players;

  const winner = determineWinner(p1, p2);

  if (!winner) {
    console.log("It's a draw.");
    return;
  }

  const winningAmount = matchData.entryFee * 2;
  const winnerRef = db.collection("users").doc(winner.uid);

  await db.runTransaction(async (t) => {
    const doc = await t.get(winnerRef);
    const currentBalance = doc.data()?.walletWinning || 0;
    t.update(winnerRef, {
      walletWinning: currentBalance + winningAmount
    });

    for (const player of players) {
      const userRef = db.collection("users").doc(player.uid);
      const historyRef = userRef.collection("matchHistory").doc(matchId);
      t.set(historyRef, {
        ...matchData,
        result: winner.uid === player.uid ? "Win" : "Lose",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

  console.log(`Winner updated: ${winner.uid}`);
}

function determineWinner(p1: any, p2: any): any | null {
  if (p1.correct > p2.correct) return p1;
  if (p2.correct > p1.correct) return p2;

  if (p1.avgTime < p2.avgTime) return p1;
  if (p2.avgTime < p1.avgTime) return p2;

  return null; // draw
}