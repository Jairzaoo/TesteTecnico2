import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

console.log('🔍 TESTE COMPLETO DO SISTEMA - SIMULAÇÃO DE PRODUÇÃO\n');
console.log('='.repeat(70));

const erros = [];
const avisos = [];
const sucessos = [];

// 1. VERIFICAR VARIÁVEIS DE AMBIENTE
console.log('\n📋 1. VERIFICANDO VARIÁVEIS DE AMBIENTE...\n');

if (!process.env.SUPABASE_URL) {
    erros.push('SUPABASE_URL não configurada');
} else if (process.env.SUPABASE_URL.includes('your_')) {
    erros.push('SUPABASE_URL ainda está com valor padrão');
} else {
    sucessos.push(`SUPABASE_URL: ${process.env.SUPABASE_URL}`);
}

if (!process.env.SUPABASE_ANON_KEY) {
    erros.push('SUPABASE_ANON_KEY não configurada');
} else if (process.env.SUPABASE_ANON_KEY.includes('your_')) {
    erros.push('SUPABASE_ANON_KEY ainda está com valor padrão');
} else {
    sucessos.push(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY.substring(0, 20)}...`);
}

if (!process.env.GEMINI_API_KEY) {
    erros.push('GEMINI_API_KEY não configurada');
} else if (process.env.GEMINI_API_KEY.includes('your_')) {
    erros.push('GEMINI_API_KEY ainda está com valor padrão');
} else {
    sucessos.push(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY.substring(0, 20)}...`);
}

sucessos.forEach(s => console.log(`   ✅ ${s}`));
erros.forEach(e => console.log(`   ❌ ${e}`));

if (erros.length > 0) {
    console.log('\n❌ Configure o arquivo .env antes de continuar!');
    process.exit(1);
}

// 2. TESTAR CONEXÃO COM SUPABASE
console.log('\n📊 2. TESTANDO CONEXÃO COM SUPABASE...\n');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

try {
    // Testar tabela planos_aula
    const { data, error } = await supabase
        .from('planos_aula')
        .select('count')
        .limit(0);
    
    if (error) {
        erros.push(`Erro ao acessar tabela planos_aula: ${error.message}`);
        console.log(`   ❌ Tabela planos_aula: ${error.message}`);
    } else {
        sucessos.push('Tabela planos_aula acessível');
        console.log('   ✅ Tabela planos_aula: OK');
    }

    // Testar tabela profiles
    const { error: error2 } = await supabase
        .from('profiles')
        .select('count')
        .limit(0);
    
    if (error2) {
        avisos.push(`Tabela profiles: ${error2.message}`);
        console.log(`   ⚠️  Tabela profiles: ${error2.message}`);
    } else {
        console.log('   ✅ Tabela profiles: OK');
    }

    // Testar tabela geracoes_historico
    const { error: error3 } = await supabase
        .from('geracoes_historico')
        .select('count')
        .limit(0);
    
    if (error3) {
        avisos.push(`Tabela geracoes_historico: ${error3.message}`);
        console.log(`   ⚠️  Tabela geracoes_historico: ${error3.message}`);
    } else {
        console.log('   ✅ Tabela geracoes_historico: OK');
    }

} catch (error) {
    erros.push(`Erro ao conectar com Supabase: ${error.message}`);
    console.log(`   ❌ ${error.message}`);
}

// 3. TESTAR GEMINI API
console.log('\n🤖 3. TESTANDO GEMINI API...\n');

try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log('   🔄 Enviando requisição de teste para Gemini...');
    const result = await model.generateContent('Responda apenas "OK" se você estiver funcionando.');
    const response = await result.response;
    const text = response.text();
    
    console.log(`   ✅ Resposta recebida: "${text.substring(0, 50)}..."`);
    console.log(`   ✅ Tokens utilizados: ${response.usageMetadata?.totalTokenCount || 'N/A'}`);
    sucessos.push('Gemini API funcionando');
    
} catch (error) {
    erros.push(`Erro ao conectar com Gemini: ${error.message}`);
    console.log(`   ❌ ${error.message}`);
}

// 4. TESTE COMPLETO DE GERAÇÃO DE PLANO
console.log('\n🎯 4. TESTE DE GERAÇÃO DE PLANO COMPLETO...\n');

try {
    const dadosTeste = {
        disciplina: 'Matemática',
        ano_escolar: '5º ano EF',
        tema: 'Frações',
        duracao_minutos: 50,
        numero_alunos: 30,
        recursos_disponiveis: ['Quadro', 'Livros didáticos'],
        objetivos_especificos: 'Compreender conceito de frações e suas representações'
    };

    console.log('   📝 Dados do teste:');
    console.log(`      - Disciplina: ${dadosTeste.disciplina}`);
    console.log(`      - Ano: ${dadosTeste.ano_escolar}`);
    console.log(`      - Tema: ${dadosTeste.tema}`);
    console.log(`      - Duração: ${dadosTeste.duracao_minutos} minutos`);
    
    // Criar prompt
    const prompt = `Você é um assistente especializado em educação brasileira e na Base Nacional Comum Curricular (BNCC).

Crie um plano de aula detalhado e personalizado com base nas seguintes informações:

- Disciplina: ${dadosTeste.disciplina}
- Ano Escolar: ${dadosTeste.ano_escolar}
- Tema: ${dadosTeste.tema}
- Duração: ${dadosTeste.duracao_minutos} minutos
- Número de Alunos: ${dadosTeste.numero_alunos}
- Recursos Disponíveis: ${dadosTeste.recursos_disponiveis.join(', ')}
- Objetivos Específicos: ${dadosTeste.objetivos_especificos}

O plano de aula deve conter OBRIGATORIAMENTE:

1. **Introdução Lúdica**: Uma forma criativa, engajadora e divertida de apresentar o tema aos alunos.

2. **Objetivo de Aprendizagem da BNCC**: Identifique e cite o código específico da BNCC.

3. **Passo a Passo da Atividade**: Um roteiro detalhado dividido em etapas.

4. **Rubrica de Avaliação**: Critérios claros para avaliação do aprendizado.

IMPORTANTE: Responda APENAS com um JSON válido no seguinte formato:

{
  "introducao_ludica": "texto descritivo criativo",
  "objetivo_bncc": {
    "codigo": "código da BNCC",
    "descricao": "descrição completa"
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
        "insuficiente": "Desc",
        "basico": "Desc",
        "proficiente": "Desc",
        "avancado": "Desc"
      }
    ]
  }
}`;

    console.log('\n   🔄 Gerando plano com Gemini...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoResposta = response.text();
    const tempoGeracao = Date.now() - startTime;
    
    console.log(`   ✅ Plano gerado em ${tempoGeracao}ms`);
    console.log(`   ✅ Tokens: ${response.usageMetadata?.totalTokenCount || 'N/A'}`);
    
    // Parse do JSON
    let planoGerado;
    try {
        const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            planoGerado = JSON.parse(jsonMatch[0]);
        } else {
            planoGerado = JSON.parse(textoResposta);
        }
        console.log('   ✅ JSON parseado com sucesso');
    } catch (parseError) {
        erros.push('Erro ao fazer parse do JSON da IA');
        console.log(`   ❌ Erro no parse: ${parseError.message}`);
        console.log(`   📄 Resposta: ${textoResposta.substring(0, 200)}...`);
        throw parseError;
    }

    // Validar estrutura
    console.log('\n   🔍 Validando estrutura do plano...');
    
    if (!planoGerado.introducao_ludica) {
        erros.push('Campo "introducao_ludica" ausente');
        console.log('   ❌ introducao_ludica: AUSENTE');
    } else {
        console.log(`   ✅ introducao_ludica: OK (${planoGerado.introducao_ludica.length} caracteres)`);
    }

    if (!planoGerado.objetivo_bncc || !planoGerado.objetivo_bncc.codigo) {
        erros.push('Campo "objetivo_bncc" ausente ou inválido');
        console.log('   ❌ objetivo_bncc: AUSENTE');
    } else {
        console.log(`   ✅ objetivo_bncc: ${planoGerado.objetivo_bncc.codigo}`);
    }

    if (!planoGerado.passo_a_passo || planoGerado.passo_a_passo.length === 0) {
        erros.push('Campo "passo_a_passo" ausente ou vazio');
        console.log('   ❌ passo_a_passo: AUSENTE');
    } else {
        console.log(`   ✅ passo_a_passo: ${planoGerado.passo_a_passo.length} etapas`);
    }

    if (!planoGerado.rubrica_avaliacao || !planoGerado.rubrica_avaliacao.criterios) {
        erros.push('Campo "rubrica_avaliacao" ausente');
        console.log('   ❌ rubrica_avaliacao: AUSENTE');
    } else {
        console.log(`   ✅ rubrica_avaliacao: ${planoGerado.rubrica_avaliacao.criterios.length} critérios`);
    }

    // Salvar no Supabase
    console.log('\n   💾 Salvando no Supabase...');
    
    const { data: planoSalvo, error: erroSupabase } = await supabase
        .from('planos_aula')
        .insert([{
            ...dadosTeste,
            plano_gerado: planoGerado
        }])
        .select()
        .single();

    if (erroSupabase) {
        erros.push(`Erro ao salvar: ${erroSupabase.message}`);
        console.log(`   ❌ ${erroSupabase.message}`);
    } else {
        console.log(`   ✅ Plano salvo com ID: ${planoSalvo.id}`);
        
        // Registrar no histórico
        await supabase.from('geracoes_historico').insert([{
            plano_id: planoSalvo.id,
            tokens_utilizados: response.usageMetadata?.totalTokenCount || 0,
            tempo_geracao_ms: tempoGeracao,
            modelo_ia: 'gemini-1.5-flash',
            sucesso: true
        }]);
        console.log('   ✅ Histórico registrado');
        
        // Limpar teste
        await supabase.from('planos_aula').delete().eq('id', planoSalvo.id);
        console.log('   🧹 Teste limpo do banco');
    }

    sucessos.push('Teste de geração completo bem-sucedido');

} catch (error) {
    erros.push(`Erro no teste de geração: ${error.message}`);
    console.log(`   ❌ ${error.message}`);
}

// RELATÓRIO FINAL
console.log('\n' + '='.repeat(70));
console.log('📊 RELATÓRIO FINAL\n');
console.log(`✅ Sucessos: ${sucessos.length}`);
console.log(`⚠️  Avisos: ${avisos.length}`);
console.log(`❌ Erros: ${erros.length}`);

if (erros.length > 0) {
    console.log('\n❌ ERROS ENCONTRADOS:');
    erros.forEach((e, i) => console.log(`   ${i + 1}. ${e}`));
}

if (avisos.length > 0) {
    console.log('\n⚠️  AVISOS:');
    avisos.forEach((a, i) => console.log(`   ${i + 1}. ${a}`));
}

console.log('\n' + '='.repeat(70));

if (erros.length === 0) {
    console.log('✨ SISTEMA 100% OPERACIONAL - PRONTO PARA PRODUÇÃO! ✨');
} else {
    console.log('⚠️  SISTEMA COM PROBLEMAS - REVISE OS ERROS ACIMA');
    process.exit(1);
}

console.log('='.repeat(70) + '\n');
