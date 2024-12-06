import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinancialReportModal from '../../components/FinancialReportModal';


jest.mock('../../utils/customAxiosInstance', () => ({
  default: {
    post: jest.fn(() => Promise.resolve({
      data: {
        message: 'Report generated',
        report: {
          month: 'January',
          year: 2024,
          totalIncome: 5000,
          totalExpenses: 3000,
          savingsRate: 40
        }
      }
    }))
  }
}));

describe('FinancialReportModal Component', () => {
  const mockProps = {
    budgetID: 1,
    showModal: true,
    setShowModal: jest.fn(),
    setRefresh: jest.fn()
  };

  test('renders basic form elements', () => {
    render(<FinancialReportModal {...mockProps} />);
    expect(screen.getByText('Generate Financial Report')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate financial report/i })).toBeInTheDocument();
  });

  // test('handles report generation', async () => {
  //   render(<FinancialReportModal {...mockProps} />);

  //   // Click generate button
  //   fireEvent.click(screen.getByRole('button', { name: /generate financial report/i }));

  //   // Check if report data is displayed
  //   await waitFor(() => {
  //     expect(screen.getByText((content, element) => content.includes('Total Expenses'))).toBeInTheDocument();
  //     expect(screen.getByText((content, element) => content.includes('Savings Rate'))).toBeInTheDocument();
  //   });
  // });
});
