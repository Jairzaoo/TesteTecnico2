# 📚 Gerador de Planos de Aula com IA

Sistema completo para geração automática de planos de aula personalizados utilizando Inteligência Artificial (Google Gemini) e alinhados à Base Nacional Comum Curricular (BNCC).

## 🎯 Visão Geral

Este projeto foi desenvolvido como parte de um teste técnico e implementa um sistema capaz de gerar planos de aula completos e estruturados com base em inputs fornecidos pelo professor. O plano gerado contém:

- ✨ **Introdução Lúdica**: Forma criativa de apresentar o tema
- 🎯 **Objetivo BNCC**: Alinhado à Base Nacional Comum Curricular
- 📋 **Passo a Passo**: Roteiro detalhado da atividade
- ✅ **Rubrica de Avaliação**: Critérios claros de avaliação

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **Express**: Servidor API RESTful
- **Supabase**: Banco de dados PostgreSQL e autenticação
- **Google Gemini AI** (gemini-1.5-flash): Modelo de IA para geração de conteúdo

### Frontend
- **HTML5** + **CSS3** + **JavaScript** (Vanilla)
- Design responsivo e moderno
- Interface intuitiva e acessível

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Chave API do Google AI Studio (gratuita, sem cartão de crédito)
- Git instalado

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Jairzaoo/TesteTecnico2.git
cd TesteTecnico2
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (copie de `.env.example`):

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-supabase

# Google AI Studio / Gemini API
GEMINI_API_KEY=sua-chave-api-gemini

# Server Configuration
PORT=3000
```

#### Como obter as credenciais:

**Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie a URL e a chave `anon/public`

**Google AI Studio:**
1. Acesse [ai.google.dev](https://ai.google.dev)
2. Clique em "Get API Key"
3. Crie uma chave API (não requer cartão de crédito)

### 4. Configure o banco de dados

Execute o script SQL no Supabase:

1. Abra o Supabase Dashboard
2. Vá em SQL Editor
3. Cole o conteúdo de `database/schema.sql`
4. Execute o script

### 5. Execute o projeto

```bash
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📂 Estrutura do Projeto

```
TesteTecnico2/
├── database/
│   ├── schema.sql              # Scripts de criação das tabelas
│   └── ESTRUTURA_DADOS.md      # Documentação da estrutura
├── public/
│   ├── index.html              # Interface do usuário
│   ├── styles.css              # Estilos da aplicação
│   └── app.js                  # Lógica do frontend
├── server.js                   # Servidor Express + APIs
├── package.json                # Dependências do projeto
├── .env.example                # Exemplo de variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
└── README.md                   # Esta documentação
```

## 💡 Como Usar

1. **Preencha o formulário** com os dados da aula:
   - Disciplina (ex: Matemática, Português)
   - Ano escolar (1º ao 9º ano EF, 1ª a 3ª série EM)
   - Tema da aula (ex: Frações, Verbos)
   - Duração em minutos
   - Número de alunos (opcional)
   - Recursos disponíveis (opcional)
   - Objetivos específicos (opcional)

2. **Clique em "Gerar Plano de Aula"**
   - A IA processará as informações
   - Aguarde alguns segundos

3. **Visualize o plano gerado**
   - Introdução lúdica
   - Objetivo BNCC
   - Passo a passo detalhado
   - Rubrica de avaliação

4. **Ações disponíveis:**
   - 🖨️ **Imprimir**: Gera versão para impressão
   - 📋 **Copiar JSON**: Copia o JSON do plano
   - ➕ **Novo Plano**: Cria um novo plano

## 🧠 Escolha do Modelo de IA

### Modelo Selecionado: **gemini-1.5-flash**

#### Justificativa:

1. **Gratuito**: Não requer cartão de crédito
2. **Rápido**: Tempo de resposta otimizado (1-3 segundos)
3. **Qualidade**: Excelente compreensão de contexto educacional brasileiro
4. **JSON Nativo**: Suporta output estruturado em JSON
5. **Limite Generoso**: 15 requisições/minuto (tier gratuito)

#### Alternativas Consideradas:

- **gemini-1.5-pro**: Mais preciso, mas requer cartão de crédito
- **gemini-1.0-pro**: Versão anterior, menos capaz com instruções estruturadas

## 🗄️ Modelagem de Dados

### Tabelas Principais:

#### 1. `profiles`
Perfil complementar do usuário (professores)

#### 2. `planos_aula`
Armazena os planos de aula gerados

**Inputs:**
- disciplina, ano_escolar, tema
- duracao_minutos, numero_alunos
- recursos_disponiveis, objetivos_especificos

**Output:**
- plano_gerado (JSONB estruturado)

#### 3. `geracoes_historico`
Analytics e monitoramento das gerações

Veja mais detalhes em `database/ESTRUTURA_DADOS.md`

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- Usuários só acessam seus próprios dados
- Variáveis sensíveis em `.env` (não commitadas)
- Validação de inputs no backend e frontend

## 📊 APIs Disponíveis

### `POST /api/gerar-plano`
Gera um novo plano de aula

**Request Body:**
```json
{
  "disciplina": "Matemática",
  "ano_escolar": "5º ano EF",
  "tema": "Frações",
  "duracao_minutos": 50,
  "numero_alunos": 30,
  "recursos_disponiveis": ["Quadro", "Projetor"],
  "objetivos_especificos": "Ensinar adição de frações"
}
```

**Response:**
```json
{
  "sucesso": true,
  "plano_id": "uuid",
  "plano": { /* plano completo */ },
  "tempo_geracao_ms": 2500
}
```

### `GET /api/planos`
Lista planos de aula (com query params opcionais)

### `GET /api/planos/:id`
Busca um plano específico

### `GET /api/health`
Verifica status da API

## 🎨 Funcionalidades

✅ Formulário com validação completa  
✅ Integração com Gemini AI  
✅ Parsing de resposta JSON  
✅ Salvamento no Supabase  
✅ Exibição formatada do plano  
✅ Tratamento de erros robusto  
✅ Design responsivo  
✅ Função de impressão  
✅ Copiar JSON  
✅ Loading states  
✅ Feedback visual  

## 🚧 Desafios e Soluções

### 1. Parsing do JSON da IA
**Desafio**: Gemini às vezes retorna texto adicional antes/depois do JSON

**Solução**: Implementado regex para extrair apenas o JSON válido:
```javascript
const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
```

### 2. Estrutura do Prompt
**Desafio**: Garantir que a IA retorne todos os campos obrigatórios

**Solução**: Prompt muito específico com exemplo de estrutura JSON + validação backend

### 3. Tempo de Resposta
**Desafio**: IA pode demorar, usuário perde paciência

**Solução**: Loading state visual + mensagem de "Gerando..."

### 4. Validação de Duração
**Desafio**: Aulas muito longas ou muito curtas

**Solução**: Constraint no banco + validação frontend (15-480 minutos)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 🖥️ Desktop
- 📱 Tablet
- 📞 Mobile

## 🧪 Testando o Sistema

### Exemplo de teste rápido:

1. Disciplina: **Matemática**
2. Ano: **5º ano EF**
3. Tema: **Frações**
4. Duração: **50 minutos**
5. Clique em "Gerar"

Resultado esperado: Plano completo em 2-4 segundos

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar

## 👨‍💻 Autor

**Gustavo Rezende**
- Email: gustavonrezende@gmail.com
- GitHub: [@Jairzaoo](https://github.com/Jairzaoo)

## 🙏 Agradecimentos

- Google AI Studio pela API gratuita
- Supabase pelo backend completo
- BNCC pela referência curricular

---

**Desenvolvido com ❤️ para educadores brasileiros**
