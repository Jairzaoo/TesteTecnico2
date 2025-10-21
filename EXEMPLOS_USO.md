# 📚 Exemplos de Uso

Este documento contém exemplos práticos de como usar o sistema para diferentes disciplinas e anos escolares.

---

## Exemplo 1: Matemática - 5º ano EF

### Input:
```
Disciplina: Matemática
Ano Escolar: 5º ano EF
Tema: Adição e Subtração de Frações
Duração: 50 minutos
Número de Alunos: 30
Recursos: Quadro, Projetor, Materiais de arte
Objetivos Específicos: Ensinar os alunos a somar e subtrair frações com denominadores iguais
```

### Output Esperado:
- **Introdução Lúdica**: História sobre dividir pizzas
- **Código BNCC**: EF05MA03
- **Passo a Passo**: 5-6 etapas práticas
- **Rubrica**: 3-4 critérios de avaliação

---

## Exemplo 2: Português - 7º ano EF

### Input:
```
Disciplina: Português
Ano Escolar: 7º ano EF
Tema: Interpretação de texto narrativo
Duração: 100 minutos
Número de Alunos: 25
Recursos: Quadro, Livros didáticos, Internet
Objetivos Específicos: Desenvolver habilidades de análise crítica de narrativas
```

---

## Exemplo 3: Ciências - 6º ano EF

### Input:
```
Disciplina: Ciências
Ano Escolar: 6º ano EF
Tema: Fotossíntese
Duração: 50 minutos
Número de Alunos: 35
Recursos: Projetor, Laboratório, Computadores
Objetivos Específicos: Compreender o processo de fotossíntese e sua importância
```

---

## Exemplo 4: História - 9º ano EF

### Input:
```
Disciplina: História
Ano Escolar: 9º ano EF
Tema: Revolução Industrial
Duração: 90 minutos
Número de Alunos: 28
Recursos: Projetor, Internet, Livros didáticos
Objetivos Específicos: Analisar as transformações sociais e econômicas da Revolução Industrial
```

---

## Exemplo 5: Geografia - 8º ano EF

### Input:
```
Disciplina: Geografia
Ano Escolar: 8º ano EF
Tema: Tipos de Clima no Brasil
Duração: 50 minutos
Número de Alunos: 32
Recursos: Quadro, Projetor, Internet
Objetivos Específicos: Identificar e diferenciar os principais climas brasileiros
```

---

## Exemplo 6: Educação Física - 3º ano EF

### Input:
```
Disciplina: Educação Física
Ano Escolar: 3º ano EF
Tema: Jogos e Brincadeiras Cooperativas
Duração: 45 minutos
Número de Alunos: 30
Recursos: Materiais de arte
Objetivos Específicos: Desenvolver cooperação e trabalho em equipe através de jogos
```

---

## Exemplo 7: Inglês - 1ª série EM

### Input:
```
Disciplina: Inglês
Ano Escolar: 1ª série EM
Tema: Present Perfect Tense
Duração: 50 minutos
Número de Alunos: 35
Recursos: Quadro, Projetor, Computadores, Internet
Objetivos Específicos: Compreender e aplicar o Present Perfect em diferentes contextos
```

---

## Dicas para Melhores Resultados

### 1. Seja Específico no Tema
❌ Ruim: "Matemática"
✅ Bom: "Equações do primeiro grau"

### 2. Forneça Objetivos Claros
❌ Ruim: "Ensinar bem"
✅ Bom: "Capacitar os alunos a resolver equações simples e aplicá-las em problemas do cotidiano"

### 3. Indique Recursos Disponíveis
Quanto mais recursos você indicar, mais rica será a sugestão da IA.

### 4. Ajuste a Duração
- 45-50 min: Aula tradicional
- 90-100 min: Aula dupla
- 30 min: Atividade rápida

### 5. Considere o Número de Alunos
- Turmas pequenas (< 20): Mais atividades individuais
- Turmas grandes (> 30): Foco em dinâmicas coletivas

---

## Casos de Uso Avançados

### Aula Interdisciplinar
```
Disciplina: Matemática
Tema: Geometria e Arte - Proporção Áurea
Objetivos: Conectar conceitos matemáticos com manifestações artísticas
```

### Aula com Tecnologia
```
Recursos: Computadores, Internet, Projetor
Objetivos: Utilizar ferramentas digitais para aprendizado ativo
```

### Aula Prática
```
Recursos: Laboratório, Materiais de arte
Objetivos: Aprendizagem hands-on com experimentos
```

---

## Estrutura do JSON Retornado

```json
{
  "introducao_ludica": "Texto criativo e engajador",
  "objetivo_bncc": {
    "codigo": "EF05MA03",
    "descricao": "Descrição completa do objetivo"
  },
  "passo_a_passo": [
    {
      "numero": 1,
      "titulo": "Nome da etapa",
      "duracao_minutos": 10,
      "descricao": "Descrição detalhada",
      "materiais": ["material1", "material2"]
    }
  ],
  "rubrica_avaliacao": {
    "criterios": [
      {
        "criterio": "Nome do critério",
        "insuficiente": "Descrição",
        "basico": "Descrição",
        "proficiente": "Descrição",
        "avancado": "Descrição"
      }
    ]
  }
}
```

---

## Personalização do Prompt

Se quiser modificar o comportamento da IA, edite a função `criarPrompt()` em `server.js`.

### Exemplos de Customização:

**Mais foco em BNCC:**
```javascript
"Cite pelo menos 2 objetivos da BNCC relacionados..."
```

**Aulas mais práticas:**
```javascript
"Priorize atividades hands-on e experimentos..."
```

**Diferenciação pedagógica:**
```javascript
"Sugira adaptações para alunos com dificuldades e para alunos avançados..."
```

---

## Testando a API Diretamente

### Com cURL (Windows):
```bash
curl -X POST http://localhost:3000/api/gerar-plano ^
  -H "Content-Type: application/json" ^
  -d "{\"disciplina\":\"Matemática\",\"ano_escolar\":\"5º ano EF\",\"tema\":\"Frações\",\"duracao_minutos\":50}"
```

### Com Postman:
1. Method: `POST`
2. URL: `http://localhost:3000/api/gerar-plano`
3. Body (JSON):
```json
{
  "disciplina": "Matemática",
  "ano_escolar": "5º ano EF",
  "tema": "Frações",
  "duracao_minutos": 50
}
```

---

## Logs e Debugging

### Ver logs do servidor:
```bash
npm start
# Verifique o terminal para logs
```

### Ver logs do navegador:
1. Pressione F12
2. Vá em Console
3. Veja mensagens de erro/sucesso

---

## Métricas de Qualidade

### Um bom plano de aula deve ter:

✅ Introdução que desperta interesse  
✅ Código BNCC correto e relevante  
✅ 4-6 passos bem distribuídos no tempo  
✅ Materiais realistas e acessíveis  
✅ Rubrica com 3-5 critérios  
✅ 4 níveis de avaliação por critério  

---

## Feedback e Melhorias

Se o plano gerado não atender suas expectativas:

1. **Seja mais específico** nos inputs
2. **Adicione objetivos** detalhados
3. **Clique em "Gerar" novamente** (variação é normal)
4. **Ajuste manualmente** o plano gerado

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0.0
