import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = async (path) => {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch {
    return '';
  }
};
const [layout, header, sidebarShell, sidebar, mobileNav, themeToggle, toc, landingHeader, landingHero, seoHead, styles, globals, codeBlocks, contentTables] = await Promise.all([
  read('../src/layouts/DocLayout.astro'),
  read('../src/components/Header.astro'),
  read('../src/components/Sidebar.astro'),
  read('../src/components/Sidebar.tsx'),
  read('../src/components/MobileNav.tsx'),
  read('../src/components/ThemeToggle.tsx'),
  read('../src/components/Toc.astro'),
  read('../src/components/landing/LandingHeader.astro'),
  read('../src/components/landing/LandingHero.astro'),
  read('../src/components/SeoHead.astro'),
  read('../src/styles/docs.css'),
  read('../src/styles/globals.css'),
  read('../src/components/CodeBlocks.tsx'),
  read('../src/components/ContentTables.tsx'),
]);

assert.match(layout, /<html lang="en" transition:name="root" transition:animate="none">/);
assert.match(layout, /import \{ ClientRouter \} from 'astro:transitions'/);
assert.match(layout, /<ClientRouter fallback="swap" \/>/);
assert.match(layout, /<Header[^>]*transition:persist="docs-header"/s);
assert.match(layout, /<Sidebar nav=\{nav\} currentSlug=\{slug\} \/>/);
assert.doesNotMatch(layout, /<html[^>]*class="dark"/);
assert.match(layout, /@\/styles\/docs\.css/);
assert.match(layout, /class="docs-page/);
assert.match(layout, /class="docs-shell/);
assert.match(header, /sticky top-0 z-40/);
assert.match(header, /ThemeToggle/);
assert.match(header, /class="app-bar-inner/);
assert.match(header, /class="app-bar-brand/);
assert.match(header, /github\.com\/akira-io\/payable/);
assert.match(sidebarShell, /client:only="react"/);
assert.doesNotMatch(sidebarShell, /transition:persist/);
assert.match(sidebarShell, /w-72/);
assert.match(sidebar, /'--sidebar': 'var\(--background\)'/);
assert.match(sidebar, /astro:after-swap/);
assert.match(sidebar, /SidebarProvider/);
assert.match(sidebar, /@akira-io\/ui/);
assert.match(mobileNav, /astro:after-swap/);
assert.match(mobileNav, /SheetContent/);
assert.match(mobileNav, /@akira-io\/ui/);
assert.match(themeToggle, /useState<Mode \| null>\(null\)/);
assert.match(themeToggle, /if \(mode === null\) return/);
assert.match(toc, /aria-current/);
assert.match(toc, /findActiveHeading/);
assert.match(landingHeader, /href="\/03-getting-started">Docs</);
assert.match(landingHero, /href="\/03-getting-started">Read the docs</);
assert.match(seoHead, /astro:before-swap/);
assert.match(seoHead, /event\.newDocument/);
assert.doesNotMatch(styles, /#[0-9a-f]{3,8}/i);
assert.doesNotMatch(globals, /--font-sans\s*:/);
assert.match(codeBlocks, /@akira-io\/ui\/code/);
assert.match(contentTables, /Card/);
assert.match(contentTables, /TableHeader/);
