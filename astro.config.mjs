import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

export default defineConfig({
  integrations: [
    mermaid({ theme: 'default', autoTheme: true }),
    starlight({
      title: '@akira-io/payable',
      description: 'Documentation for the framework-agnostic Node.js billing engine.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/akira-io/payable' },
      ],
      editLink: {
        baseUrl: 'https://github.com/akira-io/payable/edit/main/docs/',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            '01-overview',
            '02-architecture',
            '03-getting-started',
            '04-configuration',
          ],
        },
        { label: 'Domain', autogenerate: { directory: 'domain' } },
        { label: 'Features', autogenerate: { directory: 'features' } },
        { label: 'Integrations', autogenerate: { directory: 'integrations' } },
        { label: 'Persistence', autogenerate: { directory: 'persistence' } },
        { label: 'Adapters', autogenerate: { directory: 'adapters' } },
        {
          label: 'Operations and reference',
          items: [
            '25-data-flows',
            '26-security',
            '27-development',
            '28-operations',
            '29-troubleshooting',
            '30-faq',
          ],
        },
      ],
    }),
  ],
});
