// src/ampla-ui/EntityList.tsx
// ESTRUTURA — lista genérica com busca, filtro e paginação.
// Não sabe que entidade é (cliente, produto, pedido...). Tudo é injetado.

import { useMemo, useState, type ReactNode } from 'react';
import type { GridColumn } from './types';

export interface EntityListProps<TRow> {
  rows: TRow[];
  columns: GridColumn<TRow>[];
  /** Placeholder da busca — string do domínio. */
  searchPlaceholder?: string;
  /** Como buscar: domínio diz o que comparar. */
  match: (row: TRow, query: string) => boolean;
  /** Filtros rápidos (chips) — domínio fornece id+label+predicate. */
  filters?: { id: string; label: string; predicate: (r: TRow) => boolean }[];
  pageSize?: number;
  emptyText?: string;
  onRowClick?: (row: TRow) => void;
}

export function EntityList<TRow>({
  rows,
  columns,
  searchPlaceholder = 'Buscar...',
  match,
  filters = [],
  pageSize = 10,
  emptyText = 'Nenhum item.',
  onRowClick,
}: EntityListProps<TRow>): ReactNode {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('TODOS');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const okQuery = !q || match(r, q);
      const f = filters.find((f) => f.id === activeFilter);
      const okFilter = !f || f.predicate(r);
      return okQuery && okFilter;
    });
  }, [rows, query, activeFilter, filters, match]);

  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(0); }}
        placeholder={searchPlaceholder}
        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm"
      />

      {filters.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto">
          {[{ id: 'TODOS', label: 'Todos', predicate: () => true }, ...filters].map((f) => (
            <button
              key={f.id}
              onClick={() => { setActiveFilter(f.id); setPage(0); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap
                ${activeFilter === f.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {pageRows.length === 0 ? (
        <p className="text-center py-8 text-slate-500 text-xs">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {pageRows.map((row, i) => (
            <div
              key={i}
              onClick={() => onRowClick?.(row)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/80 hover:border-slate-600 cursor-pointer flex items-center justify-between"
            >
              {columns.map((c) => (
                <div key={c.key} className="flex-1">
                  {i === 0 ? (
                    <p className="text-[10px] uppercase text-slate-500">{c.header}</p>
                  ) : null}
                  <div className={c.align === 'right' ? 'text-right' : ''}>{c.cell(row)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {filtered.length > pageSize && (
        <div className="flex justify-center gap-2 text-xs">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>←</button>
          <span className="text-slate-400">{page + 1} / {Math.ceil(filtered.length / pageSize)}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * pageSize >= filtered.length}>→</button>
        </div>
      )}
    </div>
  );
}
