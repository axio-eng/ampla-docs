// src/ampla-ui/DataGrid.tsx
// ESTRUTURA — tabela genérica (grid). Colunas, ordenação e seleção são injetadas.
// Não sabe o significado das colunas nem formata a moeda (quem formata é a coluna.cell do domínio).

import { useMemo, useState, type ReactNode } from 'react';
import type { GridColumn } from './types';

export interface DataGridProps<TRow> {
  rows: TRow[];
  columns: GridColumn<TRow>[];
  rowKey: (row: TRow) => string;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
}

export function DataGrid<TRow>({
  rows,
  columns,
  rowKey,
  selectable = false,
  selectedKeys,
  onSelectionChange,
}: DataGridProps<TRow>): ReactNode {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      return (va > vb ? 1 : va < vb ? -1 : 0) * sort.dir;
    });
  }, [rows, columns, sort]);

  const toggleSort = (col: GridColumn<TRow>) => {
    if (!col.sortable) return;
    setSort((s) =>
      s?.key === col.key ? { key: col.key, dir: (s.dir * -1) as 1 | -1 } : { key: col.key, dir: 1 },
    );
  };

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider">
          <tr>
            {selectable && <th className="py-2.5 px-3" />}
            {columns.map((c) => (
              <th
                key={c.key}
                onClick={() => toggleSort(c)}
                className={`py-2.5 px-3 ${c.align === 'right' ? 'text-right' : ''} ${c.sortable ? 'cursor-pointer' : ''}`}
              >
                {c.header}{c.sortable ? (sort?.key === c.key ? (sort.dir === 1 ? ' ▲' : ' ▼') : ' ⇅') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-200">
          {sorted.map((row) => {
            const key = rowKey(row);
            const isSel = selectedKeys?.has(key);
            return (
              <tr key={key} className={isSel ? 'bg-indigo-600/10' : ''}>
                {selectable && (
                  <td className="py-2.5 px-3">
                    <input
                      type="checkbox"
                      checked={Boolean(isSel)}
                      onChange={() => {
                        const next = new Set(selectedKeys ?? []);
                        isSel ? next.delete(key) : next.add(key);
                        onSelectionChange?.(next);
                      }}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-2.5 px-3 ${c.align === 'right' ? 'text-right' : ''} ${c.align === 'center' ? 'text-center' : ''}`}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
