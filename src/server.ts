import { app } from './app';
import { env } from './config/env';
import { pool } from './config/database';

const logConfiguration = () => {
  console.log('🛠️ Configuração atual da API:');
  console.log(`  Porta HTTP: ${env.port}`);
  console.log('  Banco de Dados:');
  console.log(`    Host: ${env.database.host}`);
  console.log(`    Porta: ${env.database.port}`);
  console.log(`    Database: ${env.database.name}`);
  console.log(`    Usuário: ${env.database.user}`);
  console.log(`    Senha: ${env.database.password ?? ''}`);
};

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
  logConfiguration();
  await testDatabaseConnection();

  const port = env.port;
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
  });
};

startServer();
