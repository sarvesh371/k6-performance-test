import http from 'k6/http';
import { check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Test configuration
export const options = {
  scenarios: {
    constant_rate: {
      executor: 'constant-arrival-rate',
      rate: 30, // 30 requests per second
      timeUnit: '1s', // Define the time unit
      duration: '15m', // Test duration: 15 minute
      preAllocatedVUs: 10, // Number of virtual users to allocate
      maxVUs: 20, // Maximum virtual users allowed
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
    http_req_failed: ['rate<0.01'],  // Less than 1% of requests should fail
  },
};

export default function () {
    const url = '<SERVER>/client_registeration';

    // Generate unique user data
    const timestamp = Date.now();
    const randomSuffix = randomString(5);
    const payload = {
        fullName: `Test User ${randomSuffix}`,
        userName: `user_${randomSuffix}_${timestamp}`,
        email: `user_${randomSuffix}_${timestamp}@example.com`,
        password: `Passw0rd!${randomSuffix}`,
        phone: '1234567890',
    };

    // Convert payload to form data
    const formData = Object.keys(payload)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
        .join('&');

    // Set request headers
    const params = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    // Send the registration request
    const res = http.post(url, formData, params);

    // Validate the response
    check(res, {
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
