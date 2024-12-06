import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../screens/Home';

const mockBudget = {
  budgetID: 1,
  title: 'Test Budget',
  totalBalance: 1000,
  totalIncome: 2000,
  totalExpenses: 1000
};

const mockProps = {
  budget: mockBudget,
  goals: [],
  categories: [],
  users: [{ current: true }],
  financialReports: [],
  setRefresh: () => {}
};

describe('Home Component', () => {
  test('displays budget information', () => {
    render(
      <BrowserRouter>
        <Home {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Balance')).toBeInTheDocument();

    const incomeElements = screen.getAllByText((content, element) => content.includes('2000'));
    expect(incomeElements.length).toBeGreaterThan(0);
    incomeElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const balanceElements = screen.getAllByText((content, element) => content.includes('1000'));
    expect(balanceElements.length).toBeGreaterThan(0);
    balanceElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
});
