import { query } from "../config/db.js";
import type { deleteLibroAutor } from "../controllers/controller.js";

export async function getLibroAutorModel() {
    const text = `
        SELECT * FROM libro_autor ORDER BY id_libro ASC`;
    const { rows } = await query(text);
    return rows;
}

export async function createLibroAutorModel(
    id_libro: number,
    id_autor: number) {
    const text = `
        INSERT INTO libro_autor (id_libro, id_autor)
        VALUES ($1, $2)
        RETURNING *
    `;


    const values = [id_libro, id_autor];

    const { rows } = await query(text, values);
    return rows[0];

};

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