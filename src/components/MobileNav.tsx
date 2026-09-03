import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@akira-io/ui';
import type { NavGroup } from '@/lib/nav';
import { DocsNav } from '@/components/DocsNav';

function MobileSidebar({
  nav,
  currentPath,
  logoSrc,
}: {
  nav: NavGroup[];
  currentPath: string;
  logoSrc: string;
}) {
  const { openMobile, setOpenMobile } = useSidebar();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !openMobile) triggerRef.current?.focus();
    wasOpen.current = openMobile;
  }, [openMobile]);

  return (
    <>
      <SidebarTrigger ref={triggerRef} aria-label="Open navigation" />
      <Sidebar side="left">
        <SidebarHeader className="border-b border-sidebar-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="app-bar-brand">
              <img src={logoSrc} alt="Akira" width="27" height="27" className="app-bar-logo" />
              <span>payable</span>
            </span>
            <Button type="button" variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setOpenMobile(false)}>
              <X className="size-5" />
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <DocsNav nav={nav} currentPath={currentPath} onNavigate={() => setOpenMobile(false)} />
        </SidebarContent>
      </Sidebar>
    </>
  );
}

export function MobileNav({
  nav,
  currentSlug,
  logoSrc,
}: {
  nav: NavGroup[];
  currentSlug: string;
  logoSrc: string;
}) {
  const [currentPath, setCurrentPath] = useState(`/${currentSlug}`);

  useEffect(() => {
    const syncCurrentPath = () => {
      setCurrentPath(window.location.pathname);
    };
    syncCurrentPath();
    document.addEventListener('astro:after-swap', syncCurrentPath);
    return () => document.removeEventListener('astro:after-swap', syncCurrentPath);
  }, []);

  return <SidebarProvider className="min-h-0 w-auto md:hidden" style={{ '--sidebar': 'var(--background)' } as CSSProperties}>
    <MobileSidebar nav={nav} currentPath={currentPath} logoSrc={logoSrc} />
  </SidebarProvider>;
}
