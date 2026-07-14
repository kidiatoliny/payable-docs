import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [layout, header, sidebar, styles, landingHeader, landingHero] = await Promise.all([
  read('../src/layouts/DocLayout.astro'),
  read('../src/components/Header.astro'),
  read('../src/components/Sidebar.astro'),
  read('../src/styles/docs.css'),
  read('../src/components/landing/LandingHeader.astro'),
  read('../src/components/landing/LandingHero.astro'),
]);

assert.match(layout, /@\/styles\/docs\.css/);
assert.match(layout, /<html lang="en">/);
assert.match(layout, /<SeoHead[^>]*forceLight/s);
assert.doesNotMatch(layout, /<html[^>]*class="dark"/);
assert.match(layout, /class="docs-page"/);
assert.match(layout, /class="docs-notice"/);
assert.match(layout, /Beta documentation\./);
assert.doesNotMatch(header, /docs-beta-bar/);
assert.match(header, /class="docs-header"/);
assert.match(header, /alt="payable"/);
assert.doesNotMatch(header, /ThemeToggle/);
assert.match(sidebar, /class="docs-sidebar"/);
assert.match(styles, /\.docs-page/);
assert.match(styles, /--docs-purple:\s*#6d28d9/);
assert.match(landingHeader, /href="\/03-getting-started">Docs</);
assert.match(landingHero, /href="\/03-getting-started">Read the docs</);
