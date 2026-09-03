import { useEffect, useState, type CSSProperties } from 'react';
import { Sidebar as UiSidebar, SidebarContent, SidebarProvider } from '@akira-io/ui';
import type { NavGroup } from '@/lib/nav';
import { DocsNav } from '@/components/DocsNav';

export function SidebarClient({ nav, currentSlug }: { nav: NavGroup[]; currentSlug: string }) {
  const [currentPath, setCurrentPath] = useState(`/${currentSlug}`);

  useEffect(() => {
    const syncCurrentPath = () => setCurrentPath(window.location.pathname);
    syncCurrentPath();
    document.addEventListener('astro:after-swap', syncCurrentPath);
    return () => document.removeEventListener('astro:after-swap', syncCurrentPath);
  }, []);

  return (
    <SidebarProvider
      className="h-full min-h-0 w-full bg-background"
      style={{ '--sidebar': 'var(--background)' } as CSSProperties}
    >
      <UiSidebar
        collapsible="none"
        className="relative h-full w-full bg-background"
        style={{ backgroundColor: 'var(--background)' }}
        data-testid="docs-sidebar-surface"
      >
        <SidebarContent className="px-5 py-8">
          <DocsNav nav={nav} currentPath={currentPath} />
        </SidebarContent>
      </UiSidebar>
    </SidebarProvider>
  );
}
