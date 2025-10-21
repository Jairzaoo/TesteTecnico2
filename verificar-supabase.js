import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function verificarSetup() {
    // Usar variáveis de ambiente para segurança
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    try {
        console.log('🔍 Verificando setup do Supabase...\n');
        
        // Testar conexão básica
        const { data: testData, error: testError } = await supabase
            .from('planos_aula')
            .select('count')
            .limit(0);
            
        if (testError) {
            console.log('❌ Erro de conexão:', testError.message);
            return;
        }
        
        console.log('✅ Conexão bem-sucedida!\n');

        // Verificar se as tabelas existem
        console.log('📊 1. TABELAS:');
        
        const tabelas = ['geracoes_historico', 'planos_aula', 'profiles'];
        let tabelasOk = 0;
        
        for (const tabela of tabelas) {
            try {
                const { error } = await supabase.from(tabela).select('count').limit(0);
                if (error) {
                    console.log(`   ❌ ${tabela}: ${error.message}`);
                } else {
                    console.log(`   ✓ ${tabela} (tabela existe)`);
                    tabelasOk++;
                }
            } catch (err) {
                console.log(`   ❌ ${tabela}: Erro ao verificar`);
            }
        }

        // Teste básico de inserção 
        console.log('\n🧪 2. TESTE DE INSERÇÃO (simulado):');
        try {
            const planoTeste = {
                disciplina: 'Matemática',
                ano_escolar: '5º ano EF',
                tema: 'Teste de Verificação',
                duracao_minutos: 50,
                plano_gerado: { teste: true }
            };
            
            const { data, error } = await supabase
                .from('planos_aula')
                .insert([planoTeste])
                .select('id');

            if (error) {
                console.log(`   ❌ Erro na inserção: ${error.message}`);
            } else {
                console.log('   ✅ Inserção de teste OK (limpando...)');
                
                // Limpar teste
                await supabase
                    .from('planos_aula')
                    .delete()
                    .eq('id', data[0].id);
                    
                console.log('   ✅ Teste limpo com sucesso');
            }
        } catch (error) {
            console.log(`   ❌ Erro no teste: ${error.message}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✨ VERIFICAÇÃO COMPLETA!');
        console.log('='.repeat(60));
        
        if (tabelasOk === 3) {
            console.log('\n🚀 Banco de dados pronto para uso!\n');
        } else {
            console.log('\n⚠️  Execute o schema SQL no Supabase Dashboard\n');
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
        console.log('\n💡 Verifique suas credenciais no arquivo .env\n');
        process.exit(1);
    }
}

verificarSetup();
