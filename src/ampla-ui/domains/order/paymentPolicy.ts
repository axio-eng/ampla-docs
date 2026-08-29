// src/ampla-ui/domains/order/paymentPolicy.ts
// NEGÓCIO — formas de pagamento e regras (PIX, Cartão, Boleto, crédito ERP).
// Toda a regra que hoje está hardcoded em OrderStepper.tsx vive aqui.
// A estrutura PaymentSelector só recebe `methods` e `canUseInstallments`.

import type { PaymentMethodOption, PaymentSelection } from '../../types';
import type { OrderContext } from './orderPolicy';

// Lista de métodos — mudar/add "Pix Parcelado" é só editar este array.
export function paymentMethods(): PaymentMethodOption[] {
  return [
    { id: 'PIX', label: 'PIX', badge: 'Aprovação Imediata', installments: [1] },
    { id: 'CARTAO_CREDITO', label: 'Cartão de Crédito/Débito', badge: '1x a 12x', installments: [1, 2, 3, 4, 6, 12] },
    { id: 'BOLETO_30_60_90', label: 'Boleto / Faturado ERP', badge: 'Crédito ERP', installments: [1, 2, 3] },
  ];
}

// Regra de crédito: domínio decide se a parcela é permitida.
// (ex.: saldo de crédito do cliente — valor hipotético)
export function canUseInstallments(_methodId: string, installments: number): string | null {
  const creditoLivre = 5000;
  if (installments > 3 && creditoLivre < 1000) {
    return 'Crédito ERP insuficiente para este prazo.';
  }
  return null;
}

// Detalhe de PIX (QR Code Copia-e-Cola) — REGRA DE NEGÓCIO, renderizada no slot do domínio.
export function PIX_DETAIL(ctx: OrderContext) {
  if (ctx.payment?.methodId !== 'PIX') return null;
  const code = `00020126580014br.gov.bcb.pix0136ampla-erp-${Math.random().toString(36).slice(2, 10)}5405${ctx.total.toFixed(2)}`;
  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30">
      <p className="text-xs font-bold uppercase text-emerald-400">QR Code PIX (BACEN)</p>
      <p className="text-lg font-extrabold text-white">{ctx.total.toFixed(2)}</p>
      <code className="block mt-2 text-[10px] text-slate-400 break-all">{code}</code>
    </div>
  );
}

// Efeito de conclusão de pagamento — sem estar no componente.
export function commitPayment(sel: PaymentSelection) {
  return { committed: true, ...sel };
}
