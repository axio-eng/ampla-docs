// src/ampla-ui/domains/order/orderPolicy.ts
// NEGÓCIO — política do domínio "Pedido de Venda".
// Aqui vivem as regras que hoje estão DENTRO de OrderStepper.tsx.
// A estrutura (StepFlow) não sabe de nada disso.

import type { StepDef } from '../../types';
import { PIX_DETAIL } from './paymentPolicy';

export interface OrderContext {
  clientName: string | null;
  itemsCount: number;
  total: number;
  payment: { methodId: string; installments: number } | null;
  signed: boolean;
}

// Passos definidos COMO DADOS — não como JSX hardcoded no componente.
export function orderSteps(ctx: OrderContext): StepDef<OrderContext>[] {
  return [
    {
      id: 'cliente',
      label: 'Cliente',
      render: () => null, // o app injeta o <ClientPicker/> aqui via composição
      validate: (c) => (c.clientName ? null : 'Selecione um cliente.'),
    },
    {
      id: 'itens',
      label: 'Itens',
      render: () => null,
      validate: (c) => (c.itemsCount > 0 ? null : 'Adicione ao menos um item.'),
    },
    {
      id: 'pagamento',
      label: 'Pagamento',
      render: (c) => PIX_DETAIL(c), // detalhe de PIX é regra de negócio, não da estrutura
      validate: (c) => (c.payment ? null : 'Escolha uma forma de pagamento.'),
    },
    {
      id: 'assinatura',
      label: 'Assinatura',
      render: () => null,
      validate: (c) => (c.signed ? null : 'Assinatura pendente.'),
    },
  ];
}

// Regra de conclusão: montar payload canônico (sem acoplar à estrutura de tela).
export function completeOrder(ctx: OrderContext) {
  return {
    type: 'ORDER',
    clientName: ctx.clientName,
    total: ctx.total,
    payment: ctx.payment,
    signed: ctx.signed,
  };
}
