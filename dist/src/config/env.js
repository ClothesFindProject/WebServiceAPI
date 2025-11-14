"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// src/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const getEnvVar = (...keys) => {
    for (const key of keys) {
        const value = process.env[key];
        if (value)
            return value;
    }
    return undefined;
};
const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
};
const toBoolean = (value) => {
    if (!value)
        return false;
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};
const dbHost = getEnvVar('DB_HOST', 'MYSQL_HOST');
const dbUser = getEnvVar('DB_USER', 'MYSQL_USER');
const dbName = getEnvVar('DB_NAME', 'MYSQL_DATABASE');
const jwtSecret = process.env.JWT_SECRET;
const missing = [];
if (!dbHost)
    missing.push('DB_HOST | MYSQL_HOST');
if (!dbUser)
    missing.push('DB_USER | MYSQL_USER');
if (!dbName)
    missing.push('DB_NAME | MYSQL_DATABASE');
if (!jwtSecret)
    missing.push('JWT_SECRET');
if (missing.length > 0)
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
const resolvedDbHost = dbHost;
const resolvedDbUser = dbUser;
const resolvedDbName = dbName;
const resolvedJwtSecret = jwtSecret;
exports.env = {
    port: toNumber(process.env.PORT, 3000),
    jwtSecret: resolvedJwtSecret,
    database: {
        host: resolvedDbHost,
        port: toNumber(getEnvVar('DB_PORT', 'MYSQL_PORT'), 3306),
        user: resolvedDbUser,
        password: getEnvVar('DB_PASSWORD', 'MYSQL_PASSWORD') ?? '',
        name: resolvedDbName,
        connectionLimit: toNumber(getEnvVar('DB_CONNECTION_LIMIT', 'MYSQL_CONNECTION_LIMIT'), 10),
        // ✅ NOVO: SSL
        ssl: toBoolean(getEnvVar('DB_SSL', 'MYSQL_SSL')),
        // ✅ NOVO: CA opcional (preserva quebras de linha escapadas)
        ca: getEnvVar('DB_SSL_CA', 'MYSQL_SSL_CA')?.replace(/\\n/g, '\n'),
    },
};
//# sourceMappingURL=env.js.map