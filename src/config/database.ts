import mysql, { PoolOptions } from 'mysql2/promise';
import { env } from './env';

const sslOptions: PoolOptions['ssl'] =
  env.database.ssl === true
    ? env.database.ca
      ? { ca: env.database.ca }
      : { rejectUnauthorized: false }
    : undefined;

const poolConfig: PoolOptions = {
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  waitForConnections: true,
  connectionLimit: env.database.connectionLimit,
  queueLimit: 0,
};

if (sslOptions) {
  poolConfig.ssl = sslOptions;
}

export const pool = mysql.createPool(poolConfig);

export type DbPool = typeof pool;
