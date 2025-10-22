# Gerador de Planos de Aula com IA

Sistema web para geração automática de planos de aula personalizados utilizando Google Gemini AI e Supabase.

## 🚀 Tecnologias

- Frontend: HTML5, CSS3, JavaScript (pasta `public/`)
- Backend: Node.js, Express (`server.js`)
- IA: Google Gemini API (Google AI Studio)
- Banco: Supabase (PostgreSQL) com JSONB
- Ambiente: variáveis via `.env`

## ✅ Requisitos

- Node.js 18+ (ECMAScript modules habilitados via `"type": "module"`)
- Conta no Supabase (projeto + banco PostgreSQL)
- Chave de API do Google AI Studio (Gemini)

## 🔧 Instalação

1. Clone e instale:
```bash
git clone https://github.com/Jairzaoo/TesteTecnico2.git
cd TesteTecnico2
npm install
```

2. Configure o ambiente:
```bash
cp .env.example .env
```

3. Edite `.env` com suas credenciais:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_supabase
GEMINI_API_KEY=sua_chave_api_gemini
PORT=3000
```

4. Configure o banco executando `database/setup_completo.sql` no Supabase (ou `database/schema.sql`).

5. Inicie o servidor:
```bash
npm start
# ou em modo desenvolvimento
npm run dev
```

6. Acesse:
```
http://localhost:3000
```

## 📁 Estrutura

```
├── server.js              # Servidor principal (Express, Gemini, Supabase)
├── package.json           # Scripts e dependências
├── .env.example           # Exemplo de configuração
├── public/                # Frontend (estático)
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── database/              # Scripts SQL
    ├── schema.sql
    └── setup_completo.sql
```

## 🎯 Funcionalidades

- Formulário com validações básicas para coletar os dados da aula
- Integração com Gemini (Google AI Studio) para gerar:
  - Introdução lúdica
  - Objetivo BNCC (código + descrição)
  - Passo a passo detalhado
  - Rubrica de avaliação (4 níveis)
- Parsing da resposta da IA em JSON (com validação de campos obrigatórios)
- Persistência no Supabase (plano completo e histórico de gerações)
- Listagem e consulta de planos salvos
- Tratamento de erros e health check

## 🔄 Fluxo funcional

1. Usuário preenche o formulário no frontend.
2. Backend valida os inputs e monta um prompt estruturado.
3. Backend chama o modelo Gemini e obtém a resposta.
4. JSON retornado é validado e normalizado.
5. Plano é salvo no Supabase (tabela `planos_aula`).
6. Histórico de geração é registrado em `geracoes_historico`.
7. O plano é retornado e exibido ao usuário.

## 🧠 Modelo de IA escolhido

- Modelo: `gemini-2.0-flash`
- Justificativa:
  - Latência baixa e custo adequado para uso gratuito (Google AI Studio)
  - Suficiente para instruções bem estruturadas e retorno em JSON
- Estratégia de Prompt:
  - Instruções claras para responder “APENAS em JSON válido”
  - Chaves fixas para reduzir ambiguidade e facilitar parsing
  - Campos obrigatórios: `introducao_ludica`, `objetivo_bncc`, `passo_a_passo`, `rubrica_avaliacao`

## 🗃️ Modelagem de dados (Supabase)

Tabelas principais utilizadas pelo backend (ver scripts em `database/`):

- `planos_aula`
  - `id` (PK)
  - `user_id` (UUID ou texto, opcional)
  - `disciplina` (text)
  - `ano_escolar` (text)
  - `tema` (text)
  - `duracao_minutos` (int)
  - `numero_alunos` (int, opcional)
  - `recursos_disponiveis` (text[] ou jsonb, opcional)
  - `objetivos_especificos` (text, opcional)
  - `plano_gerado` (jsonb) — contém o JSON retornado pela IA
  - `created_at` (timestamp com default now())

- `geracoes_historico`
  - `id` (PK)
  - `plano_id` (FK para `planos_aula.id`, opcional em caso de erro)
  - `user_id` (UUID ou texto, opcional)
  - `tokens_utilizados` (int, opcional)
  - `tempo_geracao_ms` (int)
  - `modelo_ia` (text)
  - `sucesso` (boolean)
  - `erro_mensagem` (text, opcional)
  - `created_at` (timestamp com default now())

Sugerido (opcional) para ambiente com autenticação:
- Ativar RLS (Row Level Security) e criar policies para filtrar por `user_id`.

## 🧩 Endpoints (API)

Base URL: `http://localhost:3000`

- POST `/api/gerar-plano`
  - Body (JSON mínimo):
    ```json
    {
      "disciplina": "Matemática",
      "ano_escolar": "5º ano",
      "tema": "Frações",
      "duracao_minutos": 50,
      "numero_alunos": 30,
      "recursos_disponiveis": ["cartolina", "marcadores"],
      "objetivos_especificos": "Compreender frações como partes de um todo",
      "user_id": "opcional"
    }
    ```
  - Retorno (sucesso):
    ```json
    {
      "sucesso": true,
      "plano_id": 123,
      "plano": {
        "introducao_ludica": "...",
        "objetivo_bncc": { "codigo": "EF05MA08", "descricao": "..." },
        "passo_a_passo": [ { "numero": 1, "titulo": "...", "duracao_minutos": 10, "descricao": "...", "materiais": ["..."] } ],
        "rubrica_avaliacao": { "criterios": [ { "criterio": "...", "insuficiente": "...", "basico": "...", "proficiente": "...", "avancado": "..." } ] }
      },
      "tempo_geracao_ms": 1234
    }
    ```

- GET `/api/planos?user_id=...` — lista planos (filtra por `user_id` se enviado)

- GET `/api/planos/:id` — busca um plano específico

- GET `/api/health` — status do serviço
  - Exemplo de retorno:
    ```json
    {
      "status": "ok",
      "timestamp": "2025-01-01T00:00:00.000Z",
      "gemini": true,
      "supabase": true
    }
    ```

## 🧱 Decisões técnicas tomadas

- Arquitetura simples: backend Express como orquestrador (IA + banco), frontend estático para reduzir atrito no setup.
- Persistência com Supabase (PostgreSQL) usando JSONB para armazenar a resposta da IA integralmente e facilitar consultas.
- Modelo `gemini-2.0-flash` para bom equilíbrio entre latência e qualidade no tier gratuito.
- Resposta da IA em JSON estrito com chaves fixas para parsing robusto e mapeamento direto para o banco.
- Variáveis de ambiente e `.env.example` para isolar segredos e facilitar execução local/produção.
- Endpoints REST claros, com validações de entrada e mensagens de erro amigáveis.

## 🧗 Desafios encontrados e soluções

- Padronizar a saída da IA:
  - Desafio: respostas de LLM podem vir com texto extra e campos ausentes.
  - Solução: prompt exigindo “APENAS JSON”, extração defensiva do bloco JSON, validação de campos obrigatórios e mensagens de reprocessamento em caso de falha.

- Alinhamento à BNCC:
  - Desafio: garantir objetivos concretos e com código BNCC.
  - Solução: coletar informações-chave (disciplina, ano, tema) e instruir a IA a citar código e descrição BNCC; permitir campo de “objetivos específicos” para enriquecer o contexto.

- Limites e latência:
  - Desafio: evitar prompts longos e lentos.
  - Solução: inputs com tamanho razoável, prompt enxuto e modelo “flash”.

- Segurança e acesso ao banco:
  - Desafio: evitar exposição de chaves e dados de terceiros.
  - Solução: chaves no backend, possibilidade de RLS por `user_id` no Supabase, e endpoint de listagem com filtro opcional por usuário.

- Resiliência do fluxo:
  - Desafio: lidar com falhas de rede/IA/banco.
  - Solução: try/catch em toda a cadeia, status codes adequados, registro em `geracoes_historico` com `sucesso=false` e `erro_mensagem`.

## 📌 Observações

- O projeto foi pensado para avaliação rápida: clone, configure `.env`, rode os scripts SQL e `npm start`.
- Ajustes de UX/autenticação podem ser incrementados facilmente por cima desta base.

## 📝 Licença

MIT
