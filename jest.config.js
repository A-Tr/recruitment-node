/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['text-summary', 'text', 'lcov', 'json'],
  collectCoverageFrom: ['src/**/*.ts']
};