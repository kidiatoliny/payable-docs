import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MobileNav } from './MobileNav';
import type { NavGroup } from '@/lib/nav';

const nav: NavGroup[] = [{
  label: 'Integrations',
  items: [],
  groups: [{
    label: 'Trust My Travel',
    storageKey: 'Integrations/Trust My Travel',
    items: [{
      id: 'integrations/20c-trust-my-travel-credentials',
      title: 'Credentials',
      href: '/integrations/20c-trust-my-travel-credentials',
    }],
  }],
}];

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
});

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
});

describe('MobileNav', () => {
  it('opens an accessible sheet with the shared hierarchy and active route', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/integrations/20c-trust-my-travel-credentials/');
    render(<MobileNav nav={nav} currentSlug="integrations/20c-trust-my-travel-credentials" logoSrc="/logo.svg" />);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    const dialog = await screen.findByRole('dialog', { name: 'Sidebar' });
    expect(dialog).toHaveAttribute('data-mobile', 'true');
    expect(dialog).toHaveClass('rounded-none');
    expect(screen.getByRole('button', { name: 'Trust My Travel' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Credentials' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByAltText('Akira')).toHaveAttribute('src', '/logo.svg');
    expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
  });

  it('closes after choosing a navigation item', async () => {
    const user = userEvent.setup();
    const preventNavigation = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('click', preventNavigation);
    render(<MobileNav nav={nav} currentSlug="elsewhere" logoSrc="/logo.svg" />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    await user.click(screen.getByRole('link', { name: 'Credentials' }));
    document.removeEventListener('click', preventNavigation);

    expect(screen.queryByRole('dialog', { name: 'Sidebar' })).not.toBeInTheDocument();
  });

  it('closes with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={nav} currentSlug="elsewhere" logoSrc="/logo.svg" />);
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Sidebar' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
