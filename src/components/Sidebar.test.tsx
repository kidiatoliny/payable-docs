import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarClient } from './Sidebar';
import type { NavGroup } from '@/lib/nav';

const nav: NavGroup[] = [{
  label: 'Start here',
  groups: [],
  items: [
    { id: '01-overview', title: 'Overview', href: '/01-overview' },
    { id: '02-architecture', title: 'Architecture', href: '/02-architecture' },
  ],
}];

describe('SidebarClient', () => {
  it('updates the active route after an Astro page swap', () => {
    window.history.replaceState({}, '', '/01-overview');
    render(<SidebarClient nav={nav} currentSlug="01-overview" />);
    expect(screen.getByTestId('docs-sidebar-surface')).toHaveClass('bg-background');
    expect(screen.getByTestId('docs-sidebar-surface')).toHaveStyle({ backgroundColor: 'var(--background)' });
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');

    window.history.replaceState({}, '', '/02-architecture');
    act(() => document.dispatchEvent(new Event('astro:after-swap')));

    expect(screen.getByRole('link', { name: 'Architecture' })).toHaveAttribute('aria-current', 'page');
  });
});
