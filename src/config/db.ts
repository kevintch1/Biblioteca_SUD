
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Función auxiliar para ejecutar consultas SQL
export const query = (text: string, params?: any[]) =>
    pool.query(text, params);
