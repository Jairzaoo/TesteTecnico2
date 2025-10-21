# Estrutura do Banco de Dados

## Tabelas

### 1. `profiles`
Perfil dos professores
- `id` (UUID, PK)
- `email`, `full_name`, `escola`
- `created_at`, `updated_at`

### 2. `planos_aula`
Planos de aula gerados
- `id` (UUID, PK)
- `user_id` (FK → profiles)
- **Inputs:** disciplina, ano_escolar, tema, duracao_minutos, numero_alunos, recursos_disponiveis, objetivos_especificos
- **Output:** plano_gerado (JSONB)
- `created_at`, `updated_at`

### 3. `geracoes_historico`
Analytics das gerações
- `id` (UUID, PK)
- `plano_id` (FK), `user_id` (FK)
- `tokens_utilizados`, `tempo_geracao_ms`, `modelo_ia`
- `sucesso`, `erro_mensagem`
- `created_at`

## Estrutura do JSON (plano_gerado)

```json
{
  "introducao_ludica": "Texto criativo",
  "objetivo_bncc": {
    "codigo": "EF05MA08",
    "descricao": "Descrição do objetivo"
  },
  "passo_a_passo": [
    {
      "numero": 1,
      "titulo": "Título",
      "duracao_minutos": 10,
      "descricao": "Descrição",
      "materiais": ["material1"]
    }
  ],
  "rubrica_avaliacao": {
    "criterios": [
      {
        "criterio": "Nome",
        "insuficiente": "...",
        "basico": "...",
        "proficiente": "...",
        "avancado": "..."
      }
    ]
  }
}
```

## Segurança

- Row Level Security (RLS) habilitado
- Políticas por usuário
- Índices para performance
- Triggers de updated_at
