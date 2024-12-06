import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Wrapper from '../screens/Wrapper';

jest.mock('../components/Navbar', () => ({
  __esModule: true,
  default: (props) => {
    return <div data-testid="navbar">Navbar Mock</div>;
  }
}));

jest.mock('../components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header Mock</div>
}));

const mockLocalStorage = {
  getItem: jest.fn(() => 'mock-token'),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

jest.mock('../utils/customAxiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn((url) => {
      try {
        if (url === '/budgets') {
          return Promise.resolve({
            data: [{ budgetID: 1, title: 'Test Budget' }]
          });
        }
        return Promise.resolve({
          data: []
        });
      } catch (error) {
        return Promise.reject({
          response: {
            data: {
              error: 'Mock API Error'
            }
          },
          message: 'Mock Error Message'
        });
      }
    })
  }
}));

describe('Wrapper Component', () => {
  const TestComponent = () => <div data-testid="test-content">Test Content</div>;

  jest.setTimeout(10000);

  test('renders loading state and wrapped content', async () => {
    render(
      <BrowserRouter>
        <Wrapper Component={TestComponent} />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading budget...')).toBeInTheDocument();

    await waitFor(
      () => {
        const navbar = screen.queryByTestId('navbar');
        if (!navbar) {
          throw new Error('Navbar not found in document');
        }
        const content = screen.queryByTestId('test-content');
        if (!content) {
          throw new Error('Test content not found in document');
        }
        expect(navbar).toBeInTheDocument();
        expect(content).toBeInTheDocument();
      },
      {
        timeout: 6000,
        interval: 1000
      }
    );
  });
});
