"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
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
    await testDatabaseConnection();
    const port = env_1.env.port;
    app_1.app.listen(port, () => {
        console.log(`🚪 Servidor iniciado na porta ${port}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map