// src/ampla-ui/PaymentSelector.tsx
// ESTRUTURA — seletor de forma de pagamento genérico.
// NÃO sabe o que é PIX, Boleto, Cartão ou ERP. Recebe métodos + regras como props.
// Quem monta QR Code / valida crédito é a camada de política (domínio).

import { useState, type ReactNode } from 'react';
import type { PaymentMethodOption, PaymentSelection } from './types';

export interface PaymentSelectorProps {
  methods: PaymentMethodOption[];
  value: PaymentSelection | null;
  onChange: (sel: PaymentSelection) => void;
  /** Domínio decide se uma parcela é válida (ex.: crédito disponível). */
  canUseInstallments?: (methodId: string, installments: number) => string | null;
  /** Slot opcional renderizado abaixo do método selecionado (ex.: QR Code PIX). */
  renderDetail?: (sel: PaymentSelection) => ReactNode;
}

export function PaymentSelector({
  methods,
  value,
  onChange,
  canUseInstallments,
  renderDetail,
}: PaymentSelectorProps): ReactNode {
  const [local, setLocal] = useState<PaymentSelection | null>(value);

  const select = (methodId: string) => {
    const method = methods.find((m) => m.id === methodId)!;
    const next: PaymentSelection = { methodId, installments: method.installments[0] ?? 1 };
    setLocal(next);
    onChange(next);
  };

  const setInstallments = (n: number) => {
    if (!local) return;
    const err = canUseInstallments?.(local.methodId, n) ?? null;
    if (err) return;
    const next = { ...local, installments: n };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => select(m.id)}
            className={`p-4 rounded-xl border text-left transition-all
              ${local?.methodId === m.id
                ? 'bg-indigo-600/20 border-indigo-500'
                : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'}`}
          >
            <div className="flex items-center justify-between mb-2">
              {m.icon}
              {m.badge && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">{m.badge}</span>}
            </div>
            <p className="text-sm font-bold text-white">{m.label}</p>
          </button>
        ))}
      </div>

      {local && methods.find((m) => m.id === local.methodId)!.installments.length > 1 && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700">
          <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Parcelas</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {methods.find((m) => m.id === local.methodId)!.installments.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setInstallments(n)}
                className={`p-3 rounded-xl border text-center transition-all
                  ${local.installments === n
                    ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                {n}x
              </button>
            ))}
          </div>
          {canUseInstallments?.(local.methodId, local.installments) && (
            <p className="text-xs font-bold text-rose-400 mt-2">
              {canUseInstallments(local.methodId, local.installments)!}
            </p>
          )}
        </div>
      )}

      {local && renderDetail?.(local)}
    </div>
  );
}
