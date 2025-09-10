import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 500 }, // Ramp up to 500 users
    { duration: '5m', target: 500 }, // Stay at 500 users
    { duration: '2m', target: 1000 }, // Ramp up to 1000 users
    { duration: '5m', target: 1000 }, // Stay at 1000 users
    { duration: '2m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    errors: ['rate<0.1'], // Error rate should be below 10%
  },
};

const BASE_URL = 'https://moklik-46048.web.app';

export default function () {
  // Test homepage load
  const homeRes = http.get(BASE_URL);
  check(homeRes, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads within 2s': (r) => r.timings.duration < 2000,
  });

  // Test authentication
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, {
    email: 'test@example.com',
    password: 'password123',
  });
  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'receives auth token': (r) => r.json('token') !== undefined,
  });

  // Test chat functionality
  const message = {
    content: 'What is the derivative of x^2?',
    timestamp: Date.now(),
  };

  const chatRes = http.post(`${BASE_URL}/api/chat`, message, {
    headers: { Authorization: `Bearer ${loginRes.json('token')}` },
  });
  check(chatRes, {
    'chat response received': (r) => r.status === 200,
    'response contains math': (r) => r.json('content').includes('2x'),
  });

  // Test document upload
  const docRes = http.post(
    `${BASE_URL}/api/documents`,
    { document: 'test-content' },
    {
      headers: { Authorization: `Bearer ${loginRes.json('token')}` },
    }
  );
  check(docRes, {
    'document upload successful': (r) => r.status === 200,
  });

  // Record errors
  errorRate.add(homeRes.status !== 200);
  errorRate.add(loginRes.status !== 200);
  errorRate.add(chatRes.status !== 200);
  errorRate.add(docRes.status !== 200);

  sleep(1);
}