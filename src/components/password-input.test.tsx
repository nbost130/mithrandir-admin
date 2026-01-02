import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './password-input';

describe('PasswordInput', () => {
  it('renders with password type by default', () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="Enter password" />);

    const input = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button'); // The eye icon button

    // Initially password
    expect(input).toHaveAttribute('type', 'password');

    // Click to show
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    // Click to hide
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('accepts input', async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText('Enter password');

    await user.type(input, 'secret123');
    expect(input).toHaveValue('secret123');
  });
});
