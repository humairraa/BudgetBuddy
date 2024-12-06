module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  moduleNameMapper: {
    '^../../config/(.*)$': '<rootDir>/src/config/__mocks__/$1',
    '^../config/(.*)$': '<rootDir>/src/config/__mocks__/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    'config/db\\.js$'
  ],
  setupFiles: ['<rootDir>/src/tests/__mocks__/setup.js'],
};
