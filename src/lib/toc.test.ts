import { describe, expect, it } from 'vitest';
import { findActiveHeading } from './toc';

const headings = [
  { id: 'preview', top: 120 },
  { id: 'usage', top: 420 },
  { id: 'api-reference', top: 820 },
];

describe('findActiveHeading', () => {
  it('keeps the first heading active before it reaches the reading line', () => {
    expect(findActiveHeading(headings, 0, 80)).toBe('preview');
  });

  it('selects the last heading that crossed the reading line', () => {
    expect(findActiveHeading(headings, 360, 80)).toBe('usage');
    expect(findActiveHeading(headings, 900, 80)).toBe('api-reference');
  });
});
