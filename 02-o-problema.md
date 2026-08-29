# 2. O Problema (acoplamento atual)

Em `ampla-vendas/src/components/OrderStepper.tsx` (e `OrdersList.tsx`, `ProductCatalog.tsx`), a estrutura e o negócio estão **no mesmo arquivo**. Exemplos concretos:

## Wizard acoplado ao domínio de vendas

`OrderStepper.tsx` define os passos *hardcoded* no negócio:

```tsx
const steps = [
  { num: 1, label: '1. Cliente', icon: User },
  { num: 2, label: '2. Itens', icon: ShoppingBag },
  { num: 3, label: '3. Pagamento', icon: CreditCard },
  { num: 4, label: '4. Assinatura & Anexos', icon: PenTool },
  { num: 5, label: '5. Conferir', icon: CheckCircle },
];
```

O componente *sabe* que o passo 3 é pagamento e o passo 4 é assinatura. Para um fluxo de "devolução" ou "cadastro de cliente", esse wizard não serve — ele é um *pedido de vendas*, não um *wizard*.

## Pagamento acoplado a PIX/Boleto/ERP

O seletor de forma de pagamento tem as opções escritas no código (`OrderStepper.tsx` ~linha 767):

```tsx
<button onClick={() => { setPaymentMethod('PIX'); setInstallments(1); }}>PIX QR Code</button>
<button onClick={() => setPaymentMethod('CARTAO_CREDITO')}>Cartão</button>
<button onClick={() => { setPaymentMethod('BOLETO_30_60_90'); setInstallments(3); }}>Boleto</button>
```

E o QR Code PIX é montado *dentro* do componente:

```tsx
const pixCopyPasteCode = `00020126580014br.gov.bcb.pix...${totalOrder.toFixed(2)}...`;
```

Regra de negócio (formato do Pix Copia-e-Cola do BACEN) virou JSX.

## Grid acoplado a "pedido"

Em `OrdersList.tsx` e no resumo do `OrderStepper` (etapa 5), a tabela conhece colunas de pedido (`SKU`, `Produto/Serviço`, `Subtotal`) e formatação de moeda BRL *inline*.

## Consequência

Não dá para:
- reusar o wizard num segundo fluxo sem duplicar regra;
- trocar a lista de formas de pagamento (ex.: adicionar "Pix Parcelado") sem editar o componente;
- testar a estrutura isoladamente.

A solução está em [03-estrutura-desacoplada](/03-estrutura-desacoplada).
