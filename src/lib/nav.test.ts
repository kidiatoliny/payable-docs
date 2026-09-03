import { describe, expect, it } from 'vitest';
import { buildNav, flattenNav, isActivePath } from './nav';
import type { DocEntryLike } from './nav';

const entry = (id: string, title: string): DocEntryLike => ({ id, data: { title } });

const integrations = [
  entry('integrations/17-providers', 'Payment Providers'),
  entry('integrations/17a-treasury-providers', 'Treasury Providers'),
  entry('integrations/18-stripe', 'Stripe Provider'),
  entry('integrations/18a-stripe-treasury', 'Stripe Treasury Provider'),
  entry('integrations/19-paddle', 'Paddle Provider'),
  entry('integrations/20-sisp', 'SISP (Cabo Verde · vinti4)'),
  entry('integrations/20a-trust-my-travel', 'Trust My Travel'),
  entry('integrations/20b-trust-my-travel-test-certification', 'Trust My Travel Test certification'),
  entry('integrations/20c-trust-my-travel-credentials', 'Trust My Travel Credentials'),
  entry('integrations/21-revolut', 'Revolut Provider'),
  entry('integrations/21a-revolut-disputes', 'Revolut Disputes'),
  entry('integrations/21b-revolut-payouts', 'Revolut Payouts'),
  entry('integrations/21c-revolut-webhook-management', 'Revolut Webhook Management'),
  entry('integrations/21d-revolut-business-treasury', 'Revolut Business Treasury Provider'),
];

describe('buildNav', () => {
  it('builds the requested provider hierarchy and labels', () => {
    const group = buildNav(integrations)[0];

    expect(group.label).toBe('Integrations');
    expect(group.items.slice(0, 2).map((item) => item.title)).toEqual([
      'Payment Providers',
      'Treasury Providers',
    ]);
    expect(group.groups.map(({ label, items }) => [label, items.map(({ title }) => title)])).toEqual([
      ['Stripe', ['Provider', 'Treasury']],
      ['Paddle', ['Provider']],
      ['SISP', ['Provider']],
      ['Trust My Travel', ['Provider', 'Credentials', 'Test certification']],
      ['Revolut', ['Provider', 'Disputes', 'Payouts', 'Webhook Management', 'Business Treasury']],
    ]);
  });

  it('targets the upstream Trust My Travel credentials page', () => {
    const tmt = buildNav(integrations)[0].groups.find(({ label }) => label === 'Trust My Travel');

    expect(tmt?.items.find(({ title }) => title === 'Credentials')?.href).toBe(
      '/integrations/20c-trust-my-travel-credentials',
    );
  });

  it('flattens hierarchy in visual previous/next order without duplicates', () => {
    const flat = flattenNav(buildNav(integrations));

    expect(flat.map(({ title }) => title)).toEqual([
      'Payment Providers', 'Treasury Providers',
      'Provider', 'Treasury',
      'Provider',
      'Provider',
      'Provider', 'Credentials', 'Test certification',
      'Provider', 'Disputes', 'Payouts', 'Webhook Management', 'Business Treasury',
    ]);
    expect(new Set(flat.map(({ id }) => id)).size).toBe(flat.length);
  });

  it('keeps unmapped synced integration pages visible', () => {
    const group = buildNav([...integrations, entry('integrations/22-future', 'Future Provider')])[0];

    expect(group.items.at(-1)?.title).toBe('Future Provider');
  });
});

describe('isActivePath', () => {
  it.each([
    ['/integrations/20c-trust-my-travel-credentials', '/integrations/20c-trust-my-travel-credentials/', true],
    ['/integrations/20a-trust-my-travel#server-only-configuration', '/integrations/20a-trust-my-travel', true],
    ['/integrations/20a-trust-my-travel', '/integrations/20c-trust-my-travel-credentials', false],
  ])('compares %s with %s exactly', (href, currentPath, expected) => {
    expect(isActivePath(href, currentPath)).toBe(expected);
  });
});
