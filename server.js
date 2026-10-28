const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Keep track of the latest logs globally
let testStatus = "Idle";
let testLogs = "No active session run yet.\n";

app.post('/run-test', (req, res) => {
    const selectedJourney = req.body.journey;
    console.log(`\n[TRIGGER] Received request for journey choice: ${selectedJourney}`);

    if (testStatus === "Running") {
        return res.status(400).json({ error: "A test session is already executing. Please wait." });
    }

    testStatus = "Running";
    testLogs = `[SYSTEM]: Launching automated browser session for ${selectedJourney === 'journeyB' ? 'ApplicationUpload' : 'DebtPool'}...\n`;

    // 1. SEND INSTANT RESPONSE: Prevents the 2-minute browser network timeout completely!
    res.json({ message: 'Started Successfully' });

    const testPath = 'src/tests/playwright/losServicePlaywrite/losflow2.spec.js';
    const command = `npx playwright test ${testPath} --workers=1`;

    // 2. RUN PLAYWRIGHT IN THE BACKGROUND Safely
    const child = exec(command, {
        env: { ...process.env, CHOSEN_JOURNEY: selectedJourney }
    });

    // Stream logs as they happen in real-time
    child.stdout.on('data', (data) => {
        testLogs += data.toString();
        console.log(data.toString().trim());
    });

    child.stderr.on('data', (data) => {
        testLogs += `[ERROR]: ${data.toString()}`;
        console.error(data.toString().trim());
    });

    child.on('close', (code) => {
        if (code === 0) {
            testStatus = "Passed";
            testLogs += "\n🎉 [SYSTEM]: All automation steps completed successfully!\n";
        } else {
            testStatus = "Failed";
            testLogs += `\n❌ [SYSTEM]: Playwright Execution Failed with exit code ${code}\n`;
        }
        console.log(`[SYSTEM]: Job Finished with code ${code}`);
    });
});

// Endpoint for the HTML page to check for updates every second
app.get('/test-progress', (req, res) => {
    res.json({ status: testStatus, logs: testLogs });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Backend router server link live. Listening at http://127.0.0.1:3000`);
});
