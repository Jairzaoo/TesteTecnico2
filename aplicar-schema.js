import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function aplicarSchema() {
    // URL correta fornecida pelo usuário
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
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        console.log('📄 Aplicando schema SQL...\n');
        
        // Executar o SQL
        await client.query(schemaSQL);
        
        console.log('✅ Schema aplicado com sucesso!');
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

        console.log('Políticas RLS configuradas:');
        rlsResult.rows.forEach(row => {
            console.log(`  ✓ ${row.tablename}: ${row.policyname}`);
        });

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
