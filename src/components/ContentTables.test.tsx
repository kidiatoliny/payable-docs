import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentTables } from './ContentTables';

describe('ContentTables', () => {
  it('upgrades Markdown tables to the Akira Card and Table primitives', async () => {
    const article = document.createElement('article');
    article.innerHTML = '<table><thead><tr><th>Prop</th></tr></thead><tbody><tr><td>size</td></tr></tbody></table>';
    document.body.append(article);

    render(<ContentTables />);

    await waitFor(() => expect(article.querySelector('[data-slot="card"]')).toBeInTheDocument());
    expect(article.querySelector('table')).toBeInTheDocument();
    expect(article.textContent).toContain('size');
  });
});
