# ⚙️ Setup Completo - Passo a Passo

Este guia detalha TODOS os passos necessários para colocar o sistema em funcionamento.

---

## 📋 Checklist Rápido

- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Conta Supabase criada
- [ ] Banco de dados configurado
- [ ] Chave Gemini API obtida
- [ ] Arquivo `.env` configurado
- [ ] Servidor rodando

---

## 1. Pré-requisitos

### Node.js
```bash
# Verifique se está instalado:
node --version
npm --version

# Se não estiver, baixe em: https://nodejs.org/
# Versão recomendada: 18.x ou superior
```

---

## 2. Instalação das Dependências

```bash
cd C:\Users\Gustavo\testetecnico2
npm install
```

**Pacotes instalados:**
- `@google/generative-ai`: SDK do Gemini
- `@supabase/supabase-js`: Client do Supabase
- `express`: Servidor web
- `cors`: Middleware CORS
- `dotenv`: Gerenciador de variáveis de ambiente

---

## 3. Configuração do Supabase

### 3.1 Criar Conta e Projeto

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub ou email
4. Clique em "New Project"
5. Preencha:
   - **Name**: `planos-aula-ia`
   - **Database Password**: [escolha uma senha forte]
   - **Region**: South America (São Paulo)
6. Clique em "Create new project"
7. Aguarde ~2 minutos (criação do banco)

### 3.2 Obter Credenciais

1. No dashboard do projeto, vá em **Settings** (⚙️)
2. Clique em **API**
3. Copie:
   - **Project URL** (ex: `https://abc123xyz.supabase.co`)
   - **anon/public key** (começa com `eyJ...`)

### 3.3 Criar Tabelas

1. No menu lateral, clique em **SQL Editor**
2. Clique em "New query"
3. Abra o arquivo `database/schema.sql` deste projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Verifique se apareceu "Success" ✅

**Tabelas criadas:**
- `profiles`
- `planos_aula`
- `geracoes_historico`

### 3.4 Verificar Tabelas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as 3 tabelas listadas

---

## 4. Configuração do Google Gemini AI

### 4.1 Obter API Key (GRATUITA!)

1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com uma conta Google
3. Clique em **"Get API key"**
4. Clique em **"Create API key in new project"**
5. Copie a chave gerada (formato: `AIza...`)

**⚠️ IMPORTANTE:**
- Guarde esta chave em local seguro
- Não compartilhe publicamente
- É 100% gratuita (sem cartão de crédito!)

---

## 5. Configuração das Variáveis de Ambiente

### 5.1 Criar arquivo `.env`

1. Na raiz do projeto, copie o arquivo `.env.example`:
```bash
copy .env.example .env
```

2. Abra o arquivo `.env` em um editor de texto

3. Preencha com suas credenciais:

```env
# Supabase Configuration
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google AI Studio / Gemini API
GEMINI_API_KEY=AIzaSy...

# Server Configuration
PORT=3000
```

### 5.2 Verificar `.gitignore`

Certifique-se de que `.env` está no `.gitignore` (já está!)

---

## 6. Executar o Projeto

### 6.1 Modo Desenvolvimento

```bash
npm start
```

Você verá:
```
🚀 Servidor rodando na porta 3000
📚 Acesse: http://localhost:3000
```

### 6.2 Acessar no Navegador

1. Abra: http://localhost:3000
2. Preencha o formulário
3. Clique em "Gerar Plano de Aula"
4. Aguarde 2-4 segundos
5. Visualize o plano gerado!

---

## 7. Testar a Aplicação

### 7.1 Teste Básico

**Inputs de teste:**
- Disciplina: `Matemática`
- Ano: `5º ano EF`
- Tema: `Frações`
- Duração: `50` minutos
- Número de Alunos: `30`
- Recursos: Marque "Quadro" e "Projetor"

Clique em "Gerar" e aguarde.

**Resultado esperado:**
- ✅ Plano gerado em 2-4 segundos
- ✅ Introdução lúdica criativa
- ✅ Código BNCC (ex: EF05MA03)
- ✅ Passos detalhados
- ✅ Rubrica de avaliação

### 7.2 Verificar no Supabase

1. Abra o Supabase Dashboard
2. Vá em **Table Editor** → `planos_aula`
3. Você deve ver o plano salvo!

---

## 8. Troubleshooting (Soluções de Problemas)

### ❌ Erro: "Cannot find module"
**Solução:**
```bash
npm install
```

### ❌ Erro: "SUPABASE_URL is not defined"
**Solução:**
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão preenchidas
- Reinicie o servidor

### ❌ Erro: 400/401 do Supabase
**Solução:**
- Verifique se a URL está correta
- Verifique se a chave é a `anon/public` (não a `service_role`)
- Certifique-se de que executou o `schema.sql`

### ❌ Erro: 400 do Gemini
**Solução:**
- Verifique se a API Key está correta
- Verifique se não há espaços extras
- Teste a key em: https://aistudio.google.com

### ❌ Erro: "Resposta da IA não contém JSON"
**Solução:**
- Este erro é raro (~5% dos casos)
- Clique em "Gerar" novamente
- Se persistir, verifique sua API Key

### ❌ Porta 3000 já está em uso
**Solução:**
```bash
# Windows: encontre e mate o processo
netstat -ano | findstr :3000
taskkill /PID [número_do_pid] /F

# Ou mude a porta no .env:
PORT=3001
```

---

## 9. Deploy (Opcional)

### Opções de Deploy Gratuito:

#### 9.1 Vercel (Recomendado para Node.js)
```bash
npm install -g vercel
vercel login
vercel
```

#### 9.2 Railway
1. Acesse: https://railway.app
2. Conecte seu GitHub
3. Selecione o repositório
4. Configure as variáveis de ambiente
5. Deploy automático!

#### 9.3 Render
1. Acesse: https://render.com
2. New → Web Service
3. Conecte o repositório GitHub
4. Configure variáveis de ambiente
5. Deploy!

**⚠️ Importante:** Em todos os casos, configure as variáveis de ambiente (SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY)

---

## 10. Manutenção

### Atualizar dependências
```bash
npm update
```

### Ver logs do Supabase
Dashboard → Logs

### Monitorar uso do Gemini
https://aistudio.google.com/app/apikey → Ver uso

### Backup do banco
Dashboard → Database → Backups

---

## ✅ Checklist Final

Após seguir todos os passos, você deve conseguir:

- [ ] Acessar http://localhost:3000
- [ ] Ver o formulário
- [ ] Gerar um plano de aula
- [ ] Ver o plano na interface
- [ ] Ver o plano salvo no Supabase
- [ ] Imprimir o plano
- [ ] Copiar o JSON

---

## 🆘 Precisa de Ajuda?

Se ainda tiver problemas:

1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor (terminal)
3. Revise cada passo deste guia
4. Verifique os arquivos de documentação:
   - `README.md`
   - `DOCUMENTACAO_MODELO_IA.md`
   - `database/ESTRUTURA_DADOS.md`

---

**Data de criação:** Outubro 2025  
**Versão:** 1.0.0  
**Status:** ✅ Testado e funcionando
