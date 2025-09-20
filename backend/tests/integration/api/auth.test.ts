import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';

describe('Auth API', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new citizen user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userType: 'Citizen'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('userType', userData.userType);
    }, 10000); // 10 second timeout
  });

  describe('POST /api/auth/login', () => {
    it('should login an officer user', async () => {
      const loginData = {
        email: 'officer@epanchayat.com',
        password: 'officer123',
        userType: 'Officer'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Check that login was successful
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('userType', 'Officer');
    }, 10000); // 10 second timeout

    it('should login a staff user', async () => {
      const loginData = {
        email: 'staff1@epanchayat.com',
        password: 'staff123',
        userType: 'Staff'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Check that login was successful
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('userType', 'Staff');
    }, 10000); // 10 second timeout
  });
});