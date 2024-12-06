
// db connection and query functionality mock
const mockDb = {
  query: jest.fn((query, values, callback) => {
    if (callback) {
      callback(null, { insertId: 1 });
      return;
    }
    return Promise.resolve({ insertId: 1 });
  }),

  connect: jest.fn((callback) => {
    if (callback) callback(null);
    return Promise.resolve();
  }),

  changeUser: jest.fn((config, callback) => {
    if (callback) callback(null);
    return Promise.resolve();
  }),

  end: jest.fn((callback) => {
    if (callback) callback(null);
    return Promise.resolve();
  }),

  destroy: jest.fn(),

  on: jest.fn(),

  off: jest.fn(),

  emit: jest.fn()
};

mockDb.connect.mockImplementation((callback) => {
  if (callback) callback(null);
  return Promise.resolve();
});

module.exports = mockDb;
