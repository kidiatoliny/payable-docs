import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeBlocks } from './CodeBlocks';

describe('CodeBlocks', () => {
  it('upgrades Astro highlighted code to the Akira code block', async () => {
    const article = document.createElement('article');
    article.innerHTML = '<pre class="astro-code" data-language="ts"><code><span class="line">const value = 1;</span></code></pre>';
    document.body.append(article);

    render(<CodeBlocks />);

    await waitFor(() => expect(article.querySelector('[data-slot="code-block"]')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });
});
