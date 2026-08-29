// src/ampla-ui/types.ts
// PORTS — contratos que ligam a estrutura (UI kit) ao domínio (negócio).
// A estrutura só conhece estes tipos. Nunca conhece PIX, Boleto, pedido ou cliente.

import type { ReactNode } from 'react';

/** Um passo genérico de um wizard. O conteúdo é decidido pelo domínio. */
export interface StepDef<TContext> {
  id: string;
  label: string;
  /** Ícone opcional, recebido pronto (componente) — estrutura não importa lucide. */
  icon?: ReactNode;
  /** Renderiza o corpo do passo. Recebe o contexto compartilhado do wizard. */
  render: (ctx: TContext) => ReactNode;
  /** Validação antes de avançar. Retorna erro (string) ou null se ok. */
  validate?: (ctx: TContext) => string | null;
  /** Se false, o passo não aparece (domínio controla condições). */
  visible?: (ctx: TContext) => boolean;
}

/** Coluna genérica de um DataGrid. */
export interface GridColumn<TRow> {
  key: string;
  header: string;
  /** Como renderizar a célula — domínio decide (ex.: formatar moeda). */
  cell: (row: TRow) => ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortValue?: (row: TRow) => string | number;
}

/** Método de pagamento genérico — sem saber o que é. */
export interface PaymentMethodOption {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Parcelas permitidas para este método (1 = à vista). */
  installments: number[];
  badge?: string;
}

/** Resultado da seleção de pagamento, agnóstico. */
export interface PaymentSelection {
  methodId: string;
  installments: number;
}
