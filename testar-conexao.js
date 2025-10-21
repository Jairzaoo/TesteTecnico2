import pg from 'pg';

const { Client } = pg;

async function testarConexao() {
    console.log('🔍 Testando diferentes formas de conexão...\n');
    
    const configs = [
        {
            name: 'Pooler Port 6543 (URL fornecida)',
            config: {
                host: 'aws-1-sa-east-1.pooler.supabase.com',
                port: 6543,
                database: 'postgres',
                user: 'postgres.bywxgzdwbnyyepzeptgx',
                password: 'desafio',
                ssl: { rejectUnauthorized: false }
            }
        },
        {
            name: 'Direct Connection Port 5432',
            config: {
                host: 'aws-0-sa-east-1.pooler.supabase.com',
                port: 5432,
                database: 'postgres',
                user: 'postgres.bywxgzdwbnyyepzeptgx',
                password: 'desafio',
                ssl: { rejectUnauthorized: false }
            }
        },
        {
            name: 'IPv6 Pooler',
            config: {
                host: 'aws-1-sa-east-1.pooler.supabase.com',
                port: 6543,
                database: 'postgres',
                user: 'postgres',
                password: 'desafio',
                ssl: { rejectUnauthorized: false }
            }
        }
    ];

    for (const { name, config } of configs) {
        console.log(`\n📡 Tentando: ${name}`);
        console.log(`   Host: ${config.host}`);
        console.log(`   Port: ${config.port}`);
        console.log(`   User: ${config.user}`);
        
        const client = new Client(config);
        
        try {
            await client.connect();
            console.log('   ✅ CONEXÃO BEM-SUCEDIDA!');
            
            const result = await client.query('SELECT version()');
            console.log('   📊 PostgreSQL:', result.rows[0].version.split(' ').slice(0, 2).join(' '));
            
            await client.end();
            
            console.log('\n✨ Use esta configuração:');
            console.log(JSON.stringify(config, null, 2));
            return config;
            
        } catch (error) {
            console.log(`   ❌ Falha: ${error.message}`);
        }
    }
    
    console.log('\n❌ Nenhuma configuração funcionou.');
    console.log('\n💡 Sugestão: Verifique se:');
    console.log('   1. A senha está correta');
    console.log('   2. O projeto Supabase está ativo');
    console.log('   3. O acesso por IPv4/IPv6 está configurado');
    console.log('   4. As credenciais no painel do Supabase em Settings > Database');
}

testarConexao();
