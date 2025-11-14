"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
const sslOptions = env_1.env.database.ssl === true
    ? env_1.env.database.ca
        ? { ca: env_1.env.database.ca }
        : { rejectUnauthorized: false }
    : undefined;
const poolConfig = {
    host: env_1.env.database.host,
    port: env_1.env.database.port,
    user: env_1.env.database.user,
    password: env_1.env.database.password,
    database: env_1.env.database.name,
    waitForConnections: true,
    connectionLimit: env_1.env.database.connectionLimit,
    queueLimit: 0,
};
if (sslOptions) {
    poolConfig.ssl = sslOptions;
}
exports.pool = promise_1.default.createPool(poolConfig);
//# sourceMappingURL=database.js.map