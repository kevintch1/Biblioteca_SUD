// src/config/db.ts

import pkg from "pg";

const { Pool } = pkg;

// const pool = new Pool({
//  user: process.env.DB_USER,
//  host: process.env.DB_HOST,
//  database: process.env.DB_NAME,
//  password: String(process.env.DB_PASSWORD), // Forzar a que sea string previene este error
//  port: process.env.DB_PORT,
// });

// Configuración centralizada del Pool usando variables de entorno globales
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Función de consulta rápida reutilizable en toda la app
export const query = (text: string, params?: any[]) => pool.query(text, params);
// fin - src/config/db.ts