import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Ampla — Estrutura Desacoplada',
  description: 'Padrão de desacoplamento de propósito e regra de negócio da estrutura básica de UI (pagamentos, listas, grids, wizard).',
  lang: 'pt-BR',
  base: '/ampla-docs/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],
  themeConfig: {
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Visão Geral', link: '/01-visao-geral' },
      { text: 'Estrutura', link: '/03-estrutura-desacoplada' },
    ],
    sidebar: [
      {
        text: 'Ampla — UI Desacoplada',
        items: [
          { text: 'Visão Geral', link: '/01-visao-geral' },
          { text: 'O Problema (acoplamento atual)', link: '/02-o-problema' },
          { text: 'A Estrutura Desacoplada', link: '/03-estrutura-desacoplada' },
          { text: 'Contratos / Ports', link: '/04-contratos' },
          { text: 'Regras de Negócio Plugáveis', link: '/05-regras-plugaveis' },
          { text: 'Exemplo Plugável', link: '/06-exemplo-plugavel' },
          { text: 'Deploy (padrão axio-docs)', link: '/07-deploy' },
        ],
      },
    ],
    search: { provider: 'local' },
  },
})
