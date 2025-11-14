import { app } from './app';
import { env } from './config/env';
import { pool } from './config/database';

const testDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Conexão com o MySQL estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Falha ao conectar no MySQL. Verifique as credenciais e o firewall.', error);
  }
};

const startServer = async () => {
  await testDatabaseConnection();

  const port = env.port;
  app.listen(port, () => {
    console.log(`🚪 Servidor iniciado na porta ${port}`);
  });
};

startServer();
