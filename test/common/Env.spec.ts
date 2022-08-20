import { getEnv } from '../../src/common/Env';

describe('Env tests', () => {
  afterEach(() => {
    delete process.env.TEST_KEY
  });

  test('should return env var if exists', () => {
    process.env.TEST_KEY = 'somevalue';

    const value = getEnv('TEST_KEY');
    expect(value).toBe('somevalue');
  });

  test('should throw Error if env var is not found by default', () => {
    expect.assertions(2)
    try {
      getEnv('TEST_KEY')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Missing env key TEST_KEY')
    }
  })

  test('should return empty string if env var is not found and throwErr === false', () => {
    const value = getEnv('TEST_KEY', false);
    expect(value).toBe('');
  })
});
