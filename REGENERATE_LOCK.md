# Regenerar Package Lock

Para corrigir o erro de sincronização do package-lock.json, execute os seguintes comandos:

```bash
# 1. Deletar o package-lock.json existente (já feito)
rm package-lock.json

# 2. Limpar cache do npm
npm cache clean --force

# 3. Instalar dependências para regenerar o lock file
npm install

# 4. Verificar se tudo está sincronizado
npm ci --dry-run
```

## Dependências Adicionadas

- `autoprefixer: ^10.4.21` - Para processamento CSS
- `browserslist: ^4.26.2` - Para compatibilidade de navegadores

## Arquivo .npmrc Criado

Criado arquivo `.npmrc` com configurações otimizadas para Firebase App Hosting:

```
engine-strict=true
fund=false
audit=false
legacy-peer-deps=false
strict-peer-deps=true
```

## Próximos Passos

1. Execute os comandos acima
2. Commit as mudanças
3. Tente o deploy novamente no Firebase App Hosting
