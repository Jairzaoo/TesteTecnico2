# Estrutura de Dados - Sistema de Planos de Aula

## Diagrama de Entidades

```
┌─────────────────────┐
│   auth.users        │ (Supabase Auth)
│─────────────────────│
│ id (UUID) PK        │
│ email               │
│ encrypted_password  │
└──────────┬──────────┘
           │
           │ 1:1
           │
┌──────────▼──────────┐
│   profiles          │
│─────────────────────│
│ id (UUID) PK/FK     │
│ email               │
│ full_name           │
│ escola              │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│   planos_aula       │
│─────────────────────│
│ id (UUID) PK        │
│ user_id (UUID) FK   │
│ disciplina          │
│ ano_escolar         │
│ tema                │
│ duracao_minutos     │
│ numero_alunos       │
│ recursos_disponiveis│
│ objetivos_especificos│
│ plano_gerado (JSONB)│
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│ geracoes_historico  │
│─────────────────────│
│ id (UUID) PK        │
│ plano_id (UUID) FK  │
│ user_id (UUID) FK   │
│ tokens_utilizados   │
│ tempo_geracao_ms    │
│ modelo_ia           │
│ sucesso             │
│ erro_mensagem       │
│ created_at          │
└─────────────────────┘
```

## Descrição das Tabelas

### 1. profiles
Extensão da tabela de autenticação do Supabase para armazenar informações adicionais do professor.

**Campos:**
- `id`: Identificador único (referência ao auth.users)
- `email`: Email do usuário
- `full_name`: Nome completo do professor
- `escola`: Nome da escola onde leciona
- `created_at`: Data de criação
- `updated_at`: Data de última atualização

### 2. planos_aula
Tabela principal que armazena os planos de aula gerados.

**Inputs do Usuário:**
- `disciplina`: Matéria/disciplina (ex: Matemática, Português, História)
- `ano_escolar`: Ano/série (ex: 1º ano, 5º ano, 9º ano)
- `tema`: Tema específico da aula (ex: "Frações", "Verbos", "Brasil Colônia")
- `duracao_minutos`: Duração da aula em minutos
- `numero_alunos`: Quantidade de alunos na turma
- `recursos_disponiveis`: Array de recursos (ex: ["projetor", "computadores", "livros"])
- `objetivos_especificos`: Objetivos específicos que o professor deseja atingir

**Output da IA:**
- `plano_gerado`: JSON estruturado contendo:
  ```json
  {
    "introducao_ludica": "string",
    "objetivo_bncc": {
      "codigo": "string",
      "descricao": "string"
    },
    "passo_a_passo": [
      {
        "numero": 1,
        "titulo": "string",
        "duracao_minutos": number,
        "descricao": "string",
        "materiais": ["string"]
      }
    ],
    "rubrica_avaliacao": {
      "criterios": [
        {
          "criterio": "string",
          "insuficiente": "string",
          "basico": "string",
          "proficiente": "string",
          "avancado": "string"
        }
      ]
    }
  }
  ```

### 3. geracoes_historico
Tabela para analytics e monitoramento das gerações de planos.

**Campos:**
- `plano_id`: Referência ao plano gerado
- `user_id`: Usuário que gerou
- `tokens_utilizados`: Quantidade de tokens consumidos na API
- `tempo_geracao_ms`: Tempo de processamento em milissegundos
- `modelo_ia`: Modelo utilizado (ex: "gemini-1.5-flash")
- `sucesso`: Se a geração foi bem-sucedida
- `erro_mensagem`: Mensagem de erro caso tenha falhado

## Justificativa das Escolhas

### Inputs Escolhidos:
1. **Disciplina e Ano Escolar**: Fundamentais para alinhar com a BNCC
2. **Tema**: Específico para gerar conteúdo relevante
3. **Duração**: Permite que a IA distribua o tempo adequadamente
4. **Número de Alunos**: Influencia estratégias de dinâmica de grupo
5. **Recursos Disponíveis**: A IA pode sugerir atividades compatíveis
6. **Objetivos Específicos**: Personalização adicional

### Formato JSON para plano_gerado:
Escolhido para:
- Flexibilidade na estrutura
- Facilidade de parsing e validação
- Possibilidade de consultas específicas (JSONB no PostgreSQL)
- Fácil renderização no frontend
