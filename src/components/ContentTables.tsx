import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@akira-io/ui';

interface TableTarget {
  host: HTMLDivElement;
  source: HTMLTableElement;
  headers: string[];
  rows: string[][];
}

export function ContentTables() {
  const [targets, setTargets] = useState<TableTarget[]>([]);

  useEffect(() => {
    const next = Array.from(document.querySelectorAll<HTMLTableElement>('article table'))
      .filter((table) => !table.closest('[data-slot="table"]'))
      .map((source) => {
        const host = document.createElement('div');
        const headers = Array.from(source.querySelectorAll('thead th'), (cell) => cell.innerHTML);
        const rows = Array.from(source.querySelectorAll('tbody tr'), (row) =>
          Array.from(row.querySelectorAll('th, td'), (cell) => cell.innerHTML));
        source.replaceWith(host);
        return { host, source, headers, rows };
      });

    setTargets(next);
    return () => {
      for (const target of next) target.host.replaceWith(target.source);
    };
  }, []);

  return (
    <Fragment>
      {targets.map((target) => createPortal(
        <Card className="not-prose my-6 overflow-hidden py-0">
          <Table>
            {target.headers.length > 0 && (
              <TableHeader>
                <TableRow>
                  {target.headers.map((header, index) => (
                    <TableHead key={index} dangerouslySetInnerHTML={{ __html: header }} />
                  ))}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {target.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>,
        target.host,
      ))}
    </Fragment>
  );
}
