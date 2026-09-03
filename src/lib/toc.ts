export interface HeadingPosition {
  id: string;
  top: number;
}

export function findActiveHeading(
  headings: HeadingPosition[],
  scrollY: number,
  offset: number,
): string | undefined {
  if (headings.length === 0) return undefined;

  const readingLine = scrollY + offset;
  let active = headings[0].id;
  for (const heading of headings) {
    if (heading.top > readingLine) break;
    active = heading.id;
  }
  return active;
}
