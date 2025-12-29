import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserAuthForm } from './user-auth-form';

// Mock dependencies
const mockSetUser = vi.fn();
const mockSetAccessToken = vi.fn();

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    auth: {
      setUser: mockSetUser,
      setAccessToken: mockSetAccessToken,
    },
  }),
}));

// Mock router
// We need to wrap component in a RouterProvider because it uses Link and useNavigate
// However, constructing a full TanStack router for a unit test is complex.
// We can mock the imports from @tanstack/react-router instead.

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe('UserAuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<UserAuthForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<UserAuthForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByText(/please enter your email/i)).toBeInTheDocument();
    expect(await screen.findByText(/please enter your password/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<UserAuthForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    render(<UserAuthForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Wait for async actions (sleep(2000) in component)
    // We should probably mock the sleep function or use fake timers to speed this up
    await waitFor(
      () => {
        expect(mockSetUser).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    expect(mockSetUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
      })
    );
    expect(mockSetAccessToken).toHaveBeenCalledWith('mock-access-token');
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/', replace: true });
  });
});
