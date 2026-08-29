# Ampla — Estrutura de UI Desacoplada

Este site documenta o padrão para **desvincular o propósito e a regra de negócio da estrutura básica de UI** da plataforma Ampla (wizard de pedido, listas, grids, pagamentos).

A estrutura básica é **genérica, reutilizável e agnóstica de domínio**. O negócio (vendas, pricing, fiscal, ERP) entra como **plugin** — políticas, adaptadores e dados — sem nunca vazar para dentro dos componentes.

> Padrão de deploy deste site copiado de [`axio-docs`](https://docs.axio.eng.br): VitePress + GitHub Pages + Cloudflare (ver [`07-deploy`](/07-deploy)).

## Por que

Hoje em `ampla-vendas`, componentes como `OrderStepper.tsx` carregam, ao mesmo tempo:

- a **estrutura** (um wizard de 5 passos, um grid de itens, um seletor de forma de pagamento);
- o **negócio** (PIX com QR Code, Boleto 30/60/90, crédito do cliente, geração de XML ERP, IBPT, DANFE).

Isso impede reusar o wizard num fluxo de "troca/devolução", ou o grid num "catálogo de serviços", sem copiar regra de negócio.

## O padrão em uma frase

> **A estrutura pergunta; o domínio responde.** O componente nunca sabe *o que* é PIX — ele sabe *que existe* uma etapa de pagamento e *delega* as opções, a validação e o efeito a um contrato (port).

## Navegação

1. [Visão Geral](/01-visao-geral)
2. [O Problema (acoplamento atual)](/02-o-problema)
3. [A Estrutura Desacoplada](/03-estrutura-desacoplada)
4. [Contratos / Ports](/04-contratos)
5. [Regras de Negócio Plugáveis](/05-regras-plugaveis)
6. [Exemplo Plugável](/06-exemplo-plugavel)
7. [Deploy (padrão axio-docs)](/07-deploy)
