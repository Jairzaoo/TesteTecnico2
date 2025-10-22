# Gerador de Planos de Aula com IA

Sistema web para geração automática de planos de aula personalizados utilizando Google Gemini AI e Supabase.

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **IA**: Google Gemini API
- **Banco**: Supabase (PostgreSQL)

## 🔧 Instalação

1. Clone e instale:
```bash
git clone <url-do-repositorio>
cd gerador-planos-aula-ia
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

4. Configure o banco executando `database/setup_completo.sql` no Supabase

5. Inicie o servidor:
```bash
npm start
```

## 📁 Estrutura

```
├── server.js              # Servidor principal
├── package.json           # Dependências
├── .env.example           # Exemplo de configuração
├── public/                # Frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── database/              # Scripts SQL
    ├── schema.sql
    └── setup_completo.sql
```

## 🎯 Uso

1. Acesse `http://localhost:3000`
2. Faça login/cadastro
3. Preencha o formulário com dados da aula
4. Clique em "Gerar Plano de Aula"
5. Visualize o resultado

## 📝 Licença

MIT