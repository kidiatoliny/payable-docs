import { useCallback, useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
} from '@akira-io/ui';

interface Result {
  url: string;
  title: string;
  excerpt: string;
}

interface PagefindModule {
  search: (query: string) => Promise<{ results: { data: () => Promise<RawResult> }[] }>;
  options?: (opts: Record<string, unknown>) => Promise<void>;
}

interface RawResult {
  url: string;
  excerpt: string;
  meta: { title?: string };
}

let pagefind: PagefindModule | null = null;

async function loadPagefind(): Promise<PagefindModule | null> {
  if (pagefind) return pagefind;
  try {
    const path = '/pagefind/pagefind.js';
    const mod = (await import(/* @vite-ignore */ path)) as PagefindModule;
    await mod.options?.({});
    pagefind = mod;
    return mod;
  } catch {
    return null;
  }
}

function normalizeUrl(url: string): string {
  return url.replace(/\.html$/, '').replace(/\/index$/, '/');
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [ready, setReady] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const engine = await loadPagefind();
    if (!engine) {
      setReady(false);
      return;
    }
    const search = await engine.search(value);
    const data = await Promise.all(search.results.slice(0, 8).map((item) => item.data()));
    setResults(
      data.map((entry) => ({
        url: normalizeUrl(entry.url),
        title: entry.meta.title ?? entry.url,
        excerpt: entry.excerpt,
      })),
    );
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => runSearch(query), 140);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, runSearch]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-label="Search documentation"
        title="Search"
        onClick={() => setOpen(true)}
        className="w-9 shrink-0 justify-center px-0 text-muted-foreground md:w-64 md:justify-start md:px-3"
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="hidden flex-1 text-left md:block">Search</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 font-mono text-[11px] md:inline">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog title="Search documentation" open={open} onOpenChange={setOpen}>
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search documentation..." />
        <CommandList className="min-h-72 p-2">
          {!query.trim() && (
            <CommandGroup heading="Popular topics">
              <div className="px-2 pb-2 text-sm text-muted-foreground">
                Find implementation guides, provider setup, API concepts, and production runbooks.
              </div>
              {[
                ['Checkout', '/features/09-checkout'],
                ['Subscriptions', '/features/10-subscriptions'],
                ['Webhooks', '/features/13-webhooks'],
                ['Payment providers', '/integrations/17-providers'],
              ].map(([label, url]) => (
                <CommandItem
                  key={url}
                  value={label}
                  onSelect={() => { window.location.href = url; }}
                >
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!ready && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Search index builds with the production site.
            </div>
          )}
          {ready && query.trim() && results.length === 0 && (
            <CommandEmpty>No results for "{query}".</CommandEmpty>
          )}
          {results.map((result) => (
            <CommandItem
              key={result.url}
              value={result.url}
              onSelect={() => {
                window.location.href = result.url;
              }}
            >
              <span className="font-medium text-foreground">{result.title}</span>
              <span
                className="line-clamp-2 text-xs text-muted-foreground [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-primary"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
