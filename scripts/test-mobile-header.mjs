import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const header = await readFile(new URL('../src/components/Header.astro', import.meta.url), 'utf8');
const search = await readFile(new URL('../src/components/Search.tsx', import.meta.url), 'utf8');
assert.match(header, /class="app-bar/);
assert.match(header, /class="app-bar-inner/);
assert.match(header, /class="app-bar-brand/);
assert.doesNotMatch(header, />\s*Docs\s*<\/span>/);
assert.match(header, /github\.com\/akira-io\/payable/);
assert.match(header, /<span class="hidden sm:inline">GitHub<\/span>/);
assert.doesNotMatch(header, /Beta documentation\./);
assert.match(search, /w-9.*md:w-64/s);
assert.match(search, /hidden.*md:block/s);
assert.match(search, /hidden.*md:inline/s);
