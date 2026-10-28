import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom metrics to track specific API sequence success
const sequenceSuccessRate = new Rate('sequence_success_rate');
const sequenceDuration = new Trend('sequence_duration');

// --- LOAD TEST CONFIGURATIONS ---
// You can define multiple stages here or pass them via environment variables
// To run for 100 VUs: k6 run -e LOAD_PROFILE=100 load-test.js
// To run for 1000 VUs: k6 run -e LOAD_PROFILE=1000 load-test.js

const loadProfile = __ENV.LOAD_PROFILE || '100';

const optionsConfig = {
    '100': {
        stages: [
            { duration: '1m', target: 50 },  // Ramp-up to 50 users loosely
            { duration: '3m', target: 100 }, // Peak at 100 users
            { duration: '1m', target: 0 },   // Ramp-down to 0 users
        ],
    },
    '1000': {
        stages: [
            { duration: '2m', target: 500 },  // Ramp-up to 500 users
            { duration: '5m', target: 1000 }, // Peak at 1000 users
            { duration: '2m', target: 0 },    // Ramp-down to 0 users
        ],
    }
};

export const options = {
    // Apply selected load profile or fallback to 100
    stages: optionsConfig[loadProfile].stages,
    
    // Thresholds define pass/fail criteria
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate must be < 1%
        sequence_success_rate: ['rate>0.95'], // 95% of full sequences must succeed
    },
};

// --- BASE CONFIGURATION ---
const BASE_URL = __ENV.BASE_URL || 'https://api.yourdomain.com/v1';
const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${__ENV.TOKEN}`, // Add authorization if needed
};

// --- DATA SCENARIOS (Data generation / Payload setup) ---
function generatePayloads(userId) {
    return {
        loginPayload: JSON.stringify({ username: `user_${userId}`, password: 'password123' }),
        createItemPayload: JSON.stringify({ name: `Item_${userId}`, description: 'Test Item' }),
        updateItemPayload: JSON.stringify({ status: 'completed' })
    };
}

// --- MAIN VIRTUAL USER LOGIC ---
export default function () {
    // A single iteration of a Virtual User represents the full flow/sequence
    let success = true;
    let sequenceStartTime = Date.now();
    let res;

    const payloads = generatePayloads(__VU);

    group('API Sequence Flow', function () {
        
        // --- 1. Authentication / Setup ---
        group('1. Login', function () {
            res = http.post(`${BASE_URL}/auth/login`, payloads.loginPayload, { headers: HEADERS });
            success = success && check(res, { 'status is 200': (r) => r.status === 200 });
            // Extract token if needed for subsequent requests
            // let token = res.json('token');
            // HEADERS['Authorization'] = `Bearer ${token}`;
        });
        sleep(1);

        // --- 2 to 19. Sequential Business Logic --- 
        // Here you construct your sequence. Below is a skeleton pattern for a sequence.
        
        group('2. Get User Profile', function() {
            res = http.get(`${BASE_URL}/users/profile`, { headers: HEADERS });
            success = success && check(res, { 'status is 200': (r) => r.status === 200 });
        });
        sleep(0.5);

        group('3. Fetch Dashboard Data', function() {
            res = http.get(`${BASE_URL}/dashboard/summary`, { headers: HEADERS });
            success = success && check(res, { 'status is 200': (r) => r.status === 200 });
        });
        sleep(1);

        group('4. Create Resource', function() {
            res = http.post(`${BASE_URL}/resources`, payloads.createItemPayload, { headers: HEADERS });
            success = success && check(res, { 'status is 201': (r) => r.status === 201 });
            // let resourceId = res.json('id'); // Pass data to next step
        });
        sleep(1);

        // ... Add API 5 through 18 here ...
        // Example placeholders to visualize maintaining sequence rules
        for (let i = 5; i <= 18; i++) {
            group(`${i}. Intermediate Step ${i}`, function() {
                res = http.get(`${BASE_URL}/items/step-${i}`, { headers: HEADERS });
                success = success && check(res, { 'status is 200': (r) => r.status === 200 });
            });
            sleep(0.5);
        }

        group('19. Update Resource', function() {
            res = http.put(`${BASE_URL}/resources/123`, payloads.updateItemPayload, { headers: HEADERS });
            success = success && check(res, { 'status is 200': (r) => r.status === 200 });
        });
        sleep(1);

        // --- 20. Cleanup / Teardown ---
        group('20. Logout context / Delete Resource', function() {
            res = http.del(`${BASE_URL}/resources/123`, null, { headers: HEADERS });
            success = success && check(res, { 'is deleted or finished': (r) => r.status === 200 || r.status === 204 });
        });
        sleep(1);
    });

    // Record custom metrics after the sequence finishes
    sequenceSuccessRate.add(success);
    sequenceDuration.add(Date.now() - sequenceStartTime);

    // Think time before starting a new iteration
    sleep(Math.random() * 3 + 2); // random sleep between 2 - 5 seconds
}
