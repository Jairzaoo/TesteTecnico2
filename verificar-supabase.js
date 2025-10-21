import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('🔍 Verificando configuração do Supabase...\n');

async function verificarConexao() {
  try {
    // Testar conexão listando tabelas via REST API
    const { data, error } = await supabase
      .from('planos_aula')
      .select('count')
      .limit(0);

    if (error) {
      console.log('❌ Erro ao conectar:', error.message);
      console.log('\n⚠️  Possíveis causas:');
      console.log('   1. Tabelas ainda não foram criadas');
      console.log('   2. Execute o SQL: database/setup_completo.sql');
      console.log('   3. Link: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor/sql');
      return false;
    }

    console.log('✅ Conexão com Supabase OK!');
    console.log('✅ Tabela planos_aula encontrada!');
    return true;

  } catch (err) {
    console.log('❌ Erro:', err.message);
    return false;
  }
}

async function verificarTabelas() {
  console.log('\n📊 Verificando tabelas...\n');

  const tabelas = ['profiles', 'planos_aula', 'geracoes_historico'];

  for (const tabela of tabelas) {
    try {
      const { error } = await supabase
        .from(tabela)
        .select('count')
        .limit(0);

      if (error) {
        console.log(`❌ ${tabela}: NÃO ENCONTRADA`);
      } else {
        console.log(`✅ ${tabela}: OK`);
      }
    } catch (err) {
      console.log(`❌ ${tabela}: ERRO - ${err.message}`);
    }
  }
}

async function testarInsercao() {
  console.log('\n🧪 Testando inserção de dados...\n');

  const dadosTeste = {
    disciplina: 'Matemática',
    ano_escolar: '5º ano EF',
    tema: 'Teste de Conexão',
    duracao_minutos: 50,
    plano_gerado: {
      introducao_ludica: 'Teste',
      objetivo_bncc: { codigo: 'TEST01', descricao: 'Teste' },
      passo_a_passo: [],
      rubrica_avaliacao: { criterios: [] }
    }
  };

  try {
    const { data, error } = await supabase
      .from('planos_aula')
      .insert(dadosTeste)
      .select();

    if (error) {
      console.log('❌ Erro ao inserir:', error.message);
      return false;
    }

    console.log('✅ Inserção funcionou!');
    console.log('✅ ID do teste:', data[0].id);

    // Limpar teste
    await supabase
      .from('planos_aula')
      .delete()
      .eq('id', data[0].id);

    console.log('✅ Teste limpo com sucesso!');
    return true;

  } catch (err) {
    console.log('❌ Erro no teste:', err.message);
    return false;
  }
}

async function main() {
  const conexaoOk = await verificarConexao();
  
  if (!conexaoOk) {
    console.log('\n❌ Configure o banco primeiro!');
    process.exit(1);
  }

  await verificarTabelas();
  await testarInsercao();

  console.log('\n═══════════════════════════════════════════');
  console.log('✅ CONFIGURAÇÃO COMPLETA!');
  console.log('═══════════════════════════════════════════');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Configure GEMINI_API_KEY no .env');
  console.log('   2. Execute: npm start');
  console.log('   3. Acesse: http://localhost:3000\n');
}

main();
