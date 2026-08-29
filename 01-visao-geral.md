# 1. Visão Geral

A plataforma Ampla precisa de telas que aparecem em todo domínio: **listar**, **tabelar (grid)**, **passar por um wizard**, **capturar pagamento**. Essas são *estruturas*, não *negócios*.

## Princípio central

Separe em três camadas, da mais estável para a mais volátil:

| Camada | O que é | Exemplo | Muda com que frequência |
|---|---|---|---|
| **Structure (UI kit)** | Primivivos genéricos, sem regra | `StepFlow`, `DataGrid`, `EntityList`, `PaymentSelector` | Raro |
| **Domain policy / ports** | Contratos que ligam UI a regra | `OrderSteps`, `PaymentOptions`, `validateStep()` | Por produto |
| **Business rules** | Lógica real do negócio | PIX/Boleto, crédito, XML ERP | Frequente |

A camada **Structure** é a única que vira componente React reutilizável. As outras duas são **dados + funções** passados para ela.

## O que NÃO vai na estrutura

- Nomes de produto ("Ampla Vendas Pro"), formas de pagamento ("PIX", "Boleto 30/60/90").
- Strings de negócio ("Nova Venda / Emissão de Pedido ERP").
- Geração de XML fiscal, cálculo de IBPT, DANFE.
- Conexão com IndexedDB / Supabase / ERP.

Tudo isso é **injetado** na estrutura via props ou contexto de domínio.
