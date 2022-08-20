import { expressAuthentication } from '../../../src/common/middleware/Authentication';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../src/common/errors/DomainError';

const TEST_JWT_SECRET = 'test-secret';
const TEST_USER_EMAIL = 'user@test.com';
const TEST_USER_ID = 1;

describe('Authentication middleware tests', () => {
  let TEST_TOKEN: string;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    // We freeze system time so JWT token is always the same
    jest.useFakeTimers().setSystemTime(1660992924005);
    TEST_TOKEN = jwt.sign({email: TEST_USER_EMAIL, userId: TEST_USER_ID}, TEST_JWT_SECRET, { expiresIn: 60 * 60 })
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    jest.useRealTimers();
  });

  test('should return the decoded user email and id', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': TEST_TOKEN
      }
    } as unknown as Request;

    const result = await expressAuthentication(mockRequest, 'jwt');
    expect(result).toEqual({
      email: TEST_USER_EMAIL,
      userId: TEST_USER_ID
    })
  });

  test('should throw Unauthorized error is securityName !== "jwt"', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': TEST_TOKEN
      }
    } as unknown as Request;

    expect.assertions(1)
    try {
      await expressAuthentication(mockRequest, 'nonsupported');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError)
    }
  });

  test('should throw Unauthorized error is token is missing x-access-token header', async () => {
    const mockRequest = {
      headers: {}
    } as unknown as Request;

    expect.assertions(1)
    try {
      await expressAuthentication(mockRequest, 'jwt');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError)
    }
  });

  test('should throw Forbidden error is token is invalid (signed with different key', async () => {
    const errorToken = jwt.sign({email: TEST_USER_EMAIL, userId: TEST_USER_ID}, 'different-key', { expiresIn: 60 * 60 })

    const mockRequest = {
      headers: {
        'x-access-token': errorToken
      }
    } as unknown as Request;

    expect.assertions(1)
    try {
      await expressAuthentication(mockRequest, 'jwt');
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError)
    }
  });

});