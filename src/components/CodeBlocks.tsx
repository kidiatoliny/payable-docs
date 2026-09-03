import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CodeBlock } from '@akira-io/ui/code';

interface CodeTarget {
  host: HTMLDivElement;
  source: HTMLPreElement;
  code: string;
  html: string;
  language?: string;
}

export function CodeBlocks() {
  const [targets, setTargets] = useState<CodeTarget[]>([]);

  useEffect(() => {
    const next = Array.from(document.querySelectorAll<HTMLPreElement>('article pre.astro-code'))
      .filter((pre) => !pre.closest('[data-slot="code-block"]'))
      .map((source) => {
        const host = document.createElement('div');
        source.replaceWith(host);
        return {
          host,
          source,
          code: source.textContent ?? '',
          html: source.outerHTML,
          language: source.dataset.language,
        };
      });

    setTargets(next);
    return () => {
      for (const target of next) target.host.replaceWith(target.source);
    };
  }, []);

  return (
    <Fragment>
      {targets.map((target) => createPortal(
        <CodeBlock
          className="not-prose my-6"
          code={target.code}
          html={target.html}
          language={target.language}
        />,
        target.host,
      ))}
    </Fragment>
  );
}
