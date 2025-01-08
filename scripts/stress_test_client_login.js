import http from 'k6/http';
import { check } from 'k6';

// Test configuration
export const options = {
    stages: [
        // Previous stages (ramp-up to 10, maintain for 1 minute, ramp-down)
        { duration: '1m', target: 10 },  // Ramp-up to 10 users over 1 minute
        { duration: '1m', target: 10 },  // Maintain 10 users for 1 minute
        { duration: '1m', target: 0 },   // Ramp-down to 0 users over 1 minute

        // New stages for increased load
        { duration: '2m', target: 50 },  // Ramp-up to 50 users over 2 minutes
        { duration: '5m', target: 50 },  // Maintain 50 users for 5 minutes
        { duration: '2m', target: 100 }, // Ramp-up to 100 users over 2 minutes
        { duration: '10m', target: 100 }, // Maintain 100 users for 10 minutes
        { duration: '1m', target: 150 }, // Ramp-up to 150 users over 1 minute
        { duration: '5m', target: 150 }, // Maintain 150 users for 5 minutes
        { duration: '1m', target: 0 },   // Ramp-down to 0 users over 1 minute
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
        http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
    },
};

export default function () {
    const url = '<SERVER>/client_login';

    // Generate unique user data
    const payload = {
        userName: '<USERNAME>',
        password: '<PASSWORD>',
        email: "<EMAIL>"
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
