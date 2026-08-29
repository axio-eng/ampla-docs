// src/ampla-ui/StepFlow.tsx
// ESTRUTURA — wizard genérico. Não sabe que é "pedido", "cliente" ou "pagamento".
// Recebe os passos como dados (StepDef[]) e delega todo o conteúdo/validação ao domínio.

import { useState, useMemo, type ReactNode } from 'react';
import type { StepDef } from './types';

export interface StepFlowProps<TContext> {
  steps: StepDef<TContext>[];
  context: TContext;
  initialStep?: number;
  onStepChange?: (index: number) => void;
  onComplete?: (ctx: TContext) => void | Promise<void>;
  /** Renderiza a navegação (Voltar/Próximo) — estrutura cuida, domínio só fornece labels. */
  labels?: { back: string; next: string; finish: string };
}

export function StepFlow<TContext>({
  steps,
  context,
  initialStep = 0,
  onStepChange,
  onComplete,
  labels = { back: '← Voltar', next: 'Próximo →', finish: 'Concluir' },
}: StepFlowProps<TContext>): ReactNode {
  const visibleSteps = useMemo(
    () => steps.filter((s) => (s.visible ? s.visible(context) : true)),
    [steps, context],
  );
  const [current, setCurrent] = useState(initialStep);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const step = visibleSteps[current];
  const isLast = current === visibleSteps.length - 1;

  const go = (next: number) => {
    setError(null);
    setCurrent(next);
    onStepChange?.(next);
  };

  const handleNext = async () => {
    const err = step.validate?.(context) ?? null;
    if (err) {
      setError(err);
      return;
    }
    if (isLast) {
      await onComplete?.(context);
      setDone(true);
    } else {
      go(current + 1);
    }
  };

  if (done) {
    return (
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center">
        <p className="font-bold text-emerald-300">Concluído</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stepper header — estrutura pura, ícones vêm do domínio */}
      <div className="flex gap-2">
        {visibleSteps.map((s, i) => {
          const isCurrent = i === current;
          const isDone = i < current;
          return (
            <button
              key={s.id}
              type="button"
              disabled={i > current}
              onClick={() => i < current && go(i)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all
                ${isDone ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isCurrent ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'}`}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Corpo — 100% delegado ao domínio */}
      <div className="p-6 rounded-2xl border border-slate-700/80 bg-slate-800/80">
        {step.render(context)}
      </div>

      {error && <p className="text-xs font-bold text-rose-400">{error}</p>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(current - 1)}
          disabled={current === 0}
          className="px-3.5 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40"
        >
          {labels.back}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          {isLast ? labels.finish : labels.next}
        </button>
      </div>
    </div>
  );
}
