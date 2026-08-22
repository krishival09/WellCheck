const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration & Logging
// ============================================================================

const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'service-account.json');
const LOG_FILE = path.join(__dirname, 'escalation.log');
const DATABASE_ID = 'wellcheck'; // Using the specific database created

function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  console.log(entry.trim());
  fs.appendFileSync(LOG_FILE, entry);
}

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  log('ERROR: service-account.json not found. Place it in the server directory.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(DATABASE_ID);

// ============================================================================
// Escalation Logic (PRD §7)
// ============================================================================

async function runEscalation() {
  log('Starting check-in escalation run...');

  try {
    // 1. Get all pairings to find our thresholds and elder IDs
    const pairsSnapshot = await db.collection('pairs').get();
    
    if (pairsSnapshot.empty) {
      log('No active pairings found.');
      return;
    }

    for (const pairDoc of pairsSnapshot.docs) {
      const { elderId, escalationThresholdMin, volunteerId } = pairDoc.data();
      
      if (!volunteerId) {
        log(`Skipping elder ${elderId}: No volunteer paired yet.`);
        continue;
      }

      // 2. Find the most recent check-in record for this elder
      const latestCheckinQuery = await db.collection('checkins')
        .where('elderId', '==', elderId)
        .orderBy('promptedAt', 'desc')
        .limit(1)
        .get();

      if (latestCheckinQuery.empty) {
        log(`No check-in history for elder ${elderId}. Skipping.`);
        continue;
      }

      const checkin = latestCheckinQuery.docs[0].data();
      const lastActionTime = (checkin.responded && checkin.respondedAt) 
        ? checkin.respondedAt.toDate() 
        : checkin.promptedAt.toDate();

      const diffMs = Date.now() - lastActionTime.getTime();
      const diffMin = diffMs / (1000 * 60);

      log(`Elder ${elderId}: Last activity ${diffMin.toFixed(1)}m ago (Threshold: ${escalationThresholdMin}m).`);

      if (diffMin >= escalationThresholdMin) {
        // 3. Check if an unresolved 'checkin_missed' alert already exists
        const existingAlertQuery = await db.collection('alerts')
          .where('elderId', '==', elderId)
          .where('type', '==', 'checkin_missed')
          .where('status', 'in', ['active', 'acknowledged'])
          .limit(1)
          .get();

        if (existingAlertQuery.empty) {
          // 4. Trigger the alert
          log(`TRIGGERING ALERT: Elder ${elderId} missed check-in!`);
          await db.collection('alerts').add({
            elderId,
            type: 'checkin_missed',
            status: 'active',
            createdAt: FieldValue.serverTimestamp(),
            acknowledgedAt: null
          });
        } else {
          log(`Alert already active for elder ${elderId}.`);
        }
      }
    }

    log('Escalation run complete.');
  } catch (error) {
    log(`FATAL ERROR in escalation run: ${error.message}`);
  }
}

runEscalation();
