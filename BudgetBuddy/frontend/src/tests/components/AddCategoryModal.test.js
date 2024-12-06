import { render, screen, fireEvent } from '@testing-library/react';
import AddCategoryModal from '../../components/AddCategoryModal';

jest.mock('mui-color-input', () => ({
  MuiColorInput: () => <input data-testid="color-input" />
}));

jest.mock('../../utils/customAxiosInstance', () => ({
  default: {
    post: jest.fn(() => Promise.resolve({ data: { message: 'Success' } }))
  }
}));

describe('AddCategoryModal Component', () => {
  const mockProps = {
    budgetID: 1,
    showModal: true,
    setShowModal: jest.fn(),
    setRefresh: jest.fn()
  };

  test('renders basic form elements', () => {
    render(<AddCategoryModal {...mockProps} />);
    expect(screen.getByText('Add Custom Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByTestId('color-input')).toBeInTheDocument();
  });

  test('handles name input', () => {
    render(<AddCategoryModal {...mockProps} />);
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Food' } });
    expect(nameInput.value).toBe('Food');
  });
});
