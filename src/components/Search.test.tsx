import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Search } from './Search';

describe('Search', () => {
  it('opens with useful discovery copy and popular topics', async () => {
    const user = userEvent.setup();
    render(<Search />);

    await user.click(screen.getByRole('button', { name: 'Search documentation' }));

    expect(screen.getByText(/Find implementation guides/)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Checkout' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Payment providers' })).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toHaveClass('min-h-72', 'p-2');
  });
});
