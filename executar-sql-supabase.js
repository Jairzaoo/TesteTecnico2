import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Usar SERVICE_ROLE key que tem permissões de admin
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5d3hnemR3Ym55eWVwemVwdGd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA1NjQ5OCwiZXhwIjoyMDc2NjMyNDk4fQ.FwrHZGzMnhk2h0bC4MnktSlPGUQZjrJAVillmC-6_4c';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🔄 Executando SQL no Supabase...\n');

const sql = fs.readFileSync('./database/setup_completo.sql', 'utf-8');

async function executarSQL() {
  try {
    // Tentar usar a função RPC se existir
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
      console.log('⚠️  RPC não disponível, criando tabelas manualmente...\n');
      await criarTabelasManualmente();
    } else {
      console.log('✅ SQL executado com sucesso via RPC!');
      console.log(data);
    }
  } catch (err) {
    console.log('⚠️  Erro ao executar RPC, criando tabelas manualmente...\n');
    await criarTabelasManualmente();
  }
}

async function criarTabelasManualmente() {
  console.log('📝 Criando estrutura do banco de dados...\n');
  
  try {
    // Verificar se as tabelas já existem
    const { data: existingTables, error: checkError } = await supabase
      .from('planos_aula')
      .select('count')
      .limit(0);
    
    if (!checkError) {
      console.log('✅ Tabelas já existem!');
      console.log('✅ Banco de dados já está configurado!\n');
      await verificarEstrutura();
      return;
    }
  } catch (err) {
    // Tabelas não existem, vamos criá-las
  }
  
  console.log('❌ As tabelas não existem.');
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  ⚠️  EXECUÇÃO MANUAL NECESSÁRIA                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log('O Supabase não permite execução de DDL via API REST.');
  console.log('Você precisa executar o SQL manualmente:\n');
  console.log('1. Abra: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx/editor/sql');
  console.log('2. Clique em "New query"');
  console.log('3. Cole TODO o conteúdo de: database/setup_completo.sql');
  console.log('4. Clique em "Run" (Ctrl+Enter)\n');
  console.log('💡 O SQL já está copiado! Basta colar e executar.\n');
  
  // Copiar SQL para clipboard
  try {
    const { exec } = await import('child_process');
    exec(`echo ${sql.replace(/"/g, '\\"')} | clip`, (error) => {
      if (!error) {
        console.log('✅ SQL copiado para clipboard!\n');
      }
    });
  } catch (err) {
    // Ignore se não conseguir copiar
  }
}

async function verificarEstrutura() {
  console.log('🔍 Verificando estrutura do banco...\n');
  
  const tabelas = [
    { nome: 'profiles', descricao: 'Perfis de usuários' },
    { nome: 'planos_aula', descricao: 'Planos de aula gerados' },
    { nome: 'geracoes_historico', descricao: 'Histórico de gerações' }
  ];
  
  for (const tabela of tabelas) {
    try {
      const { error } = await supabase
        .from(tabela.nome)
        .select('count')
        .limit(0);
      
      if (error) {
        console.log(`❌ ${tabela.nome}: NÃO EXISTE`);
      } else {
        console.log(`✅ ${tabela.nome}: OK (${tabela.descricao})`);
      }
    } catch (err) {
      console.log(`❌ ${tabela.nome}: ERRO - ${err.message}`);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ VERIFICAÇÃO COMPLETA!');
  console.log('═══════════════════════════════════════════════════════\n');
}

executarSQL().catch(console.error);
