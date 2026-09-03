export interface DocEntryLike {
  id: string;
  data: { title: string; sidebar?: { order?: number } };
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
}

export interface NavSubgroup {
  label: string;
  storageKey: string;
  items: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  groups: NavSubgroup[];
}

interface ProviderDefinition {
  label: string;
  pages: Array<{ id: string; title: string }>;
}

const PROVIDERS: ProviderDefinition[] = [
  { label: 'Stripe', pages: [
    { id: 'integrations/18-stripe', title: 'Provider' },
    { id: 'integrations/18a-stripe-treasury', title: 'Treasury' },
  ] },
  { label: 'Paddle', pages: [{ id: 'integrations/19-paddle', title: 'Provider' }] },
  { label: 'SISP', pages: [{ id: 'integrations/20-sisp', title: 'Provider' }] },
  { label: 'Trust My Travel', pages: [
    { id: 'integrations/20a-trust-my-travel', title: 'Provider' },
    { id: 'integrations/20c-trust-my-travel-credentials', title: 'Credentials' },
    { id: 'integrations/20b-trust-my-travel-test-certification', title: 'Test certification' },
  ] },
  { label: 'Revolut', pages: [
    { id: 'integrations/21-revolut', title: 'Provider' },
    { id: 'integrations/21a-revolut-disputes', title: 'Disputes' },
    { id: 'integrations/21b-revolut-payouts', title: 'Payouts' },
    { id: 'integrations/21c-revolut-webhook-management', title: 'Webhook Management' },
    { id: 'integrations/21d-revolut-business-treasury', title: 'Business Treasury' },
  ] },
];

const GROUPS: { label: string; match: (dir: string, order: number) => boolean }[] = [
  { label: 'Start here', match: (dir, order) => dir === '' && order <= 4 },
  { label: 'Domain', match: (dir) => dir === 'domain' },
  { label: 'Features', match: (dir) => dir === 'features' },
  { label: 'Integrations', match: (dir) => dir === 'integrations' },
  { label: 'Persistence', match: (dir) => dir === 'persistence' },
  { label: 'Adapters', match: (dir) => dir === 'adapters' },
  { label: 'Operations and reference', match: (dir, order) => dir === '' && order >= 25 },
  { label: 'Examples', match: (dir) => dir === 'examples' },
];

function orderOf(entry: DocEntryLike): number {
  if (typeof entry.data.sidebar?.order === 'number') return entry.data.sidebar.order * 1_000;
  const match = entry.id.match(/(?:^|\/)(\d+)([a-z]?)/);
  if (!match) return 999_000;
  const suffix = match[2] ? match[2].charCodeAt(0) - 96 : 0;
  return Number(match[1]) * 1_000 + suffix;
}

function dirOf(id: string): string {
  return id.includes('/') ? id.split('/')[0] : '';
}

function itemFrom(entry: DocEntryLike, title = entry.data.title): NavItem {
  return { id: entry.id, title, href: `/${entry.id}` };
}

function buildIntegrationGroup(entries: DocEntryLike[]): NavGroup {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const providerIds = new Set(PROVIDERS.flatMap(({ pages }) => pages.map(({ id }) => id)));
  const overviewIds = new Set(['integrations/17-providers', 'integrations/17a-treasury-providers']);

  return {
    label: 'Integrations',
    items: entries
      .filter((entry) => overviewIds.has(entry.id) || !providerIds.has(entry.id))
      .map((entry) => itemFrom(entry)),
    groups: PROVIDERS.map(({ label, pages }) => ({
      label,
      storageKey: `Integrations/${label}`,
      items: pages.flatMap(({ id, title }) => {
        const entry = byId.get(id);
        return entry ? [itemFrom(entry, title)] : [];
      }),
    })).filter(({ items }) => items.length > 0),
  };
}

export function buildNav(entries: DocEntryLike[]): NavGroup[] {
  const sorted = [...entries].sort((a, b) => orderOf(a) - orderOf(b) || a.id.localeCompare(b.id));
  return GROUPS.flatMap((group) => {
    const matches = sorted.filter((entry) => group.match(dirOf(entry.id), orderOf(entry) / 1_000));
    if (matches.length === 0) return [];
    if (group.label === 'Integrations') return [buildIntegrationGroup(matches)];
    return [{ label: group.label, items: matches.map((entry) => itemFrom(entry)), groups: [] }];
  });
}

export function flattenNav(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((group) => [
    ...group.items,
    ...group.groups.flatMap((subgroup) => subgroup.items),
  ]);
}

function pathOnly(value: string): string {
  const withoutHash = value.split('#', 1)[0];
  const pathname = withoutHash.startsWith('http') ? new URL(withoutHash).pathname : withoutHash;
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

export function isActivePath(href: string, currentPath: string): boolean {
  return pathOnly(href) === pathOnly(currentPath);
}
