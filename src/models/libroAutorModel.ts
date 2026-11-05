import { number } from "zod";
import { query } from "../config/db.js";

export async function getLibroAutorModel(filters: {
    id_libro?: number | undefined;
    id_autor?: number | undefined;
}) {
    let text = `
        SELECT * FROM libro_autor
        WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (filters.id_libro) {
        text += ` AND id_libro = $${paramIndex}`;
        values.push(filters.id_libro);
        paramIndex++;
    }

    if (filters.id_autor) {
        text += ` AND id_autor = $${paramIndex}`;
        values.push(filters.id_autor);
        paramIndex++;
    }

    text += " ORDER BY id_libro ASC";

    const { rows } = await query(text, values);
    return rows;
}

export async function createLibroAutorModel(
    id_libro: number,
    id_autor: number
) {
    const text = `
        INSERT INTO libro_autor (id_libro, id_autor)
        VALUES ($1, $2)
        RETURNING *
    `;

    const values = [id_libro, id_autor];

    const { rows } = await query(text, values);
    return rows[0];
}

export async function deleteLibroAutorModel(
    id_libro: number,
    id_autor: number
) {
    const text = `
        DELETE FROM libro_autor
        WHERE id_libro = $1 AND id_autor = $2
        RETURNING *
    `;

    const values = [id_libro, id_autor];

    const { rows } = await query(text, values);
    return rows[0];
}