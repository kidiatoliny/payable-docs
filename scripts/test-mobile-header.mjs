import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const header = await readFile(new URL('../src/components/Header.astro', import.meta.url), 'utf8');
const search = await readFile(new URL('../src/components/Search.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles/docs.css', import.meta.url), 'utf8');

assert.match(header, /class="docs-header"/);
assert.match(header, /class="docs-header-main"/);
assert.match(header, /class="docs-brand"/);
assert.match(header, /github\.com\/akira-io\/payable/);
assert.match(header, /<span>GitHub<\/span>/);
assert.doesNotMatch(header, /docs-beta-bar/);
assert.match(styles, /@media \(max-width: 640px\)/);
assert.match(styles, /\.docs-brand small, \.docs-github-link span \{ display: none; \}/);
assert.match(search, /w-9.*md:w-64/s);
assert.match(search, /hidden.*md:block/s);
assert.match(search, /hidden.*md:inline/s);
