import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildNav } from '@/lib/nav';

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://payable.akira-io.com';
  const docs = await getCollection('docs');
  const nav = buildNav(docs);
  const descriptions = new Map(docs.map((doc) => [doc.id, doc.data.description]));

  const sections = nav
    .map((group) => {
      const items = group.items
        .map((item) => {
          const description = descriptions.get(item.id);
          return `- [${item.title}](${base}${item.href})${description ? `: ${description}` : ''}`;
        })
        .join('\n');
      return `## ${group.label}\n\n${items}`;
    })
    .join('\n\n');

  const body = `# payable

> Framework, provider, storage, and queue agnostic billing engine for Node.js. The core owns checkout, subscriptions, invoices, charges, webhooks, and reconciliation while you bring Stripe, Paddle, or SISP, your storage, and your framework.

${sections}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
