# 7. Deploy (padrão axio-docs)

Este site segue **exatamente** o padrão de deploy do [`axio-docs`](https://docs.axio.eng.br): **VitePress + GitHub Pages + Cloudflare**.

## Estrutura de deploy

```
ampla-docs/
├─ .vitepress/config.mts        # título, nav, sidebar
├─ .github/workflows/deploy.yml # build + upload-pages + deploy-pages
├─ public/CNAME                 # docs.axio.eng.br  (trava o domínio bonito)
├─ publicar.sh                  # atalho de commit/push
├─ index.md                     # home
└─ 0x-*.md                      # páginas
```

## Fluxo

1. **Primeira vez** — criar repo vazio `ampla-docs` em `github.com/axio-eng` e:
   ```bash
   git remote add origin git@github.com:axio-eng/ampla-docs.git
   git push -u origin main
   ```
2. No repo → **Settings → Pages → Source: GitHub Actions**.
3. Cada `git push` (ou `./publicar.sh "o que mudou"`) rebuilda e publica sozinho.
4. **Domínio bonito** (`docs.axio.eng.br/ampla`): em Pages → Custom domain `docs.axio.eng.br`; no Cloudflare (zona `axio.eng.br`) criar CNAME `docs` → `axio-eng.github.io` (proxy laranja). O `public/CNAME` já trava o endereço.

## Rollback

Settings → Pages → Deployments → `⋯` → **Roll back this deployment**.

## Por que este padrão

- **Zero custo** (GitHub Pages) + **edge/CDN** (Cloudflare).
- **Uma fonte de verdade**: o markdown é o artefato; o site é derivado.
- **Reprodutível**: qualquer projeto axio (ampla, intra, nexus) usa o mesmo esqueleto.
