# 🚀 Configuração Rápida - Seu Projeto Supabase

## ✅ Informações do Seu Projeto

**URL:** https://bywxgzdwbnyyepzeptgx.supabase.co  
**Dashboard:** https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx

---

## 📝 PASSO 1: Obter a Chave ANON Correta

⚠️ **IMPORTANTE:** Você colou a chave `service_role` que é SECRETA!

Pegue a chave correta:

1. Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/settings/api
2. Role até **"Project API keys"**
3. Copie a chave **"anon" ou "public"** (NÃO a "service_role"!)
4. Cole aqui embaixo:

```
SUPABASE_ANON_KEY=__COLE_AQUI_A_CHAVE_ANON__
```

---

## 🗄️ PASSO 2: Criar as Tabelas no Banco

### Opção A: Via Dashboard (Mais Fácil) ✅

1. Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor/sql
2. Clique em **"New query"**
3. Abra o arquivo `database/setup_completo.sql` do projeto
4. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
5. **Cole** no SQL Editor (Ctrl+V)
6. Clique em **"Run"** ou pressione Ctrl+Enter
7. Aguarde a mensagem de sucesso ✅

### Opção B: Via PowerShell (Automático)

```powershell
cd C:\Users\Gustavo\testetecnico2
Get-Content database\setup_completo.sql | Set-Clipboard
Write-Host "SQL copiado! Cole no Supabase SQL Editor e execute."
```

---

## ⚙️ PASSO 3: Configurar o .env

1. Pegue a chave ANON que você copiou no Passo 1
2. Abra o arquivo `.env` no projeto
3. Cole suas credenciais:

```env
SUPABASE_URL=https://bywxgzdwbnyyepzeptgx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5d3hnemR3Ym55eWVwemVwdGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTY0OTgsImV4cCI6MjA3NjYzMjQ5OH0.XXXXX
GEMINI_API_KEY=AIza... (sua chave do Google AI Studio)
PORT=3000
```

4. Salve o arquivo

---

## 🧪 PASSO 4: Testar

```powershell
cd C:\Users\Gustavo\testetecnico2
npm start
```

Abra: http://localhost:3000

**Teste gerando um plano:**
1. Preencha o formulário
2. Clique em "Gerar Plano de Aula"
3. Aguarde 2-4 segundos

---

## ✅ PASSO 5: Verificar se Salvou

1. Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor
2. Clique em **Table Editor**
3. Selecione a tabela **planos_aula**
4. Você deve ver o plano gerado! 🎉

---

## 🔍 Verificar Tabelas Criadas

Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor

Você deve ver:
- ✅ profiles
- ✅ planos_aula
- ✅ geracoes_historico

---

## 🚨 Troubleshooting

### Erro: "Failed to connect to Supabase"
**Causa:** Chave ou URL incorreta no .env

**Solução:**
1. Verifique se a URL está correta
2. Verifique se usou a chave ANON (não service_role)
3. Reinicie o servidor

### Erro: "permission denied"
**Causa:** RLS bloqueando

**Solução:**
Execute este SQL no Supabase SQL Editor:
```sql
ALTER TABLE public.planos_aula DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.geracoes_historico DISABLE ROW LEVEL SECURITY;
```

### Erro: "relation does not exist"
**Causa:** Tabelas não foram criadas

**Solução:**
Execute o arquivo `setup_completo.sql` novamente

---

## ✅ Checklist Final

- [ ] Chave ANON copiada (não service_role)
- [ ] SQL executado no Supabase
- [ ] 3 tabelas visíveis no Table Editor
- [ ] Arquivo .env configurado
- [ ] Servidor rodando (npm start)
- [ ] Teste realizado com sucesso
- [ ] Plano visível no Supabase

---

## 🎯 Pronto!

Se completou todos os passos, seu projeto está **100% integrado** com o Supabase! 🎉

**Tempo estimado:** 5-10 minutos
