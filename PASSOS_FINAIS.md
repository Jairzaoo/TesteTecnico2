# ✅ CONFIGURAÇÃO FINAL - SIGA ESTES 3 PASSOS

## 📋 Status Atual

✅ Projeto clonado e dependências instaladas  
✅ Supabase criado: https://bywxgzdwbnyyepzeptgx.supabase.co  
✅ Chave ANON configurada no `.env`  
✅ Scripts SQL prontos  

---

## 🚀 O QUE VOCÊ PRECISA FAZER

### PASSO 1: Executar SQL no Supabase ⏱️ 2 minutos

1. **Abra o SQL Editor:**  
   https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor/sql

2. **Clique em** `New query`

3. **Cole o SQL:**  
   O SQL já está copiado! Pressione `Ctrl+V` para colar  
   (Ou copie manualmente de `database/setup_completo.sql`)

4. **Execute:**  
   Clique em `Run` ou pressione `Ctrl+Enter`

5. **Verifique o sucesso:**  
   Você verá: "Success. No rows returned"  
   
6. **Confirme as tabelas:**  
   Vá em Table Editor e veja: `profiles`, `planos_aula`, `geracoes_historico`

---

### PASSO 2: Obter Chave Gemini API ⏱️ 3 minutos

1. **Acesse:** https://aistudio.google.com/app/apikey

2. **Faça login** com sua conta Google

3. **Clique em** `Get API Key`

4. **Selecione** `Create API key in new project`

5. **Copie a chave** (formato: `AIzaSy...`)

6. **Edite o arquivo** `.env` e cole:
   ```env
   GEMINI_API_KEY=AIzaSy...sua_chave_aqui
   ```

7. **Salve o arquivo**

---

### PASSO 3: Testar o Sistema ⏱️ 2 minutos

#### 3.1 Verificar Conexão com Supabase

```bash
npm run verificar
```

**Resultado esperado:**
```
✅ Conexão com Supabase OK!
✅ profiles: OK
✅ planos_aula: OK
✅ geracoes_historico: OK
✅ Inserção funcionou!
```

#### 3.2 Iniciar o Servidor

```bash
npm start
```

**Resultado esperado:**
```
🚀 Servidor rodando na porta 3000
📚 Acesse: http://localhost:3000
```

#### 3.3 Testar no Navegador

1. Abra: http://localhost:3000

2. Preencha o formulário de teste:
   - **Disciplina:** Matemática
   - **Ano:** 5º ano EF
   - **Tema:** Frações
   - **Duração:** 50 minutos

3. Clique em **"Gerar Plano de Aula"**

4. Aguarde 2-4 segundos

5. **Resultado esperado:**
   - ✅ Plano de aula exibido
   - ✅ Com introdução lúdica
   - ✅ Com objetivo BNCC
   - ✅ Com passo a passo
   - ✅ Com rubrica de avaliação

#### 3.4 Verificar no Supabase

1. Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor

2. Vá em **Table Editor** → **planos_aula**

3. Você deve ver o plano salvo! 🎉

---

## ✅ Checklist Final

Marque conforme completar:

- [ ] SQL executado no Supabase
- [ ] 3 tabelas visíveis no Table Editor
- [ ] Chave Gemini API obtida
- [ ] `.env` configurado com GEMINI_API_KEY
- [ ] `npm run verificar` executado com sucesso
- [ ] `npm start` funcionando
- [ ] Plano de aula gerado no navegador
- [ ] Plano visível no Supabase

---

## 🚨 Problemas Comuns

### ❌ Erro: "relation does not exist"
**Causa:** Tabelas não criadas  
**Solução:** Execute o PASSO 1 novamente

### ❌ Erro: "Failed to generate"
**Causa:** Chave Gemini inválida ou faltando  
**Solução:** Verifique GEMINI_API_KEY no `.env`

### ❌ Erro: "permission denied"
**Causa:** RLS muito restritivo  
**Solução:** Execute no SQL Editor:
```sql
ALTER TABLE public.planos_aula DISABLE ROW LEVEL SECURITY;
```

---

## 📊 Estrutura Atual

```
✅ .env configurado
   SUPABASE_URL=https://bywxgzdwbnyyepzeptgx.supabase.co
   SUPABASE_ANON_KEY=eyJ...rQg ✅
   GEMINI_API_KEY=AIza... ⏳ (você precisa adicionar)
   PORT=3000

✅ Código completo no GitHub
   https://github.com/Jairzaoo/TesteTecnico2

✅ Scripts SQL prontos
   database/setup_completo.sql
```

---

## 🎯 Após Completar

Você terá:
- ✅ Sistema 100% funcional
- ✅ Gerando planos de aula com IA
- ✅ Salvando no Supabase
- ✅ Interface responsiva
- ✅ Pronto para demonstração

---

## 📞 Links Importantes

- **Supabase Dashboard:** https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx
- **SQL Editor:** https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor/sql
- **Table Editor:** https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor
- **Google AI Studio:** https://aistudio.google.com/app/apikey
- **GitHub Repo:** https://github.com/Jairzaoo/TesteTecnico2

---

**Tempo total estimado: 7-10 minutos** ⏱️

**Sucesso! 🎉**
