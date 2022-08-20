import { errorHandler } from '../../../src/common/middleware/ErrorHandler';
import { Request, Response, NextFunction } from 'express';
import { FieldErrors, ValidateError } from 'tsoa';
import { NotFoundError } from '../../../src/common/errors/DomainError';

const mockResFn = jest.fn();
const mockStatusFn = jest.fn();
const mockNext = jest.fn();
describe('ErrorHandler middlware tests', () => {
  const mockResObj = {
    status: mockStatusFn.mockReturnValue({json: mockResFn}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should send Bad Request response if validation failed', () => {
    const testError = new ValidateError(
      {missingField: { message: 'Missing userId in params', value: 'userId' }},
      'Validation Error',
    );
    errorHandler(testError, {} as Request, mockResObj as unknown as Response, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatusFn).toHaveBeenCalledWith(400)
    expect(mockResFn).toHaveBeenCalledWith({"details": {"missingField": {"message": "Missing userId in params", "value": "userId"}}, "message": "Validation Failed"})
  });

  test('should send Domain Error code and message response if error is DomainError', () => {
    const testError = NotFoundError.generateFromParams('users', 'id', 1);
    errorHandler(testError, {} as Request, mockResObj as unknown as Response, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatusFn).toHaveBeenCalledWith(404)
    expect(mockResFn).toHaveBeenCalledWith({"message": "Error: users with id 1 not found"})
  });

  test('should send Internal Server Error response if unexpected Error happens', () => {
    const testError = new Error('Some Exception occurred')
    errorHandler(testError, {} as Request, mockResObj as unknown as Response, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatusFn).toHaveBeenCalledWith(500)
    expect(mockResFn).toHaveBeenCalledWith({"message": "Internal Server error. Error: Some Exception occurred"})
  });

  test('should send Internal Server Error response if error is not instance of Error', () => {
    const testError = 'Im a strange error'
    errorHandler(testError, {} as Request, mockResObj as unknown as Response, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatusFn).toHaveBeenCalledWith(500)
    expect(mockResFn).toHaveBeenCalledWith({"message": "Internal Server error. Im a strange error"})
  });

  test('should call response.next if there is no error', () => {
    const testError = undefined
    errorHandler(testError, {} as Request, mockResObj as unknown as Response, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
