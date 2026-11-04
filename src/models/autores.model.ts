import { pool } from "../config/db.js";

export async function findAllAuthors() {
    const { rows } = await pool.query(
        "SELECT id_autor, nombre, nacionalidad FROM autores ORDER BY id_autor",
    );
    return rows;
}

export async function findAuthorById(id: number) {
    const { rows } = await pool.query(
        "SELECT id_autor, nombre, nacionalidad FROM autores WHERE id_autor = $1",
        [id],
    );
    return rows[0];
}

export async function createAuthor(nombre: string, nacionalidad: string | null) {
    const { rows } = await pool.query(
        "INSERT INTO autores (nombre, nacionalidad) VALUES ($1, $2) RETURNING id_autor, nombre, nacionalidad",
        [nombre, nacionalidad],
    );
    return rows[0];
}

export async function updateAuthor(
    id: number,
    nombre: string,
    nacionalidad: string | null,
) {
    const { rows } = await pool.query(
        "UPDATE autores SET nombre = $1, nacionalidad = $2 WHERE id_autor = $3 RETURNING id_autor, nombre, nacionalidad",
        [nombre, nacionalidad, id],
    );
    return rows[0];
}

export async function deleteAuthor(id: number) {
    const result = await pool.query(
        "DELETE FROM autores WHERE id_autor = $1",
        [id],
    );
    return result.rowCount;
}
