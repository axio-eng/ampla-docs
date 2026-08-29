// src/ampla-ui/domains/order/OrderWizard.tsx
// COMPOSIÇÃO — aqui o NEGÓCIO (policy) é plugado na ESTRUTURA (StepFlow/PaymentSelector).
// Este é o ÚNICO arquivo que conhece "pedido". A estrutura segue reutilizável.

import { useState } from 'react';
import { StepFlow } from '../../StepFlow';
import { PaymentSelector } from '../../PaymentSelector';
import { orderSteps, completeOrder, type OrderContext } from './orderPolicy';
import { paymentMethods, canUseInstallments } from './paymentPolicy';

export function OrderWizard() {
  const [ctx, setCtx] = useState<OrderContext>({
    clientName: null,
    itemsCount: 0,
    total: 0,
    payment: null,
    signed: false,
  });

  // Injeta o PaymentSelector no passo "pagamento" via render do domínio.
  const steps = orderSteps(ctx).map((s) =>
    s.id === 'pagamento'
      ? {
          ...s,
          render: () => (
            <PaymentSelector
              methods={paymentMethods()}
              value={ctx.payment}
              onChange={(p) => setCtx((c) => ({ ...c, payment: p }))}
              canUseInstallments={canUseInstallments}
            />
          ),
        }
      : s,
  );

  return (
    <StepFlow
      steps={steps}
      context={ctx}
      onComplete={(c) => console.log('Pedido concluído:', completeOrder(c))}
    />
  );
}
