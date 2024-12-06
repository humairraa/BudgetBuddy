const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: { token: 'test-token' } })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} }))
};

// Export both default and named exports to handle different import styles
module.exports = mockAxios;
module.exports.default = mockAxios;
module.exports.__esModule = true;
