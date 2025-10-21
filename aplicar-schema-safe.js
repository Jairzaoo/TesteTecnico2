import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function aplicarSchema() {
    const connectionString = 'postgresql://postgres.bywxgzdwbnyyepzeptgx:desafiotecnico@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';
    
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000
    });

    try {
        console.log('🔌 Conectando ao Supabase...');
        await client.connect();
        console.log('✅ Conectado com sucesso!\n');

        // Ler o arquivo schema.sql
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        let schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        console.log('📄 Aplicando schema SQL...\n');
        
        // Dividir em statements individuais para melhor controle de erros
        const statements = schemaSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const statement of statements) {
            try {
                await client.query(statement);
                successCount++;
            } catch (error) {
                // Ignorar erros de objetos já existentes
                if (
                    error.code === '42710' || // trigger já existe
                    error.code === '42P07' || // tabela já existe
                    error.code === '42723' || // função já existe
                    error.message.includes('already exists')
                ) {
                    skipCount++;
                    console.log(`⏭️  Pulado: ${error.message.split('\n')[0]}`);
                } else {
                    errorCount++;
                    console.error(`❌ Erro: ${error.message.split('\n')[0]}`);
                }
            }
        }

        console.log('\n📊 Resumo da Aplicação:');
        console.log(`   ✅ Executados: ${successCount}`);
        console.log(`   ⏭️  Pulados (já existem): ${skipCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);

        console.log('\n📊 Verificando tabelas criadas...\n');

        // Verificar tabelas criadas
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log('Tabelas no banco:');
        result.rows.forEach(row => {
            console.log(`  ✓ ${row.table_name}`);
        });

        // Verificar políticas RLS
        console.log('\n🔒 Verificando Row Level Security...\n');
        const rlsResult = await client.query(`
            SELECT schemaname, tablename, policyname 
            FROM pg_policies 
            WHERE schemaname = 'public'
            ORDER BY tablename, policyname;
        `);

        if (rlsResult.rows.length > 0) {
            console.log('Políticas RLS configuradas:');
            rlsResult.rows.forEach(row => {
                console.log(`  ✓ ${row.tablename}: ${row.policyname}`);
            });
        } else {
            console.log('⚠️  Nenhuma política RLS encontrada.');
        }

        console.log('\n✨ Setup do banco de dados concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao aplicar schema:', error.message);
        console.error('\nDetalhes:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🔌 Conexão fechada.');
    }
}

aplicarSchema();
