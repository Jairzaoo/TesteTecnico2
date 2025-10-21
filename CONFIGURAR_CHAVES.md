# 🔑 CONFIGURAÇÃO PENDENTE - CHAVES DE API

## ❗ ATENÇÃO: Chaves inválidas detectadas!

As chaves de API no arquivo `.env` estão **inválidas** ou **expiradas**.

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### 1. GEMINI API KEY ❌ INVÁLIDA

**Erro detectado:**
```
API key not valid. Please pass a valid API key.
```

**Como obter:**
1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em **"Get API Key"** ou **"Create API Key"**
4. Copie a chave gerada (começa com `AIza...`)

**Onde colar:**
- Arquivo `.env`, linha 6:
  ```
  GEMINI_API_KEY=SUA_CHAVE_AQUI
  ```

---

### 2. SUPABASE ANON KEY ❌ INVÁLIDA

**Erro detectado:**
```
Invalid API key
```

**Como obter:**
1. Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx
2. Vá em **Settings** (⚙️) > **API**
3. Procure por **"Project API keys"**
4. Copie a chave **"anon"** ou **"public"** (NÃO a service_role!)
5. A chave começa com `eyJ...`

**Onde colar:**
- Arquivo `.env`, linha 3:
  ```
  SUPABASE_ANON_KEY=SUA_CHAVE_AQUI
  ```

---

### 3. SUPABASE URL ✅ OK

A URL está correta:
```
https://bywxgzdwbnyyepzeptgx.supabase.co
```

---

## 🚀 APÓS ATUALIZAR AS CHAVES

Execute o teste novamente:
```bash
node teste-completo.js
```

Ou inicie o servidor:
```bash
npm start
```

---

## 🆘 DÚVIDAS COMUNS

**Q: A chave Gemini é gratuita?**
A: Sim! O modelo `gemini-1.5-flash` tem quota gratuita generosa sem precisar de cartão.

**Q: Posso usar a chave service_role do Supabase?**
A: NÃO! Use apenas a chave `anon` no frontend/servidor. A `service_role` é secreta!

**Q: As chaves expiram?**
A: A chave Gemini pode ter limite de uso. A Supabase não expira, mas o projeto pode pausar por inatividade.

**Q: Como testar se as chaves estão corretas?**
A: Execute `node teste-completo.js` após atualizar o `.env`

---

## ✅ QUANDO ESTIVER PRONTO

Depois de configurar:
1. ✅ Atualize `.env` com as chaves corretas
2. ✅ Execute `node teste-completo.js`
3. ✅ Se tudo passar, execute `npm start`
4. ✅ Acesse http://localhost:3000
5. ✅ Teste gerando um plano de aula real

---

**📌 IMPORTANTE:** 
- Nunca commite o arquivo `.env` no Git!
- As chaves devem ser mantidas em segredo
- Use `.env.example` para documentar as variáveis necessárias
