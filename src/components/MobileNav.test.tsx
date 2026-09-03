import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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

describe('MobileNav', () => {
  it('opens an accessible sheet with the shared hierarchy and active route', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/integrations/20c-trust-my-travel-credentials/');
    render(<MobileNav nav={nav} currentSlug="integrations/20c-trust-my-travel-credentials" />);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    expect(screen.getByRole('dialog', { name: 'Documentation' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Trust My Travel' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Credentials' })).toHaveAttribute('aria-current', 'page');
  });

  it('closes after choosing a navigation item', async () => {
    const user = userEvent.setup();
    const preventNavigation = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('click', preventNavigation);
    render(<MobileNav nav={nav} currentSlug="elsewhere" />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    await user.click(screen.getByRole('link', { name: 'Credentials' }));
    document.removeEventListener('click', preventNavigation);

    expect(screen.queryByRole('dialog', { name: 'Documentation' })).not.toBeInTheDocument();
  });

  it('closes with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={nav} currentSlug="elsewhere" />);
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Documentation' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
