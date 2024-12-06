jest.mock('../../config/db');
jest.mock('../services/helperService');

const db = require('../../config/db');
const budgetService = require('../services/budgetService');
const helperService = require('../services/helperService');

describe('budgetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a budget with default values', async () => {
    const userID = 1;

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('INSERT INTO Budget');
      callback(null, { insertId: 1 });
    });

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('INSERT INTO UserBudget');
      callback(null, { affectedRows: 1 });
    });

    helperService.createCategory.mockResolvedValue({ insertId: 1 });
    helperService.createTransaction.mockResolvedValue({ insertId: 1 });

    const result = await budgetService.createBudget(userID);
    expect(result).toBe(1);
    expect(db.query).toHaveBeenCalledTimes(2);
    expect(helperService.createCategory).toHaveBeenCalledTimes(5); 
  });

  test('creates a budget with custom values', async () => {
    const userID = 1;
    const budgetData = {
      title: 'Monthly Budget',
      initialBalance: 1000,
      accountType: 'Individual'
    };

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('INSERT INTO Budget');
      callback(null, { insertId: 1 });
    });

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('INSERT INTO UserBudget');
      callback(null, { affectedRows: 1 });
    });

    helperService.createCategory.mockResolvedValue({ insertId: 1 });
    helperService.createTransaction.mockResolvedValue({ insertId: 1 });

    const result = await budgetService.createBudget(userID, budgetData);
    expect(result).toBe(1);
    expect(db.query).toHaveBeenCalledTimes(2);
    expect(helperService.createCategory).toHaveBeenCalledTimes(5);
    expect(helperService.createTransaction).toHaveBeenCalledTimes(1); 
  });

  test('gets a budget', async () => {
    const mockBudget = {
      budgetID: 1,
      title: 'Monthly Budget',
      totalBalance: 1000,
      totalIncome: 1500,
      totalExpenses: 500,
      accountType: 'Individual',
      ownerID: 1
    };

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('SELECT Budget.* FROM Budget INNER JOIN UserBudget');
      callback(null, [mockBudget]);
    });

    const result = await budgetService.getBudget(1, 1);
    expect(result).toEqual(mockBudget);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('handles budget not found', async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('SELECT Budget.* FROM Budget INNER JOIN UserBudget');
      callback(null, []);
    });

    const result = await budgetService.getBudget(999, 1);
    expect(result).toBeUndefined();
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('updates budget title', async () => {
    const budgetID = 1;
    const userID = 1;
    const newTitle = 'Updated Budget';

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('UPDATE Budget SET title');
      callback(null, { affectedRows: 1 });
    });

    const result = await budgetService.updateTitle(budgetID, userID, newTitle);
    expect(result).toBeUndefined(); 
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('deletes a budget', async () => {
    const budgetID = 1;
    const userID = 1;
    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('SELECT * FROM UserBudget');
      callback(null, [{ userID: 1 }]);
    });

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('DELETE FROM UserBudget');
      callback(null, { affectedRows: 1 });
    });

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('DELETE FROM Budget');
      callback(null, { affectedRows: 1 });
    });

    const result = await budgetService.deleteBudget(budgetID, userID);
    expect(result).toEqual({ affectedRows: 1 });
    expect(db.query).toHaveBeenCalledTimes(3);
  });
});
