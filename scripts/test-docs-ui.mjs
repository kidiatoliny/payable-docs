import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [layout, header, sidebar, landingHeader, landingHero] = await Promise.all([
  read('../src/layouts/DocLayout.astro'),
  read('../src/components/Header.astro'),
  read('../src/components/Sidebar.astro'),
  read('../src/components/landing/LandingHeader.astro'),
  read('../src/components/landing/LandingHero.astro'),
]);

assert.match(layout, /<html lang="en">/);
assert.doesNotMatch(layout, /<html[^>]*class="dark"/);
assert.doesNotMatch(layout, /@\/styles\/docs\.css/);
assert.match(header, /sticky top-0 z-40/);
assert.match(header, /ThemeToggle/);
assert.match(header, /github\.com\/akira-io\/payable/);
assert.match(sidebar, /sticky top-\[52px\]/);
assert.match(landingHeader, /href="\/03-getting-started">Docs</);
assert.match(landingHero, /href="\/03-getting-started">Read the docs</);
