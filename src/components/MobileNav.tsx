import { useEffect, useState, type CSSProperties } from 'react';
import { Menu } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SidebarProvider,
} from '@akira-io/ui';
import type { NavGroup } from '@/lib/nav';
import { DocsNav } from '@/components/DocsNav';

export function MobileNav({ nav, currentSlug }: { nav: NavGroup[]; currentSlug: string }) {
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(`/${currentSlug}`);

  useEffect(() => {
    const syncCurrentPath = () => {
      setCurrentPath(window.location.pathname);
      setOpen(false);
    };
    syncCurrentPath();
    document.addEventListener('astro:after-swap', syncCurrentPath);
    return () => document.removeEventListener('astro:after-swap', syncCurrentPath);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          className="lg:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 max-w-[85vw] overflow-y-auto p-0">
        <SheetHeader className="border-b border-sidebar-border px-5 py-4">
          <SheetTitle>Documentation</SheetTitle>
        </SheetHeader>
        <SidebarProvider
          className="min-h-0 bg-background px-2 py-4"
          style={{ '--sidebar': 'var(--background)' } as CSSProperties}
        >
          <DocsNav nav={nav} currentPath={currentPath} onNavigate={() => setOpen(false)} />
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
}
