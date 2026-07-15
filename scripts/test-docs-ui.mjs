import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = async (path) => {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch {
    return '';
  }
};
const [layout, header, sidebar, mobileNav, themeToggle, toc, landingHeader, landingHero, seoHead, styles] = await Promise.all([
  read('../src/layouts/DocLayout.astro'),
  read('../src/components/Header.astro'),
  read('../src/components/Sidebar.astro'),
  read('../src/components/MobileNav.tsx'),
  read('../src/components/ThemeToggle.tsx'),
  read('../src/components/Toc.astro'),
  read('../src/components/landing/LandingHeader.astro'),
  read('../src/components/landing/LandingHero.astro'),
  read('../src/components/SeoHead.astro'),
  read('../src/styles/docs.css'),
]);

assert.match(layout, /<html lang="en" transition:name="root" transition:animate="none">/);
assert.match(layout, /import \{ ClientRouter \} from 'astro:transitions'/);
assert.match(layout, /<ClientRouter fallback="swap" \/>/);
assert.match(layout, /<Header[^>]*transition:persist="docs-header"/s);
assert.match(layout, /<Sidebar[^>]*transition:persist="docs-sidebar"/s);
assert.doesNotMatch(layout, /<html[^>]*class="dark"/);
assert.match(layout, /@\/styles\/docs\.css/);
assert.match(layout, /class="docs-page/);
assert.match(layout, /class="docs-shell/);
assert.match(header, /sticky top-0 z-40/);
assert.match(header, /ThemeToggle/);
assert.match(header, /class="app-bar/);
assert.match(header, /class="app-bar-inner/);
assert.match(header, /class="app-bar-brand/);
assert.match(header, /github\.com\/akira-io\/payable/);
assert.match(sidebar, /sticky top-\[52px\]/);
assert.match(sidebar, /docs-sidebar/);
assert.match(sidebar, /astro:after-swap/);
assert.match(mobileNav, /astro:after-swap/);
assert.match(themeToggle, /useState<Mode \| null>\(null\)/);
assert.match(themeToggle, /if \(mode === null\) return/);
assert.match(toc, /docs-toc/);
assert.match(landingHeader, /href="\/03-getting-started">Docs</);
assert.match(landingHero, /href="\/03-getting-started">Read the docs</);
assert.match(seoHead, /astro:before-swap/);
assert.match(seoHead, /event\.newDocument/);
assert.match(styles, /\.docs-page\s*\{[^}]*background:\s*#f5f5f7/s);
assert.match(styles, /\.dark \.docs-page\s*\{[^}]*background:\s*#111114/s);
assert.match(styles, /\.docs-article h1\s*\{/);
