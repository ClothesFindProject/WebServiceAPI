"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Usuarios - Clothes',
            version: '1.0.0',
            description: 'Documentacao da API de usuarios com autenticacao e CRUD completo.',
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.port}`,
                description: 'Servidor local',
            },
        ],
    },
    apis: ['src/routes/**/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map