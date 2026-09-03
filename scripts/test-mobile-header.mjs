import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const header = await readFile(new URL('../src/components/Header.astro', import.meta.url), 'utf8');
const search = await readFile(new URL('../src/components/Search.tsx', import.meta.url), 'utf8');
assert.match(header, /class="app-bar/);
assert.match(header, /class="app-bar-inner/);
assert.match(header, /class="app-bar-brand/);
assert.doesNotMatch(header, />\s*Docs\s*<\/span>/);
assert.match(header, /github\.com\/akira-io\/payable/);
assert.match(header, /aria-label="View source on GitHub"/);
assert.doesNotMatch(header, />\s*GitHub\s*<\/span>/);
assert.doesNotMatch(header, /Beta documentation\./);
assert.match(search, /variant="ghost"/);
assert.match(search, /size="icon"/);
