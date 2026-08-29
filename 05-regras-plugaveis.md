# 5. Regras de Negócio Plugáveis

O negócio não some — ele **sai do componente e vira política**. Há três formas de plugar regra na estrutura:

## 1. Via dados (props)

O domínio passa listas e opções prontas:

```ts
<PaymentSelector
  methods={paymentMethods()}   // ['PIX','CARTAO','BOLETO'] definido em paymentPolicy
  ...
/>
```

Adicionar "Pix Parcelado" = editar `paymentMethods()`, **não** o componente.

## 2. Via funções (callbacks)

Validação e efeitos são funções do domínio:

```ts
<PaymentSelector
  canUseInstallments={canUseInstallments}   // regra de crédito ERP
/>
<StepFlow
  steps={orderSteps(ctx)}                    // passos como dados
  onComplete={(c) => completeOrder(c)}       // efeito canônico, sem ERP no componente
/>
```

## 3. Via render-slot

Conteúdo que só o negócio sabe desenhar (QR Code PIX, DANFE) vai num slot:

```ts
renderDetail={(sel) => sel.methodId === 'PIX' ? <PixQrCode total={sel.total}/> : null}
```

## Onde a regra vive

```
src/ampla-ui/domains/<domínio>/
  ├─ <domain>Policy.ts     # regras, listas, validações
  └─ <Domain>Wizard.tsx    # composição (estrutura + policy) — o único arquivo ciente do domínio
```

Outros domínios reusam a **mesma** `StepFlow`/`DataGrid`/`PaymentSelector` sem tocar na estrutura. Ex.: um `domains/devolucao/` poderia reaproveitar `StepFlow` com passos diferentes e um `PaymentSelector` com métodos de estorno.
