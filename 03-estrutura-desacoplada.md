# 3. A Estrutura Desacoplada

A estrutura básica vira um **UI kit agnóstico de domínio**. Cada primitivo recebe *o que* renderizar e *como* validar via props — nunca sabe do negócio.

## Os 4 primitivos

| Primivo | Responsabilidade (estrutura) | O que NÃO sabe |
|---|---|---|
| `StepFlow` | Orquestrar passos, navegação, estado de "done" | Quais passos, o que cada um faz |
| `EntityList` | Busca/filtro/paginação genérica sobre uma coleção | Que entidade é (cliente, produto…) |
| `DataGrid` | Tabela: colunas, ordenação, seleção, virtualização | Significado das colunas |
| `PaymentSelector` | Apresentar métodos, coletar escolha + parcelas | PIX/Boleto/ERP, regras de crédito |

## Exemplo: `StepFlow` (genérico)

```tsx
// Estrutura — não sabe que é "pedido"
<StepFlow
  steps={steps}                      // injetado pelo domínio
  initialStep={1}
  onStepChange={setStep}
  renderStep={(step) => step.render(context)}   // domínio decide o conteúdo
  onComplete={(data) => domainPolicy.complete(data)}
/>
```

O domínio fornece `steps` como **dados + render functions**, não como JSX hardcoded:

```ts
const steps: StepDef[] = orderPolicy.steps();   // vem da camada de política
```

## Exemplo: `PaymentSelector` (genérico)

```tsx
<PaymentSelector
  methods={paymentPolicy.methods()}        // [{id:'PIX', label:'PIX', installments:[1]}, ...]
  value={selection}
  onChange={setSelection}
  validateInstallments={paymentPolicy.canUseInstallments}
/>
```

O componente **nunca** escreve "PIX", "Boleto" ou monta QR Code. Quem sabe disso é `paymentPolicy`.

## Onde vive o código

A referência real (TypeScript/React, stack igual à do Ampla) está em:

```
ampla-docs/
└── src/ampla-ui/                 # a ESTRUTURA (genérica)
    ├── StepFlow.tsx
    ├── EntityList.tsx
    ├── DataGrid.tsx
    ├── PaymentSelector.tsx
    └── types.ts                  # os ports (contratos)
└── src/ampla-ui/domains/         # o NEGÓCIO plugado (exemplo)
    └── order/
        ├── orderPolicy.ts        # steps, validações, complete()
        └── paymentPolicy.ts      # métodos, parcelas, regras de crédito
```

Continua em [04-contratos](/04-contratos) e no código em `src/ampla-ui`.
