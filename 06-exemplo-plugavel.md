# 6. Exemplo Plugável

Como o `OrderWizard` (domínio "Pedido de Venda") usa a estrutura desacoplada. Note: **nenhum primitivo sabe que é venda**.

```tsx
// src/ampla-ui/domains/order/OrderWizard.tsx
import { useState } from 'react';
import { StepFlow } from '../../StepFlow';
import { PaymentSelector } from '../../PaymentSelector';
import { orderSteps, completeOrder, type OrderContext } from './orderPolicy';
import { paymentMethods, canUseInstallments } from './paymentPolicy';

export function OrderWizard() {
  const [ctx, setCtx] = useState<OrderContext>({
    clientName: null, itemsCount: 0, total: 0, payment: null, signed: false,
  });

  const steps = orderSteps(ctx).map((s) =>
    s.id === 'pagamento'
      ? { ...s, render: () => (
          <PaymentSelector
            methods={paymentMethods()}
            value={ctx.payment}
            onChange={(p) => setCtx((c) => ({ ...c, payment: p }))}
            canUseInstallments={canUseInstallments}
          />) }
      : s,
  );

  return <StepFlow steps={steps} context={ctx} onComplete={(c) => completeOrder(c)} />;
}
```

## Antes vs Depois

| Aspecto | Antes (`OrderStepper.tsx`) | Depois (estrutura + policy) |
|---|---|---|
| Passos do wizard | Hardcoded no componente | `orderSteps(ctx)` — dado |
| Formas de pagamento | Botões JSX no componente | `paymentMethods()` — policy |
| QR Code PIX | String montada no JSX | `PIX_DETAIL(ctx)` — policy (render slot) |
| Validação de crédito | Inline no `handleCompleteOrder` | `canUseInstallments()` — policy |
| Reuso para "Devolução" | Copiar arquivo inteiro | Novo `domains/devolucao/` reusa `StepFlow` |

## Testabilidade

A estrutura pode ser testada sem negócio:

```tsx
render(<StepFlow steps={mockSteps} context={{}} />)   // sem PIX, sem cliente, sem ERP
```

E a policy pode ser testada sem React:

```ts
expect(canUseInstallments('BOLETO_30_60_90', 3)).toBeNull();
```
