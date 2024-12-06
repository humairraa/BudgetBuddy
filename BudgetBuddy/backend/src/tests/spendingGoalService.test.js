jest.mock('../../config/db');
jest.mock('../services/helperService');

const db = require('../../config/db');
const spendingGoalService = require('../services/spendingGoalService');
const helperService = require('../services/helperService');

describe('spendingGoalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    helperService.checkBudgetExists.mockResolvedValue({ budgetID: 1 });
  });

  test('creates a spending goal', async () => {
    const budgetID = 1;
    const userID = 1;
    const spendingGoal = {
      categoryID: 1,
      spendingLimit: 500,
      currAmount: 0,
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    };

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('INSERT INTO SpendingGoal');
      callback(null, { insertId: 1 });
    });

    const result = await spendingGoalService.createSpendingGoal(budgetID, spendingGoal, userID);
    expect(result.insertId).toBe(1);
    expect(helperService.checkBudgetExists).toHaveBeenCalledWith(budgetID, userID);
  });

  test('gets a spending goal', async () => {
    const budgetID = 1;
    const spendingGoalID = 1;
    const userID = 1;
    const mockSpendingGoal = {
      spendingGoalID: 1,
      categoryID: 1,
      budgetID: 1,
      spendingLimit: 500,
      currAmount: 0,
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    };

    let queryCount = 0;
    db.query.mockImplementation((query, values, callback) => {
      queryCount++;
      switch (queryCount) {
        case 1: 
          callback(null, [mockSpendingGoal]);
          break;
        case 2: 
          callback(null, [{ totalExpenses: 100 }]);
          break;
        case 3: 
          callback(null, { affectedRows: 1 });
          break;
      }
    });

    const result = await spendingGoalService.getSpendingGoal(budgetID, spendingGoalID, userID);
    expect(result).toEqual({
      ...mockSpendingGoal,
      currAmount: 100
    });
  });


  test('updates a spending goal', async () => {
    const budgetID = 1;
    const spendingGoalID = 1;
    const userID = 1;
    const spendingGoalData = {
      categoryID: 2,
      spendingLimit: 1000,
      currAmount: 200,
      startDate: '2023-02-01',
      endDate: '2023-12-31'
    };

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('UPDATE SpendingGoal');
      callback(null, { affectedRows: 1 });
    });

    const result = await spendingGoalService.updateSpendingGoal(spendingGoalID, budgetID, spendingGoalData, userID);
    expect(result.affectedRows).toBe(1);
  });

  test('deletes a spending goal', async () => {
    const budgetID = 1;
    const spendingGoalID = 1;
    const userID = 1;

    db.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain('DELETE FROM SpendingGoal');
      callback(null, { affectedRows: 1 });
    });

    const result = await spendingGoalService.deleteSpendingGoal(budgetID, spendingGoalID, userID);
    expect(result.affectedRows).toBe(1);
  });

  test('handles database error', async () => {
    const budgetID = 1;
    const spendingGoalID = 1;
    const userID = 1;

    const dbError = new Error('db error');
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(dbError, null);
    });

    await expect(spendingGoalService.getSpendingGoal(budgetID, spendingGoalID, userID))
      .rejects
      .toThrow('db error');
  });
});
