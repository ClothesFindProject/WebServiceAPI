"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logConfiguration = () => {
    console.log('🛠️ Configuração atual da API:');
    console.log(`  Porta HTTP: ${env_1.env.port}`);
    console.log('  Banco de Dados:');
    console.log(`    Host: ${env_1.env.database.host}`);
    console.log(`    Porta: ${env_1.env.database.port}`);
    console.log(`    Database: ${env_1.env.database.name}`);
    console.log(`    Usuário: ${env_1.env.database.user}`);
    console.log(`    Senha: ${env_1.env.database.password ?? ''}`);
};
const testDatabaseConnection = async () => {
    try {
        const connection = await database_1.pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Conexão com o MySQL estabelecida com sucesso.');
    }
    catch (error) {
        console.error('❌ Falha ao conectar no MySQL. Verifique as credenciais e o firewall.', error);
    }
};
const startServer = async () => {
    logConfiguration();
    await testDatabaseConnection();
    const port = env_1.env.port;
    app_1.app.listen(port, () => {
        console.log(`Servidor iniciado na porta ${port}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map