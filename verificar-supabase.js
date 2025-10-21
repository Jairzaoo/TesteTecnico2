import pg from 'pg';

const { Client } = pg;

async function verificarSetup() {
    const connectionString = 'postgresql://postgres.bywxgzdwbnyyepzeptgx:desafiotecnico@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';
    
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔍 Verificando setup do Supabase...\n');
        await client.connect();
        console.log('✅ Conexão bem-sucedida!\n');

        // 1. Verificar tabelas
        console.log('📊 1. TABELAS:');
        const tablesResult = await client.query(`
            SELECT 
                table_name,
                (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as num_columns
            FROM information_schema.tables t
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        tablesResult.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name} (${row.num_columns} colunas)`);
        });

        // 2. Verificar colunas da tabela principal
        console.log('\n📋 2. COLUNAS DA TABELA planos_aula:');
        const columnsResult = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'planos_aula'
            ORDER BY ordinal_position;
        `);
        
        columnsResult.rows.forEach(row => {
            const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
            console.log(`   ✓ ${row.column_name}: ${row.data_type} (${nullable})`);
        });

        // 3. Verificar RLS
        console.log('\n🔒 3. ROW LEVEL SECURITY (RLS):');
        const rlsResult = await client.query(`
            SELECT tablename, COUNT(*) as num_policies
            FROM pg_policies 
            WHERE schemaname = 'public'
            GROUP BY tablename
            ORDER BY tablename;
        `);
        
        rlsResult.rows.forEach(row => {
            console.log(`   ✓ ${row.tablename}: ${row.num_policies} políticas`);
        });

        // 4. Verificar funções
        console.log('\n⚙️  4. FUNÇÕES:');
        const functionsResult = await client.query(`
            SELECT routine_name
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            ORDER BY routine_name;
        `);
        
        if (functionsResult.rows.length > 0) {
            functionsResult.rows.forEach(row => {
                console.log(`   ✓ ${row.routine_name}()`);
            });
        } else {
            console.log('   ⚠️  Nenhuma função personalizada encontrada');
        }

        // 5. Verificar triggers
        console.log('\n⚡ 5. TRIGGERS:');
        const triggersResult = await client.query(`
            SELECT trigger_name, event_object_table
            FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            ORDER BY event_object_table, trigger_name;
        `);
        
        if (triggersResult.rows.length > 0) {
            triggersResult.rows.forEach(row => {
                console.log(`   ✓ ${row.event_object_table}.${row.trigger_name}`);
            });
        } else {
            console.log('   ⚠️  Nenhum trigger encontrado');
        }

        // 6. Testar insert (rollback)
        console.log('\n🧪 6. TESTE DE INSERÇÃO (simulado):');
        try {
            await client.query('BEGIN');
            await client.query(`
                INSERT INTO public.planos_aula (disciplina, ano_escolar, tema, duracao_minutos, plano_gerado)
                VALUES ('Matemática', '5º Ano', 'Frações', 50, '{"teste": true}'::jsonb)
                RETURNING id;
            `);
            await client.query('ROLLBACK');
            console.log('   ✅ Inserção de teste OK (rollback executado)');
        } catch (error) {
            await client.query('ROLLBACK');
            console.log(`   ❌ Erro no teste: ${error.message}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✨ VERIFICAÇÃO COMPLETA!');
        console.log('='.repeat(60));
        console.log('\n📝 Resumo:');
        console.log(`   • ${tablesResult.rows.length} tabelas criadas`);
        console.log(`   • ${rlsResult.rows.reduce((sum, row) => sum + parseInt(row.num_policies), 0)} políticas RLS ativas`);
        console.log(`   • ${functionsResult.rows.length} funções personalizadas`);
        console.log(`   • ${triggersResult.rows.length} triggers configurados`);
        console.log('\n🚀 Banco de dados pronto para uso!\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

verificarSetup();
