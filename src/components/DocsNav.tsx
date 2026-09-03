import { ChevronDown } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import type { ComponentProps } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  cn,
} from '@akira-io/ui';
import { useCollapsedGroup } from '@akira-io/ui/shells';
import type { NavGroup, NavItem, NavSubgroup } from '@/lib/nav';
import { isActivePath } from '@/lib/nav';

interface DocsNavProps {
  nav: NavGroup[];
  currentPath: string;
  onNavigate?: () => void;
}

const EMPTY_GROUPS: string[] = [];
const COLLAPSED_GROUPS_EVENT = 'payable-docs:collapsed-groups';
const COLLAPSED_GROUPS_KEY = 'akira-ui:collapsed-nav-groups';
let cachedRaw: string | null | undefined;
let cachedGroups = EMPTY_GROUPS;

function readCollapsedGroups(): string[] {
  const raw = window.localStorage.getItem(COLLAPSED_GROUPS_KEY);
  if (raw === cachedRaw) return cachedGroups;
  cachedRaw = raw;
  try {
    const value: unknown = raw === null ? [] : JSON.parse(raw);
    cachedGroups = Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    cachedGroups = EMPTY_GROUPS;
  }
  return cachedGroups;
}

function subscribeToCollapsedGroups(onStoreChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === COLLAPSED_GROUPS_KEY) onStoreChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(COLLAPSED_GROUPS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(COLLAPSED_GROUPS_EVENT, onStoreChange);
  };
}

function writeCollapsedGroups(groups: string[]): void {
  window.localStorage.setItem(COLLAPSED_GROUPS_KEY, JSON.stringify(groups));
  cachedRaw = undefined;
  window.dispatchEvent(new Event(COLLAPSED_GROUPS_EVENT));
}

function useDocsCollapsedGroups(): string[] {
  return useSyncExternalStore(subscribeToCollapsedGroups, readCollapsedGroups, () => EMPTY_GROUPS);
}

function GroupTrigger({ label, expanded, ...props }: {
  label: string;
  expanded: boolean;
} & Omit<ComponentProps<typeof SidebarGroupLabel>, 'children' | 'asChild'>) {
  return (
    <SidebarGroupLabel
      asChild
      className="w-full cursor-pointer justify-between"
      {...props}
    >
      <button type="button" aria-label={label} aria-expanded={expanded}>
        <span>{label}</span>
        <ChevronDown
          data-testid="collapse-icon"
          aria-hidden="true"
          className={cn('size-4 transition-transform', !expanded && '-rotate-90')}
        />
      </button>
    </SidebarGroupLabel>
  );
}

function TopLevelItem({ item, currentPath, onNavigate }: {
  item: NavItem;
  currentPath: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(item.href, currentPath);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} className="hover:bg-sidebar-accent-hover">
        <a href={item.href} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ProviderGroup({ subgroup, currentPath, onNavigate, collapsedGroups }: {
  subgroup: NavSubgroup;
  currentPath: string;
  onNavigate?: () => void;
  collapsedGroups: string[];
}) {
  const { open, setOpen } = useCollapsedGroup({
    group: subgroup.storageKey,
    collapsedGroups,
    onCollapsedChange: writeCollapsedGroups,
  });
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <GroupTrigger label={subgroup.label} expanded={open} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {subgroup.items.map((item) => {
            const active = isActivePath(item.href, currentPath);
            return (
              <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton asChild isActive={active} className="hover:bg-sidebar-accent-hover">
                  <a href={item.href} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
                    {item.title}
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DocsNavGroup({ group, currentPath, onNavigate, collapsedGroups }: {
  group: NavGroup;
  currentPath: string;
  onNavigate?: () => void;
  collapsedGroups: string[];
}) {
  const { open, setOpen } = useCollapsedGroup({
    group: group.label,
    collapsedGroups,
    onCollapsedChange: writeCollapsedGroups,
  });
  return (
    <SidebarGroup className="docs-nav-group px-2 py-0">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <GroupTrigger label={group.label} expanded={open} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <TopLevelItem key={item.id} item={item} currentPath={currentPath} onNavigate={onNavigate} />
              ))}
              {group.groups.map((subgroup) => (
                <SidebarMenuItem key={subgroup.storageKey} className="docs-provider-group">
                  <ProviderGroup
                    subgroup={subgroup}
                    currentPath={currentPath}
                    onNavigate={onNavigate}
                    collapsedGroups={collapsedGroups}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

export function DocsNav({ nav, currentPath, onNavigate }: DocsNavProps) {
  const collapsedGroups = useDocsCollapsedGroups();
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      {nav.map((group) => (
        <DocsNavGroup
          key={group.label}
          group={group}
          currentPath={currentPath}
          onNavigate={onNavigate}
          collapsedGroups={collapsedGroups}
        />
      ))}
    </nav>
  );
}
