import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@akira-io/ui';

type Mode = 'system' | 'light' | 'dark';
const ORDER: Mode[] = ['system', 'light', 'dark'];

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function apply(mode: Mode) {
  const dark = mode === 'dark' || (mode !== 'light' && prefersDark());
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Mode | null) ?? 'system';
    setMode(stored);
  }, []);

  useEffect(() => {
    if (mode === null) return;
    apply(mode);
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode]);

  function cycle() {
    const currentMode = mode ?? 'system';
    const next = ORDER[(ORDER.indexOf(currentMode) + 1) % ORDER.length];
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setMode(next);
  }

  const currentMode = mode ?? 'system';
  const label = currentMode === 'system' ? 'System theme' : currentMode === 'light' ? 'Light theme' : 'Dark theme';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="shrink-0 text-muted-foreground"
    >
      {currentMode === 'system' && <Monitor className="size-4" />}
      {currentMode === 'light' && <Sun className="size-4" />}
      {currentMode === 'dark' && <Moon className="size-4" />}
    </Button>
  );
}
