# 🚀 Guia de Push para GitHub

## ⚠️ Token de Autenticação

O token fornecido parece estar incompleto. Tokens do GitHub geralmente têm este formato:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📝 Passos para fazer o Push

### Opção 1: Usando GitHub CLI (Recomendado)

1. Instale o GitHub CLI: https://cli.github.com/
2. Execute:
```bash
gh auth login
cd C:\Users\Gustavo\testetecnico2
gh repo create Jairzaoo/TesteTecnico2 --public --source=. --push
```

### Opção 2: Usando Token Pessoal

1. **Gere um novo token no GitHub:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token" → "Generate new token (classic)"
   - Nome: "TesteTecnico2"
   - Selecione os escopos: `repo` (todos)
   - Clique em "Generate token"
   - **COPIE O TOKEN** (você não verá novamente!)

2. **Configure o repositório remoto:**
```bash
cd C:\Users\Gustavo\testetecnico2
git remote remove origin
git remote add origin https://SEU_TOKEN_AQUI@github.com/Jairzaoo/TesteTecnico2.git
git push -u origin main
```

Substitua `SEU_TOKEN_AQUI` pelo token que você copiou.

### Opção 3: Criar Repositório Primeiro

1. Acesse: https://github.com/new
2. Preencha:
   - Repository name: `TesteTecnico2`
   - Descrição: "Sistema de geração de planos de aula com IA"
   - Público ✅
   - **NÃO** adicione README, .gitignore ou license

3. Execute os comandos que o GitHub mostrar, ou:
```bash
cd C:\Users\Gustavo\testetecnico2
git remote add origin https://github.com/Jairzaoo/TesteTecnico2.git
git branch -M main
git push -u origin main
```

4. Quando pedir credenciais:
   - Username: `Jairzaoo` (ou `gustavonrezende@gmail.com`)
   - Password: **SEU TOKEN** (não a senha do GitHub)

---

## ✅ Projeto já está pronto!

O código está completo em: `C:\Users\Gustavo\testetecnico2`

### Estrutura:
```
TesteTecnico2/
├── database/
│   ├── schema.sql
│   └── ESTRUTURA_DADOS.md
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── README.md
├── DOCUMENTACAO_MODELO_IA.md
├── .env.example
└── .gitignore
```

### Próximos passos após o push:

1. Configure as variáveis de ambiente (`.env`)
2. Configure o Supabase (execute `schema.sql`)
3. Obtenha a API Key do Gemini
4. Execute: `npm start`
5. Acesse: http://localhost:3000

---

## 🆘 Precisa de Ajuda?

Se continuar com problemas:
1. Verifique se o repositório `TesteTecnico2` já existe no GitHub
2. Certifique-se de que o token tem permissões de `repo`
3. Tente usar GitHub Desktop como alternativa
