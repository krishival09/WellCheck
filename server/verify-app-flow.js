const admin = require('firebase-admin');
const { cert } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore('wellcheck');

async function verify() {
  console.log("--- Starting Simulation of Elder & Volunteer App Flow ---");

  // Reset collections for clean test
  const elderId = "elder-verify";
  const volunteerId = "volunteer-verify";
  const pin = "7777";

  console.log("\n1. SIMULATING ELDER SIDE:");
  // A. Elder Generates PIN & Pairing Doc
  await db.collection('pairs').doc(pin).set({
    elderId: elderId,
    volunteerId: null,
    createdAt: FieldValue.serverTimestamp(),
    checkinIntervalMin: 15,
    escalationThresholdMin: 20
  });
  console.log(`[PASS] Elder generated PIN ${pin} and created 'pairs' document.`);

  // B. Elder triggers SOS
  const sosDoc = await db.collection('alerts').add({
    elderId: elderId,
    type: "sos",
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
    acknowledgedAt: null
  });
  console.log(`[PASS] Elder clicked SOS and created alert: ${sosDoc.id}`);

  // C. Elder Prompts check-in
  const checkinDoc = await db.collection('checkins').add({
    elderId: elderId,
    promptedAt: FieldValue.serverTimestamp(),
    responded: false,
    respondedAt: null
  });
  console.log(`[PASS] Elder app prompted check-in and created checkins document: ${checkinDoc.id}`);


  console.log("\n2. SIMULATING VOLUNTEER SIDE:");
  // A. Volunteer pairs using the PIN
  const pairSnap = await db.collection('pairs').doc(pin).get();
  if (pairSnap.exists && pairSnap.data().volunteerId === null) {
    await db.collection('pairs').doc(pin).update({ volunteerId: volunteerId });
    console.log(`[PASS] Volunteer successfully paired using PIN ${pin}.`);
  } else {
    throw new Error("Pairing failed");
  }

  // B. Volunteer queries active alerts for the paired Elder
  const activeAlerts = await db.collection('alerts')
    .where('elderId', '==', elderId)
    .where('status', 'in', ['active', 'acknowledged'])
    .get();
  
  console.log(`[PASS] Volunteer found ${activeAlerts.size} active alerts for ${elderId}.`);
  if (activeAlerts.size > 0) {
    // C. Volunteer acknowledges the alert
    const firstAlertId = activeAlerts.docs[0].id;
    await db.collection('alerts').doc(firstAlertId).update({
      status: 'acknowledged',
      acknowledgedAt: FieldValue.serverTimestamp()
    });
    console.log(`[PASS] Volunteer acknowledged alert ${firstAlertId}.`);
  }


  console.log("\n3. SIMULATING BACKEND ESCALATION CRON:");
  // Set the check-in time to be past the threshold (e.g. 25 mins ago)
  const pastTime = new Date(Date.now() - 25 * 60 * 1000);
  await db.collection('checkins').doc(checkinDoc.id).update({
    promptedAt: Timestamp.fromDate(pastTime)
  });
  console.log("[PASS] Simulated elapsed time (check-in marked 25m ago, threshold 20m).");

  // Run the escalation script directly
  const { execSync } = require('child_process');
  console.log("Running checkin-escalation.js...");
  const output = execSync('node ./checkin-escalation.js', { encoding: 'utf-8' });
  console.log(output);

  // Check if a checkin_missed alert was triggered
  const checkinMissedAlerts = await db.collection('alerts')
    .where('elderId', '==', elderId)
    .where('type', '==', 'checkin_missed')
    .get();

  if (checkinMissedAlerts.size > 0) {
    console.log(`[PASS] Cron script successfully detected missed check-in and created alert: ${checkinMissedAlerts.docs[0].id}`);
  } else {
    throw new Error("Cron escalation script failed to trigger checkin_missed alert");
  }

  // Clean up verification data
  console.log("\n4. CLEANING UP...");
  await db.collection('pairs').doc(pin).delete();
  await db.collection('alerts').doc(sosDoc.id).delete();
  await db.collection('checkins').doc(checkinDoc.id).delete();
  for (const doc of checkinMissedAlerts.docs) {
    await db.collection('alerts').doc(doc.id).delete();
  }
  console.log("[PASS] Test documents cleaned up successfully.");

  console.log("\n--- SIMULATION COMPLETED: ALL PASS ---");
}

verify().catch(err => {
  console.error("--- SIMULATION FAILED ---");
  console.error(err);
  process.exit(1);
});
