import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Transactions from '../screens/Transactions';

jest.mock('../components/MonthPicker', () => ({
  __esModule: true,
  default: () => <div data-testid="month-picker">Month Picker Mock</div>
}));

jest.mock('../utils/customAxiosInstance', () => ({
  default: {
    get: jest.fn(() => Promise.resolve({ data: {} }))
  }
}));

describe('Transactions Component', () => {
  const mockProps = {
    budget: {
      budgetID: 1,
      title: 'Test Budget'
    },
    categories: [
      { categoryID: 1, name: 'Food', colour: '#FF0000' }
    ],
    users: [
      { userID: 1, username: 'testuser', current: true }
    ],
    transactions: [
      {
        transactionID: 1,
        title: 'Groceries',
        amount: 100,
        date: '2024-01-01T00:00:00.000Z',
        transactionType: 'Expense',
        categoryID: 1
      },
      {
        transactionID: 2,
        title: 'Salary',
        amount: 1000,
        date: '2024-01-01T00:00:00.000Z',
        transactionType: 'Income',
        categoryID: 1
      }
    ],
    setRefresh: jest.fn(),
    fetchAllTransactions: jest.fn()
  };

  test('renders transaction list', () => {
    render(
      <BrowserRouter>
        <Transactions {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('month-picker')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  test('handles empty transaction list', () => {
    const propsWithNoTransactions = {
      ...mockProps,
      transactions: []
    };

    render(
      <BrowserRouter>
        <Transactions {...propsWithNoTransactions} />
      </BrowserRouter>
    );

    expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    expect(screen.queryByText('Salary')).not.toBeInTheDocument();
  });
});
