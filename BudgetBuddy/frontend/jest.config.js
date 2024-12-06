module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^../utils/customAxiosInstance$': '<rootDir>/src/tests/__mocks__/customAxiosInstance.js',
    '^mui-color-input$': '<rootDir>/src/tests/__mocks__/mui-color-input.js'
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@babel|mui-color-input)/)'
  ],
  testMatch: [
    '<rootDir>/src/tests/**/*.test.js'
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
