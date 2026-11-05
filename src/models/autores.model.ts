import { pool } from "../config/db.js";

// Busca autores. El nombre es opcional: si no se recibe, devuelve todos.
export async function findAllAuthors(nombre?: string) {
    const { rows } = await pool.query(
        `SELECT id_autor, nombre, nacionalidad
         FROM autores
         WHERE ($1::text IS NULL OR nombre ILIKE '%' || $1 || '%')
         ORDER BY id_autor`,
        [nombre ?? null],
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
