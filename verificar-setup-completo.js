#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('\n🔍 VERIFICANDO CONFIGURAÇÃO DO SUPABASE...\n');

async function verificarTudo() {
  let tudoOk = true;
  
  // 1. Verificar tabelas
  console.log('📊 Verificando tabelas:\n');
  
  const tabelas = [
    { nome: 'profiles', descricao: 'Perfis de usuários' },
    { nome: 'planos_aula', descricao: 'Planos de aula' },
    { nome: 'geracoes_historico', descricao: 'Histórico' }
  ];
  
  for (const tabela of tabelas) {
    try {
      const { error } = await supabase
        .from(tabela.nome)
        .select('count')
        .limit(0);
      
      if (error) {
        console.log(`❌ ${tabela.nome.padEnd(20)} NÃO EXISTE`);
        tudoOk = false;
      } else {
        console.log(`✅ ${tabela.nome.padEnd(20)} OK - ${tabela.descricao}`);
      }
    } catch (err) {
      console.log(`❌ ${tabela.nome.padEnd(20)} ERRO: ${err.message}`);
      tudoOk = false;
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════\n');
  
  // 2. Testar inserção
  if (tudoOk) {
    console.log('🧪 Testando inserção de dados...\n');
    
    const planoTeste = {
      disciplina: 'Teste',
      ano_escolar: 'Teste',
      tema: 'Verificação de Instalação',
      duracao_minutos: 50,
      plano_gerado: {
        introducao_ludica: 'Teste',
        objetivo_bncc: { codigo: 'TEST', descricao: 'Teste' },
        passo_a_passo: [],
        rubrica_avaliacao: { criterios: [] }
      }
    };
    
    try {
      const { data, error } = await supabase
        .from('planos_aula')
        .insert([planoTeste])
        .select();
      
      if (error) {
        console.log(`❌ Erro ao inserir: ${error.message}\n`);
        tudoOk = false;
      } else {
        console.log(`✅ Inserção funcionou! ID: ${data[0].id}\n`);
        
        // Limpar teste
        await supabase
          .from('planos_aula')
          .delete()
          .eq('id', data[0].id);
        
        console.log(`✅ Teste limpo com sucesso!\n`);
      }
    } catch (err) {
      console.log(`❌ Erro no teste: ${err.message}\n`);
      tudoOk = false;
    }
  }
  
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (tudoOk) {
    console.log('🎉 PARABÉNS! TUDO CONFIGURADO CORRETAMENTE!\n');
    console.log('✅ Tabelas criadas');
    console.log('✅ Permissões OK');
    console.log('✅ Inserção funcionando\n');
    console.log('🚀 Próximos passos:');
    console.log('   1. Configure GEMINI_API_KEY no .env');
    console.log('   2. Execute: npm start');
    console.log('   3. Acesse: http://localhost:3000');
    console.log('   4. Gere seu primeiro plano de aula!\n');
  } else {
    console.log('❌ CONFIGURAÇÃO INCOMPLETA\n');
    console.log('Execute o SQL no Supabase Dashboard → SQL Editor\n');
  }
  
  console.log('═══════════════════════════════════════════════════════\n');
}

verificarTudo().catch(err => {
  console.error('\n❌ Erro fatal:', err.message, '\n');
  process.exit(1);
});
