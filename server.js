import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Função para criar o prompt estruturado
function criarPrompt(dados) {
  return `Você é um assistente especializado em educação brasileira e na Base Nacional Comum Curricular (BNCC).

Crie um plano de aula detalhado e personalizado com base nas seguintes informações:

- Disciplina: ${dados.disciplina}
- Ano Escolar: ${dados.ano_escolar}
- Tema: ${dados.tema}
- Duração: ${dados.duracao_minutos} minutos
- Número de Alunos: ${dados.numero_alunos || 'Não especificado'}
- Recursos Disponíveis: ${dados.recursos_disponiveis?.join(', ') || 'Recursos básicos'}
- Objetivos Específicos: ${dados.objetivos_especificos || 'A definir'}

O plano de aula deve conter OBRIGATORIAMENTE:

1. **Introdução Lúdica**: Uma forma criativa, engajadora e divertida de apresentar o tema aos alunos. Deve despertar curiosidade e interesse.

2. **Objetivo de Aprendizagem da BNCC**: Identifique e cite o código específico da BNCC que se alinha com esta aula, incluindo a descrição completa do objetivo.

3. **Passo a Passo da Atividade**: Um roteiro detalhado dividido em etapas claras, cada uma com:
   - Número da etapa
   - Título descritivo
   - Duração estimada em minutos
   - Descrição completa das ações
   - Materiais necessários

4. **Rubrica de Avaliação**: Critérios claros para avaliação do aprendizado, com 4 níveis (Insuficiente, Básico, Proficiente, Avançado) para cada critério importante.

IMPORTANTE: Responda APENAS com um JSON válido no seguinte formato, sem texto adicional antes ou depois:

{
  "introducao_ludica": "texto descritivo criativo",
  "objetivo_bncc": {
    "codigo": "código da BNCC (ex: EF05MA08)",
    "descricao": "descrição completa do objetivo"
  },
  "passo_a_passo": [
    {
      "numero": 1,
      "titulo": "Título da etapa",
      "duracao_minutos": 10,
      "descricao": "Descrição detalhada",
      "materiais": ["material1", "material2"]
    }
  ],
  "rubrica_avaliacao": {
    "criterios": [
      {
        "criterio": "Nome do critério",
        "insuficiente": "Descrição nível insuficiente",
        "basico": "Descrição nível básico",
        "proficiente": "Descrição nível proficiente",
        "avancado": "Descrição nível avançado"
      }
    ]
  }
}`;
}

// Endpoint principal para gerar plano de aula
app.post('/api/gerar-plano', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Validar dados de entrada
    const { disciplina, ano_escolar, tema, duracao_minutos, numero_alunos, recursos_disponiveis, objetivos_especificos, user_id } = req.body;
    
    if (!disciplina || !ano_escolar || !tema || !duracao_minutos) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Campos obrigatórios: disciplina, ano_escolar, tema, duracao_minutos'
      });
    }

    if (duracao_minutos <= 0 || duracao_minutos > 480) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Duração deve ser entre 1 e 480 minutos'
      });
    }

    // Gerar plano com Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = criarPrompt(req.body);
    
    console.log('Gerando plano de aula com Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoResposta = response.text();
    
    // Extrair JSON da resposta
    let planoGerado;
    try {
      // Tentar encontrar JSON na resposta
      const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planoGerado = JSON.parse(jsonMatch[0]);
      } else {
        planoGerado = JSON.parse(textoResposta);
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('Resposta da IA:', textoResposta);
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro ao processar resposta da IA. Tente novamente.',
        detalhes: parseError.message
      });
    }

    // Validar estrutura do JSON
    if (!planoGerado.introducao_ludica || !planoGerado.objetivo_bncc || 
        !planoGerado.passo_a_passo || !planoGerado.rubrica_avaliacao) {
      return res.status(500).json({
        erro: true,
        mensagem: 'Resposta da IA não contém todos os campos obrigatórios'
      });
    }

    // Salvar no Supabase
    const { data: planoSalvo, error: erroSupabase } = await supabase
      .from('planos_aula')
      .insert([{
        user_id: user_id || null,
        disciplina,
        ano_escolar,
        tema,
        duracao_minutos,
        numero_alunos,
        recursos_disponiveis,
        objetivos_especificos,
        plano_gerado: planoGerado
      }])
      .select()
      .single();

    if (erroSupabase) {
      console.error('Erro ao salvar no Supabase:', erroSupabase);
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro ao salvar plano no banco de dados',
        detalhes: erroSupabase.message
      });
    }

    // Registrar no histórico
    const tempoGeracao = Date.now() - startTime;
    await supabase.from('geracoes_historico').insert([{
      plano_id: planoSalvo.id,
      user_id: user_id || null,
      tokens_utilizados: response.usageMetadata?.totalTokenCount || 0,
      tempo_geracao_ms: tempoGeracao,
      modelo_ia: 'gemini-1.5-flash',
      sucesso: true
    }]);

    // Retornar sucesso
    res.json({
      sucesso: true,
      plano_id: planoSalvo.id,
      plano: planoGerado,
      tempo_geracao_ms: tempoGeracao
    });

  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    
    // Registrar erro no histórico
    const tempoGeracao = Date.now() - startTime;
    await supabase.from('geracoes_historico').insert([{
      user_id: req.body.user_id || null,
      tempo_geracao_ms: tempoGeracao,
      modelo_ia: 'gemini-1.5-flash',
      sucesso: false,
      erro_mensagem: error.message
    }]);

    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao gerar plano de aula',
      detalhes: error.message
    });
  }
});

// Endpoint para listar planos do usuário
app.get('/api/planos', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let query = supabase
      .from('planos_aula')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    res.json({ sucesso: true, planos: data });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao buscar planos',
      detalhes: error.message
    });
  }
});

// Endpoint para buscar um plano específico
app.get('/api/planos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('planos_aula')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    res.json({ sucesso: true, plano: data });
  } catch (error) {
    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao buscar plano',
      detalhes: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    gemini: !!process.env.GEMINI_API_KEY,
    supabase: !!process.env.SUPABASE_URL
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Acesse: http://localhost:${PORT}`);
});
