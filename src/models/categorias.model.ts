import { pool } from "../config/db.js";

// Busca categorías. El nombre es opcional: si no se recibe, devuelve todas.
export async function findAllCategories(nombre?: string) {
    const { rows } = await pool.query(
        `SELECT id_categoria, nombre
         FROM categorias
         WHERE ($1::text IS NULL OR nombre ILIKE '%' || $1 || '%')
         ORDER BY id_categoria`,
        [nombre ?? null],
    );
    return rows;
}

export async function findCategoryById(id: number) {
    const { rows } = await pool.query(
        "SELECT id_categoria, nombre FROM categorias WHERE id_categoria = $1",
        [id],
    );
    return rows[0];
}

export async function createCategory(nombre: string) {
    const { rows } = await pool.query(
        "INSERT INTO categorias (nombre) VALUES ($1) RETURNING id_categoria, nombre",
        [nombre],
    );
    return rows[0];
}

export async function updateCategory(id: number, nombre: string) {
    const { rows } = await pool.query(
        "UPDATE categorias SET nombre = $1 WHERE id_categoria = $2 RETURNING id_categoria, nombre",
        [nombre, id],
    );
    return rows[0];
}

export async function deleteCategory(id: number) {
    const result = await pool.query(
        "DELETE FROM categorias WHERE id_categoria = $1",
        [id],
    );
    return result.rowCount;
}
