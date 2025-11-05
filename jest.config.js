module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    '^../src/(.*)$': '<rootDir>/src/$1',
    '^../../src/(.*)$': '<rootDir>/src/$1',
    '^../config/(.*)$': '<rootDir>/src/config/$1',
    '^../../config/(.*)$': '<rootDir>/src/config/$1',
    '^../errors/(.*)$': '<rootDir>/src/api/v1/errors/$1',
  },
};
