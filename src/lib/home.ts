export interface IconCard {
  title: string;
  description: string;
  path: string;
}

export interface DocCard extends IconCard {
  href: string;
}

export const heroCode = [
  `<span class="text-primary">import</span> { createPayable, Money, StripeProvider } <span class="text-primary">from</span> <span class="text-accent-foreground">'@akira-io/payable'</span>;`,
  ``,
  `<span class="text-primary">const</span> payable = createPayable({`,
  `  providers: {`,
  `    stripe: <span class="text-primary">new</span> StripeProvider({`,
  `      secretKey: process.env.STRIPE_SECRET_KEY!,`,
  `      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,`,
  `    }),`,
  `  },`,
  `});`,
  ``,
  `<span class="text-primary">const</span> session = <span class="text-primary">await</span> payable`,
  `  .customer(billable)`,
  `  .newSubscription(<span class="text-accent-foreground">'default'</span>)`,
  `  .price(<span class="text-accent-foreground">'price_pro_monthly'</span>)`,
  `  .trialDays(<span class="text-accent-foreground">14</span>)`,
  `  .checkout({ successUrl, cancelUrl });`,
].join('\n');

export const features: IconCard[] = [
  {
    title: 'Provider agnostic',
    description:
      'Stripe and Paddle behind one PaymentProvider contract. Application code never imports a provider SDK.',
    path: 'M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  },
  {
    title: 'Float-free money',
    description:
      'Every amount is a Money value object in minor units, backed by Dinero.js. Monetary logic never touches floats.',
    path: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
  {
    title: 'Webhooks, end to end',
    description:
      'Verify signatures, normalize, dedupe, process async, reconcile local state, and replay provider events.',
    path: 'M4 4v6h6M20 20v-6h-6M20 8a8 8 0 0 0-14-3M4 16a8 8 0 0 0 14 3',
  },
  {
    title: 'Reliable by default',
    description:
      'Idempotency on by default, an immutable audit log, and a transactional outbox for at-least-once delivery.',
    path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
  {
    title: 'Your storage and queue',
    description:
      'Knex storage with migrate(db), plus synchronous or BullMQ queue drivers. The core depends on neither.',
    path: 'M21 5c0 1.66-4 3-9 3S3 6.66 3 5s4-3 9-3 9 1.34 9 3zM3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3',
  },
  {
    title: 'HTTP adapters',
    description:
      'Express, Fastify, and NestJS, each on its own subpath export. Mount the routes into the stack you already run.',
    path: 'M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5',
  },
];

export const integrations = ['Stripe', 'Paddle', 'SISP', 'Knex', 'BullMQ', 'Express', 'Fastify', 'NestJS'];

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
