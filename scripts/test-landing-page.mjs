import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readSource(relativePath) {
  try {
    return await readFile(new URL(relativePath, import.meta.url), 'utf8');
  } catch {
    return '';
  }
}

const [page, header, hero, lifecycle, footer, styles] = await Promise.all([
  readSource('../src/pages/index.astro'),
  readSource('../src/components/landing/LandingHeader.astro'),
  readSource('../src/components/landing/LandingHero.astro'),
  readSource('../src/components/landing/EngineLifecycle.astro'),
  readSource('../src/components/landing/LandingFooter.astro'),
  readSource('../src/styles/landing.css'),
]);

assert.match(page, /<body class="landing-page">/);
assert.match(page, /import \{ ClientRouter \} from 'astro:transitions'/);
assert.match(page, /<ClientRouter \/>/);
assert.match(hero, /Provider-agnostic billing infrastructure for Node\.js/);
assert.match(hero, /One billing engine\./);
assert.match(hero, /Built for Node\.js\./);
assert.match(hero, /See how it works/);
assert.doesNotMatch(hero, /Any stack|pink|gradient-to/);
assert.match(header, /alt="Akira"/);
assert.match(header, /href="\/02-architecture">Architecture</);
assert.match(lifecycle, /class="step active"/);
assert.match(lifecycle, />Configure</);
assert.match(lifecycle, />Checkout</);
assert.match(lifecycle, />Process</);
assert.match(lifecycle, />Reconcile</);
assert.match(lifecycle, /class="engine-card"/);
assert.match(lifecycle, /class="checkout-scene"/);
assert.match(lifecycle, /class="webhook-scene"/);
assert.match(lifecycle, /class="reconcile-scene"/);
assert.doesNotMatch(lifecycle, /<code>const payable = createPayable\(\{/);
assert.match(styles, /prefers-reduced-motion: reduce/);
assert.match(styles, /\.hero h1\s*\{[^}]*max-width:\s*1050px[^}]*font-size:\s*clamp\(64px,\s*9vw,\s*132px\)[^}]*font-weight:\s*700/s);
assert.match(styles, /\.product-stage\s*\{[^}]*width:\s*min\(920px,\s*82vw\)[^}]*height:\s*460px[^}]*perspective:\s*1300px/s);
assert.match(styles, /\.motion-section\s*\{[^}]*height:\s*420vh/s);
assert.match(styles, /\.scene\s*\{[^}]*top:\s*38vh[^}]*right:\s*10vw[^}]*bottom:\s*5vh[^}]*left:\s*10vw/s);
assert.match(footer, /Provider-agnostic billing infrastructure built for Node\.js/);
assert.match(footer, /src={logo\.src}/);
assert.match(footer, /href="\/28-security"/);
assert.doesNotMatch(footer, /href="\/27-security"/);
assert.match(footer, /https:\/\/github\.com\/akira-io\/payable/);
