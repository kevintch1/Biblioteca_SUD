// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Biblioteca',
      version: '1.0.0',
      description: 'Documentación de la API de Préstamos, Usuarios y Libros',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  // Ruta donde Swagger buscará los comentarios JSDoc
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

// fin - src/config/swagger.ts