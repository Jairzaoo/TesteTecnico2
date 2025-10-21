import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function aplicarSchemaInterativo() {
    console.log('🚀 Configuração do Schema no Supabase\n');
    console.log('Por favor, forneça as credenciais corretas:\n');
    
    const host = await question('Host (padrão: aws-1-sa-east-1.pooler.supabase.com): ') || 'aws-1-sa-east-1.pooler.supabase.com';
    const port = await question('Porta (padrão: 6543): ') || '6543';
    const database = await question('Database (padrão: postgres): ') || 'postgres';
    const user = await question('Usuário (ex: postgres.bywxgzdwbnyyepzeptgx): ') || 'postgres.bywxgzdwbnyyepzeptgx';
    const password = await question('Senha: ');
    
    rl.close();
    
    console.log('\n🔌 Conectando ao Supabase...');
    
    const client = new Client({
        host,
        port: parseInt(port),
        database,
        user,
        password,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    });

    try {
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
        console.error('❌ Erro:', error.message);
        if (error.code === '28P01') {
            console.error('\n💡 Senha incorreta. Verifique suas credenciais no Supabase Dashboard:');
            console.error('   Settings > Database > Connection string');
        }
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🔌 Conexão fechada.');
    }
}

aplicarSchemaInterativo();
