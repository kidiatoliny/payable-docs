import { act, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SIDEBAR_COLLAPSED_GROUPS_KEY } from '@akira-io/ui/shells';
import { SidebarProvider } from '@akira-io/ui';
import { DocsNav } from './DocsNav';
import type { NavGroup } from '@/lib/nav';

const nav: NavGroup[] = [
  {
    label: 'Start here',
    items: [{ id: '01-overview', title: 'Overview', href: '/01-overview' }],
    groups: [],
  },
  {
    label: 'Integrations',
    items: [{ id: 'integrations/17-providers', title: 'Payment Providers', href: '/integrations/17-providers' }],
    groups: [
      {
        label: 'Stripe',
        storageKey: 'Integrations/Stripe',
        items: [{ id: 'integrations/18-stripe', title: 'Provider', href: '/integrations/18-stripe' }],
      },
      {
        label: 'Revolut',
        storageKey: 'Integrations/Revolut',
        items: [{ id: 'integrations/21-revolut', title: 'Provider', href: '/integrations/21-revolut' }],
      },
    ],
  },
];

function renderNav(currentPath: string) {
  return render(
    <SidebarProvider>
      <DocsNav nav={nav} currentPath={currentPath} />
    </SidebarProvider>,
  );
}

describe('DocsNav', () => {
  it('marks the exact active route without overriding persisted collapse state', () => {
    localStorage.setItem(
      SIDEBAR_COLLAPSED_GROUPS_KEY,
      JSON.stringify(['Start here', 'Integrations', 'Integrations/Revolut']),
    );

    renderNav('/integrations/21-revolut/');

    expect(screen.getByRole('button', { name: 'Integrations' })).toHaveAttribute('aria-expanded', 'false');
    expect(JSON.parse(localStorage.getItem(SIDEBAR_COLLAPSED_GROUPS_KEY) ?? '[]')).toContain('Integrations');
  });

  it('uses the package hover-state token instead of a local color', () => {
    renderNav('/01-overview');

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveClass('hover:bg-sidebar-accent-hover');
  });

  it('uses SidebarGroupLabel without a hover surface for group titles', () => {
    renderNav('/01-overview');

    expect(screen.getByRole('button', { name: 'Integrations' })).toHaveAttribute('data-slot', 'sidebar-group-label');
    expect(screen.getByRole('button', { name: 'Integrations' }).className).not.toContain('hover:bg');
  });

  it('separates adjacent navigation groups', () => {
    renderNav('/01-overview');

    expect(screen.getByRole('navigation', { name: 'Documentation' })).toHaveClass('gap-6');
  });

  it('persists collapsed top-level state across remounts', async () => {
    const user = userEvent.setup();
    const view = renderNav('/01-overview');

    await user.click(screen.getByRole('button', { name: 'Integrations' }));
    expect(screen.getByRole('button', { name: 'Integrations' })).toHaveAttribute('aria-expanded', 'false');
    expect(JSON.parse(localStorage.getItem(SIDEBAR_COLLAPSED_GROUPS_KEY) ?? '[]')).toContain('Integrations');

    view.unmount();
    renderNav('/01-overview');
    expect(screen.getByRole('button', { name: 'Integrations' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('lets the user collapse the group containing the current page', async () => {
    const user = userEvent.setup();
    renderNav('/integrations/21-revolut');

    await user.click(screen.getByRole('button', { name: 'Integrations' }));

    expect(screen.getByRole('button', { name: 'Integrations' })).toHaveAttribute('aria-expanded', 'false');
    expect(JSON.parse(localStorage.getItem(SIDEBAR_COLLAPSED_GROUPS_KEY) ?? '[]')).toContain('Integrations');
  });

  it('uses independent persistence keys for provider groups', async () => {
    const user = userEvent.setup();
    renderNav('/01-overview');

    const integrationsButton = screen.getByRole('button', { name: 'Integrations' });
    if (integrationsButton.getAttribute('aria-expanded') === 'false') await user.click(integrationsButton);
    await user.click(screen.getByRole('button', { name: 'Stripe' }));
    await user.click(screen.getByRole('button', { name: 'Revolut' }));

    expect(JSON.parse(localStorage.getItem(SIDEBAR_COLLAPSED_GROUPS_KEY) ?? '[]')).toEqual(
      expect.arrayContaining(['Integrations/Stripe', 'Integrations/Revolut']),
    );
  });

  it('exposes keyboard-operable collapse buttons', async () => {
    const user = userEvent.setup();
    renderNav('/01-overview');
    const trigger = screen.getByRole('button', { name: 'Integrations' });

    trigger.focus();
    await user.keyboard('{Enter}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(within(trigger).getByTestId('collapse-icon')).toBeInTheDocument();
  });

  it('hydrates without a mismatch when stored state differs from the server default', async () => {
    localStorage.setItem(SIDEBAR_COLLAPSED_GROUPS_KEY, JSON.stringify(['Integrations']));
    const browserWindow = window;
    vi.stubGlobal('window', undefined);
    const html = renderToString(
      <SidebarProvider><DocsNav nav={nav} currentPath="/01-overview" /></SidebarProvider>,
    );
    vi.stubGlobal('window', browserWindow);
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await act(async () => {
      hydrateRoot(
        container,
        <SidebarProvider><DocsNav nav={nav} currentPath="/01-overview" /></SidebarProvider>,
      );
    });

    expect(consoleError.mock.calls.flat().join(' ')).not.toContain('Hydration failed');
    consoleError.mockRestore();
    container.remove();
    vi.unstubAllGlobals();
  });
});
