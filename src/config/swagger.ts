import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Usuarios - Clothes',
      version: '1.0.0',
      description: 'Documentacao da API de usuarios com autenticacao e CRUD completo.',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Servidor local',
      },
    ],
  },
  apis: ['src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
