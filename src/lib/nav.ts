export interface DocEntryLike {
  id: string;
  data: { title: string; sidebar?: { order?: number } };
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

function orderOf(entry: DocEntryLike): number {
  if (typeof entry.data.sidebar?.order === 'number') return entry.data.sidebar.order;
  const match = entry.id.match(/(\d+)/);
  return match ? Number(match[1]) : 999;
}

function dirOf(id: string): string {
  return id.includes('/') ? id.split('/')[0] : '';
}

const GROUPS: { label: string; match: (dir: string, order: number) => boolean }[] = [
  { label: 'Start here', match: (dir, order) => dir === '' && order <= 4 },
  { label: 'Domain', match: (dir) => dir === 'domain' },
  { label: 'Features', match: (dir) => dir === 'features' },
  { label: 'Integrations', match: (dir) => dir === 'integrations' },
  { label: 'Persistence', match: (dir) => dir === 'persistence' },
  { label: 'Adapters', match: (dir) => dir === 'adapters' },
  { label: 'Operations and reference', match: (dir, order) => dir === '' && order >= 25 },
];

export function placeExamplesAfterReference(groups: NavGroup[]): NavGroup[] {
  const referenceIndex = groups.findIndex(({ label }) => label === 'Reference');
  const examplesIndex = groups.findIndex(({ label }) => label === 'Examples');

  if (referenceIndex === -1 || examplesIndex === -1) return groups;
  if (examplesIndex === referenceIndex + 1) return groups;

  const examplesGroup = groups[examplesIndex];
  const groupsWithoutExamples = groups.filter((_, index) => index !== examplesIndex);
  const normalizedReferenceIndex = groupsWithoutExamples.findIndex(
    ({ label }) => label === 'Reference',
  );
  const insertionIndex = normalizedReferenceIndex + 1;

  return [
    ...groupsWithoutExamples.slice(0, insertionIndex),
    examplesGroup,
    ...groupsWithoutExamples.slice(insertionIndex),
  ];
}

export function buildNav(entries: DocEntryLike[]): NavGroup[] {
  const sorted = [...entries].sort((a, b) => orderOf(a) - orderOf(b));
  const groups = GROUPS.map((group) => ({
    label: group.label,
    items: sorted
      .filter((entry) => group.match(dirOf(entry.id), orderOf(entry)))
      .map((entry) => ({ id: entry.id, title: entry.data.title, href: `/${entry.id}` })),
  })).filter((group) => group.items.length > 0);

  return placeExamplesAfterReference(groups);
}

export function flattenNav(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((group) => group.items);
}
