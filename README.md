# 📚 Gerador de Planos de Aula com IA

Sistema completo de geração automática de planos de aula personalizados usando **Google Gemini AI** e **Supabase**, alinhado à **BNCC** (Base Nacional Comum Curricular).

---

## 🎯 Visão Geral

Aplicação web que gera planos de aula completos e estruturados em segundos. Cada plano contém:

- 🎭 **Introdução Lúdica** - Forma criativa de apresentar o tema
- 🎯 **Objetivo BNCC** - Código e descrição curricular
- 📋 **Passo a Passo** - Roteiro detalhado com duração e materiais
- ✅ **Rubrica de Avaliação** - 4 níveis de proficiência

---

## 🛠️ Tecnologias

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- Google Gemini AI (gemini-1.5-flash)

**Frontend:**
- HTML5 + CSS3 + JavaScript
- Design responsivo

---

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
git clone https://github.com/Jairzaoo/TesteTecnico2.git
cd TesteTecnico2
npm install
```

### 2. Configurar Variáveis
Crie `.env` (copie de `.env.example`):
```env
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_supabase
GEMINI_API_KEY=sua_chave_gemini
PORT=3000
```

**Obter credenciais:**
- **Supabase**: [supabase.com](https://supabase.com) → Novo projeto → Settings → API
- **Gemini**: [ai.google.dev](https://ai.google.dev) → Get API Key (gratuito, sem cartão)

### 3. Configurar Banco
No Supabase Dashboard:
- SQL Editor → Cole conteúdo de `database/schema.sql` → Execute

### 4. Executar
```bash
npm start
```
Acesse: http://localhost:3000

---

## 📂 Estrutura

```
TesteTecnico2/
├── database/
│   ├── schema.sql           # Scripts SQL (3 tabelas)
│   └── ESTRUTURA_DADOS.md   # Documentação do banco
├── public/
│   ├── index.html           # Interface
│   ├── styles.css           # Estilos
│   └── app.js               # Lógica frontend
├── server.js                # API Express
├── package.json             # Dependências
└── .env.example             # Template config
```

---

## 💡 Como Usar

1. Preencha o formulário:
   - Disciplina, ano, tema, duração
   - Opcionais: nº alunos, recursos, objetivos

2. Clique em **"Gerar Plano de Aula"**

3. Aguarde 2-4 segundos

4. Visualize e use:
   - 🖨️ Imprimir
   - 📋 Copiar JSON
   - ➕ Gerar novo

**Exemplo de teste:**
- Matemática / 5º ano / Frações / 50 min

---

## 🗄️ Banco de Dados

### Tabelas

**`profiles`** - Perfil dos professores  
**`planos_aula`** - Planos gerados (inputs + JSON)  
**`geracoes_historico`** - Analytics

**Segurança:**
- Row Level Security (RLS)
- Políticas por usuário
- Validações e índices

---

## 🧠 Modelo de IA

**Escolha:** Gemini 1.5 Flash

**Motivos:**
- ✅ Gratuito (sem cartão)
- ✅ Rápido (1-3s)
- ✅ JSON nativo
- ✅ Conhece BNCC
- ✅ 15 req/min grátis

**Alternativas consideradas:**
- Gemini Pro (pago)
- GPT-3.5/4 (pago)
- Claude (pago)

---

## 📊 API

### `POST /api/gerar-plano`
```json
{
  "disciplina": "Matemática",
  "ano_escolar": "5º ano EF",
  "tema": "Frações",
  "duracao_minutos": 50
}
```

### `GET /api/planos`
Lista planos salvos

### `GET /api/planos/:id`
Busca plano específico

### `GET /api/health`
Status da API

---

## 🚧 Desafios Resolvidos

1. **Parsing JSON** → Regex para extrair JSON limpo
2. **Prompt** → Estrutura específica + exemplo
3. **Loading** → States visuais + feedback
4. **Validação** → Frontend + backend

---

## 📱 Responsivo

✅ Desktop / Tablet / Mobile  
✅ Impressão otimizada

---

## 👨‍💻 Autor

**Gustavo Rezende**  
📧 gustavonrezende@gmail.com  
🔗 [github.com/Jairzaoo](https://github.com/Jairzaoo)

---

## 📝 Licença

MIT License

---

**Desenvolvido com ❤️ para educadores brasileiros**
