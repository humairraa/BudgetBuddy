jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  }))
}));

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

process.env.DB_HOST = 'mock-host';
process.env.DB_USER = 'mock-user';
process.env.DB_PASSWORD = 'mock-password';
process.env.DB_NAME = 'mock-db';

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
