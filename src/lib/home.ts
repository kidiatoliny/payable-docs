export interface DocCard {
  title: string;
  description: string;
  path: string;
  href: string;
}

export interface Capability {
  title: string;
  description: string;
}

export const features: Capability[] = [
  {
    title: 'Provider agnostic',
    description: 'Stripe and Paddle behind one contract. App code never imports a provider SDK.',
  },
  {
    title: 'Float-free money',
    description: 'Amounts live in minor units, backed by Dinero.js. Logic never touches floats.',
  },
  {
    title: 'Webhooks, end to end',
    description: 'Verify, normalize, dedupe, process, reconcile, and replay provider events.',
  },
  {
    title: 'Reliable by default',
    description: 'Idempotency on by default, an immutable audit log, and a transactional outbox.',
  },
  {
    title: 'Your storage and queue',
    description: 'Knex storage with migrate(db), plus a sync or BullMQ queue. Core depends on neither.',
  },
  {
    title: 'HTTP adapters',
    description: 'Express, Fastify, and NestJS, each on its own subpath export. Mount and go.',
  },
];

export const integrations = [
  'Stripe',
  'Paddle',
  'SISP',
  'Knex',
  'Prisma',
  'BullMQ',
  'Express',
  'Fastify',
  'NestJS',
];

export const docCards: DocCard[] = [
  {
    title: 'Overview',
    description: 'What the engine is, the problems it solves, and its boundaries.',
    href: '/01-overview',
    path: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  },
  {
    title: 'Architecture',
    description: 'The four layers, the dependency rule, and the zero-peer core guarantee.',
    href: '/02-architecture',
    path: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  },
  {
    title: 'Getting started',
    description: 'Install, wire createPayable, and run a first checkout.',
    href: '/03-getting-started',
    path: 'M5 12h14M13 5l7 7-7 7',
  },
  {
    title: 'Webhooks',
    description: 'Receive, verify, dedupe, process, reconcile, and replay provider events.',
    href: '/features/13-webhooks',
    path: 'M4 4v6h6M20 20v-6h-6M20 8a8 8 0 0 0-14-3M4 16a8 8 0 0 0 14 3',
  },
  {
    title: 'Providers',
    description: 'The PaymentProvider contract, capabilities, Stripe, and Paddle.',
    href: '/integrations/17-providers',
    path: 'M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  },
  {
    title: 'Configuration',
    description: 'Every PayableConfig field, its default, and what it unlocks.',
    href: '/04-configuration',
    path: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  },
];
