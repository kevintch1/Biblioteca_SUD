import { pool } from "../config/db.js";

export async function findAllCategories() {
    const { rows } = await pool.query(
        "SELECT id_categoria, nombre FROM categorias ORDER BY id_categoria",
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
