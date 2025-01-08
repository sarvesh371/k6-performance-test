import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Test configuration
export const options = {
    stages: [
        { duration: '2m', target: 50 },   // Ramp-up to 50 users over 2 minutes
        { duration: '5m', target: 100 }, // Maintain 100 users for 5 minutes
        { duration: '2m', target: 200 }, // Ramp-up to 200 users over 2 minutes
        { duration: '10m', target: 200 },// Maintain 200 users for 10 minutes
        { duration: '2m', target: 50 },  // Ramp-down to 50 users over 2 minutes
        { duration: '2m', target: 0 },   // Ramp-down to 0 users over 2 minutes
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
        http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
    },
};

// Generate unique user data for each iteration
function generateUserData() {
    const timestamp = Date.now();
    const randomSuffix = randomString(5);
    return {
        fullName: `Test User ${randomSuffix}`,
        userName: `user_${randomSuffix}_${timestamp}`,
        email: `user_${randomSuffix}_${timestamp}@example.com`,
        password: `Passw0rd!${randomSuffix}`,
        phone: '1234567890',
    };
}

export default function () {
    const registerUrl = '<SERVER>/client_registeration';
    const loginUrl = '<SERVER>/client_login';

    // Generate unique user data
    const userData = generateUserData();

    const registerPayload = Object.keys(userData)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(userData[key])}`)
    .join('&');

    const registerParams = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    const registerRes = http.post(registerUrl, registerPayload, registerParams);

    // Validate the response
    check(registerRes, {
        'Status is 200': (r) => r.status === 200,
        'Registration success message': (r) => {
            try {
                const json = r.json();
                return json.msg === 'User Registered';
            } catch (e) {
                return false;
            }
        },
    });

    // Wait between requests to simulate user behavior
    sleep(1);

    // Step 2: Log in with the registered user
    const loginPayload = `userName=${encodeURIComponent(userData.userName)}&password=${encodeURIComponent(userData.password)}&email=${encodeURIComponent(userData.email)}`;
    const loginParams = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    // Send the registration request
    const loginRes = http.post(loginUrl, loginPayload, loginParams);

    // Validate the response
    check(loginRes, {
        'Status is 200': (r) => r.status === 200,
        'Registration success message': (r) => {
            try {
                const json = r.json();
                return json.msg === 'User Registered';
            } catch (e) {
                return false;
            }
        },
    });
}
