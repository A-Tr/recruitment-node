import 'reflect-metadata';

import { container } from 'tsyringe';
import { UsersController } from '../../../src/domains/users/UsersController';
import { UsersService } from '../../../src/domains/users/UsersService';

const mockServiceLogin = jest.fn();
const mockService = {
  login: mockServiceLogin,
};

describe('UsersController tests', () => {
  let controller: UsersController;

  beforeEach(() => {
    jest.resetAllMocks();
    controller = container
      .register<UsersService>(UsersService, { useValue: mockService as unknown as UsersService })
      .resolve(UsersController);
  });

  describe('login tests', () => {
    test('should return email and token if user exists and password matchs', async () => {
      const TEST_EMAIL = 'user@test.com'
      const TEST_PASSWORD = '1234'
      mockServiceLogin.mockResolvedValue({
        email: TEST_EMAIL,
        token: 'imatoken'
      });

      const result = await controller.login({email: TEST_EMAIL, password: TEST_PASSWORD});
      expect(result).toEqual({
        email: TEST_EMAIL,
        token: 'imatoken'
      })
    });
  });
});
