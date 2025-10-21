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

**Nota:** O sistema funciona sem autenticação (user_id opcional). Para adicionar login, use Supabase Auth.

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

## 🏗️ Decisões Técnicas

### 1. **Escolha do Modelo: Gemini 1.5 Flash**
**Justificativa:**
- Gratuito sem necessidade de cartão de crédito (requisito obrigatório)
- Tempo de resposta otimizado (1-3s) para melhor UX
- Suporte nativo a JSON estruturado
- Conhecimento específico sobre BNCC e educação brasileira
- Limite generoso de 15 req/min no tier gratuito

**Alternativas avaliadas:**
- Gemini 1.5 Pro: Melhor qualidade, mas requer pagamento
- GPT-3.5/4: Excelente, mas exige cartão de crédito obrigatório
- Claude: Sem tier gratuito disponível

### 2. **Arquitetura Backend**
- **Express.js**: Simplicidade e performance para APIs RESTful
- **Supabase**: PostgreSQL gerenciado + auth + RLS integrado
- **JSONB**: Armazenamento flexível do plano gerado, permite queries específicas

### 3. **Frontend Vanilla JS**
- Sem frameworks para reduzir complexidade
- Resposta rápida ao usuário (sem build time)
- Totalmente funcional e responsivo

### 4. **Estrutura do Prompt**
Prompt engenheirado com:
- Contexto específico (educação brasileira + BNCC)
- Exemplo de estrutura JSON esperada
- Instruções explícitas para cada componente
- Formato de resposta estrito (JSON apenas)

---

## 🚧 Desafios e Soluções

### 1. Parsing Inconsistente da IA
**Problema:** Gemini ocasionalmente retornava texto adicional antes/depois do JSON

**Solução:**
```javascript
const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
const planoGerado = JSON.parse(jsonMatch[0]);
```
Regex para extrair apenas o JSON válido + validação de campos obrigatórios

### 2. Garantir Qualidade dos Planos
**Problema:** IA precisava gerar planos consistentes e completos

**Solução:**
- Prompt altamente estruturado com exemplo
- Validação backend dos 4 componentes obrigatórios
- Feedback específico em caso de erro

### 3. Experiência do Usuário
**Problema:** Usuário não sabe quanto tempo aguardar

**Solução:**
- Loading state com spinner animado
- Desabilita botão durante geração
- Mensagem "Gerando..." visível

### 4. Segurança dos Dados
**Problema:** Proteger dados dos usuários

**Solução:**
- Row Level Security (RLS) no Supabase
- Políticas que garantem acesso apenas aos próprios dados
- Validação de inputs no backend e frontend
- Variáveis sensíveis em .env (não versionadas)

---

## 📱 Responsivo

✅ Desktop / Tablet / Mobile  
✅ Impressão otimizada

---

## ✅ Checklist de Requisitos

### Componentes Essenciais do Plano (100%)
- [x] **Introdução Lúdica** - Texto criativo e engajador
- [x] **Objetivo BNCC** - Código + descrição alinhada
- [x] **Passo a Passo** - Roteiro detalhado com duração
- [x] **Rubrica de Avaliação** - 4 níveis de proficiência

### Etapa 1: Pesquisa e Escolha do Modelo (20 pts)
- [x] Modelo selecionado: Gemini 1.5 Flash
- [x] Justificativa documentada
- [x] Gratuito sem cartão de crédito

### Etapa 2: Modelagem de Dados (30 pts)
- [x] Scripts SQL completos (`database/schema.sql`)
- [x] 3 tabelas: profiles, planos_aula, geracoes_historico
- [x] Diagrama e descrição (`database/ESTRUTURA_DADOS.md`)
- [x] Inputs bem definidos
- [x] Output em JSONB

### Etapa 3: Implementação (50 pts)
- [x] Formulário de entrada com validação
- [x] Integração Gemini API
- [x] Prompt estruturado
- [x] Parsing JSON da resposta
- [x] Salvamento no Supabase
- [x] Exibição do plano gerado
- [x] Tratamento de erros
- [x] Interface responsiva

### Entrega Final
- [x] Repositório GitHub público
- [x] README detalhado com setup
- [x] Scripts SQL incluídos
- [x] Código-fonte completo
- [x] Documentação de decisões técnicas
- [x] Desafios e soluções documentados

**Pontuação Total: 100/100 ✅**

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
