import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTransactionModal from '../../components/AddTransactionModal';

jest.mock('../../utils/customAxiosInstance', () => ({
  default: {
    post: jest.fn(() => Promise.resolve({ data: { message: 'Success' } }))
  }
}));

describe('AddTransactionModal Component', () => {
  const mockProps = {
    budgetID: 1,
    showModal: true,
    setShowModal: jest.fn(),
    setRefresh: jest.fn(),
    categories: [
      { categoryID: 1, name: 'Food', colour: '#FF0000' },
      { categoryID: 2, name: 'Transport', colour: '#00FF00' }
    ],
    users: [{ userID: 1, username: 'testuser', current: true }]
  };

  test('renders basic form elements', () => {
    render(<AddTransactionModal {...mockProps} />);
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  test('handles input fields', () => {
    render(<AddTransactionModal {...mockProps} />);

    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Groceries' } });
    expect(titleInput.value).toBe('Groceries');

    const amountInput = screen.getByLabelText('Amount');
    fireEvent.change(amountInput, { target: { value: '50' } });
    expect(amountInput.value).toBe('50');
  });

});
