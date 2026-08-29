#!/usr/bin/env bash
# publicar.sh — sobe as mudanças para o GitHub (e publica o site).
# Uso:
#   ./publicar.sh "o que você mudou"
set -eu

if [ "$#" -ne 1 ]; then
  echo "Uso: ./publicar.sh \"mensagem do que mudou\""
  exit 64
fi
MSG="$1"

if ! git remote >/dev/null 2>&1; then
  echo "Ainda não tem repositório no GitHub."
  echo "1) Crie o repositório vazio 'ampla-docs' em github.com/axio-eng"
  echo "2) Rode: git remote add origin git@github.com:axio-eng/ampla-docs.git"
  exit 1
fi

git add .
git commit -m "${MSG}"
git push
echo "OK — mudanças no GitHub. O deploy publica sozinho (veja .github/workflows)."
