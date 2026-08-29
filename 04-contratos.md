# 4. Contratos / Ports

A fronteira entre estrutura e negócio é definida por **tipos** (ports), todos em `src/ampla-ui/types.ts`. A estrutura depende só deles.

## `StepDef<TContext>` — passo de wizard

```ts
interface StepDef<TContext> {
  id: string;
  label: string;
  icon?: ReactNode;
  render: (ctx: TContext) => ReactNode;          // domínio desenha o corpo
  validate?: (ctx: TContext) => string | null;    // domínio valida
  visible?: (ctx: TContext) => boolean;           // domínio condiciona
}
```

## `GridColumn<TRow>` — coluna de grid/lista

```ts
interface GridColumn<TRow> {
  key: string;
  header: string;
  cell: (row: TRow) => ReactNode;          // domínio formata (ex.: moeda)
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortValue?: (row: TRow) => string | number;
}
```

## `PaymentMethodOption` / `PaymentSelection`

```ts
interface PaymentMethodOption {
  id: string;            // 'PIX' vem do domínio, não da estrutura
  label: string;
  icon?: ReactNode;
  installments: number[];
  badge?: string;
}
interface PaymentSelection { methodId: string; installments: number; }
```

## Regra de ouro

> A estrutura **nunca** importa `lucide-react`, `formatters`, nem tipos de domínio (`Client`, `Order`). Ela só importa `./types`.

Se a estrutura precisar de um ícone ou de formatação, **recebe como prop** (`icon?: ReactNode`, `cell: (row) => ReactNode`). Isso garante que `src/ampla-ui/` seja testável e reutilizável em qualquer domínio.
