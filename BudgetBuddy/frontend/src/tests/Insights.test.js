import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Insights from '../screens/Insights';

jest.mock('../utils/customAxiosInstance', () => ({
  default: {
    get: jest.fn(() => Promise.resolve({
      data: {
        financialReports: [{
          reportID: 1,
          month: 'January',
          year: 2024,
          totalIncome: 5000,
          totalExpenses: 3000,
          savingsRate: 40
        }]
      }
    }))
  }
}));

jest.mock('../components/MonthPicker', () => ({
  __esModule: true,
  default: () => <div data-testid="month-picker">Month Picker Mock</div>
}));

describe('Insights Component', () => {
  const mockProps = {
    budget: {
      budgetID: 1,
      title: 'Test Budget'
    },
    fetchAllTransactions: jest.fn()
  };

  test('renders basic insights elements', () => {
    render(
      <BrowserRouter>
        <Insights {...mockProps} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('month-picker')).toBeInTheDocument();
  });
});
