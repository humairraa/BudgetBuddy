import { render, screen, fireEvent } from '@testing-library/react';
import AddGoalModal from '../../components/AddGoalModal';

// Mock DatePicker
jest.mock('@mui/x-date-pickers', () => ({
  DatePicker: () => <input data-testid="date-picker" />,
  LocalizationProvider: ({ children }) => children
}));

// Mock axios with default export
jest.mock('../../utils/customAxiosInstance', () => ({
  default: {
    post: jest.fn(() => Promise.resolve({ data: { message: 'Success' } }))
  }
}));

describe('AddGoalModal Component', () => {
  const mockProps = {
    budgetID: 1,
    categories: [
      { categoryID: 1, name: 'Food', colour: '#FF0000' }
    ],
    showModal: true,
    setShowModal: jest.fn(),
    setRefresh: jest.fn()
  };

  test('renders basic form elements', () => {
    render(<AddGoalModal {...mockProps} />);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Spending Limit')).toBeInTheDocument();
  });

  test('handles spending limit input', () => {
    render(<AddGoalModal {...mockProps} />);
    const limitInput = screen.getByLabelText('Spending Limit');
    fireEvent.change(limitInput, { target: { value: '1000' } });
    expect(limitInput.value).toBe('1000');
  });
});
