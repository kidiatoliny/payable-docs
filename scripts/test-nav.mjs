import assert from 'node:assert/strict';
import { buildNav } from '../src/lib/nav.ts';

const labelsOf = (groups) => groups.map(({ label }) => label);

const groups = buildNav([
  { id: '27-data-flows', data: { title: 'Data Flows', sidebar: { order: 27 } } },
  {
    id: 'examples/35-stripe-checkout',
    data: { title: 'Stripe Checkout', sidebar: { order: 35 } },
  },
  {
    id: 'examples/36-multi-provider',
    data: { title: 'Multiple Payment Providers', sidebar: { order: 36 } },
  },
]);

assert.deepEqual(labelsOf(groups), ['Operations and reference', 'Examples']);
assert.deepEqual(
  groups[1]?.items.map(({ id }) => id),
  ['examples/35-stripe-checkout', 'examples/36-multi-provider'],
);
