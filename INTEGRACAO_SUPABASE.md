# 🚀 Guia Completo de Integração com Supabase

## 📋 O que você precisa fazer

### 1️⃣ Criar Conta no Supabase (GRATUITO)

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com:
   - GitHub (recomendado)
   - Email
   - Google

---

### 2️⃣ Criar Novo Projeto

1. Após login, clique em **"New Project"**
2. Preencha os dados:

```
Organization: Sua organização (pode deixar a padrão)
Project Name: planos-aula-ia
Database Password: [CRIE UMA SENHA FORTE - ANOTE!]
Region: South America (São Paulo)
Pricing Plan: Free (Gratuito)
```

3. Clique em **"Create new project"**
4. Aguarde **2-3 minutos** (criação do banco)

---

### 3️⃣ Obter as Credenciais

Quando o projeto estiver pronto:

1. No menu lateral, vá em **Settings** (⚙️)
2. Clique em **API**
3. Copie as seguintes informações:

```
✅ Project URL
   Exemplo: https://abc123xyz.supabase.co

✅ anon/public key
   Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:** NÃO pegue a `service_role` key!

---

### 4️⃣ Configurar o Arquivo .env

No seu projeto local:

1. Copie o arquivo `.env.example`:
```bash
cd C:\Users\Gustavo\testetecnico2
copy .env.example .env
```

2. Abra o arquivo `.env` e preencha:
```env
SUPABASE_URL=https://abc123xyz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=sua_chave_gemini
PORT=3000
```

3. Salve o arquivo

---

### 5️⃣ Executar os Scripts SQL

Agora precisa criar as tabelas:

#### **Método 1: SQL Editor (Recomendado)**

1. No Supabase Dashboard, vá em **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `database/schema.sql` do projeto
4. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
5. **Cole** no SQL Editor do Supabase (Ctrl+V)
6. Clique em **"Run"** (ou Ctrl+Enter)
7. Aguarde a mensagem: **"Success. No rows returned"** ✅

#### **Método 2: Via API (alternativo)**

Se preferir, pode executar via terminal:
```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Link com seu projeto
supabase link --project-ref SEU_PROJECT_ID

# Execute o schema
supabase db push
```

---

### 6️⃣ Verificar se as Tabelas foram Criadas

1. No Supabase Dashboard, vá em **Table Editor**
2. Você deve ver **3 tabelas**:
   - ✅ `profiles`
   - ✅ `planos_aula`
   - ✅ `geracoes_historico`

Se aparecerem, **está tudo certo!** 🎉

---

### 7️⃣ Testar a Integração

No seu terminal:

```bash
cd C:\Users\Gustavo\testetecnico2
npm start
```

Acesse: http://localhost:3000

**Teste gerando um plano:**
1. Preencha o formulário
2. Clique em "Gerar Plano de Aula"
3. Aguarde 2-4 segundos

**Verificar se salvou:**
1. Volte ao Supabase
2. Table Editor → `planos_aula`
3. Você deve ver o plano gerado! ✅

---

## 🔍 Troubleshooting

### ❌ Erro: "Failed to fetch"
**Causa:** URL ou chave incorreta

**Solução:**
1. Verifique o `.env`
2. Copie novamente as credenciais do Supabase
3. Reinicie o servidor (`Ctrl+C` e `npm start`)

---

### ❌ Erro: "relation does not exist"
**Causa:** Tabelas não foram criadas

**Solução:**
1. Execute o `schema.sql` novamente
2. Verifique no Table Editor se as tabelas existem
3. Se não existirem, copie e cole o SQL novamente

---

### ❌ Erro: "permission denied"
**Causa:** RLS está bloqueando (sem autenticação)

**Solução:**
O sistema já está preparado para funcionar sem login! O `user_id` é opcional.

**Se quiser desabilitar RLS temporariamente:**
```sql
ALTER TABLE public.planos_aula DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.geracoes_historico DISABLE ROW LEVEL SECURITY;
```

---

## 🔐 Configurações de Segurança (Opcional)

### Habilitar Email Confirmation
1. Authentication → Settings
2. Desmarque "Enable email confirmations"

### Allowed URLs
1. Authentication → URL Configuration
2. Adicione: `http://localhost:3000`

---

## 📊 Monitorar Uso

### Ver Planos Gerados
```
Dashboard → Table Editor → planos_aula
```

### Ver Analytics
```
Dashboard → Table Editor → geracoes_historico
```

### Limites do Plano Gratuito
- ✅ 500 MB de Database
- ✅ 1 GB de File Storage
- ✅ 2 GB de Bandwidth/mês
- ✅ 50.000 usuários MAU
- ✅ Social OAuth providers

**Mais que suficiente para este projeto!**

---

## 🎯 Checklist Final

Antes de finalizar, verifique:

- [ ] Conta Supabase criada
- [ ] Projeto criado (região: South America)
- [ ] Credenciais copiadas (URL + anon key)
- [ ] Arquivo `.env` configurado
- [ ] Script SQL executado
- [ ] 3 tabelas visíveis no Table Editor
- [ ] Servidor rodando (npm start)
- [ ] Teste de geração funcionando
- [ ] Plano salvo visível no Supabase

---

## 📝 Resumo Rápido

```bash
# 1. Criar projeto no Supabase (https://supabase.com)
# 2. Copiar credenciais (Settings → API)
# 3. Configurar .env
copy .env.example .env
# Editar .env com suas credenciais

# 4. Executar SQL (Dashboard → SQL Editor → Cole schema.sql)
# 5. Verificar tabelas (Table Editor)
# 6. Testar
npm start
# Acesse http://localhost:3000 e gere um plano
```

---

## 🆘 Precisa de Ajuda?

**Documentação Oficial:**
- https://supabase.com/docs
- https://supabase.com/docs/guides/database

**Suporte:**
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase/discussions

---

## ✅ Pronto!

Se seguiu todos os passos, seu projeto está **100% integrado** com o Supabase! 🎉

Tempo estimado: **10-15 minutos**
