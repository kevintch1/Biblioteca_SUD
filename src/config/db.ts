import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export function query(text: string, params?: any[]) {
    return pool.query(text, params);
