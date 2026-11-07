// archivo src/controllers/controller.ts

import type { Response, Request } from "express";
import { query } from "../config/db.js";

export async function getLibroAutor(req: Request, res: Response) {
    try {
        const { rows } = await query(
            "SELECT * FROM libro_autor ORDER BY id_libro ASC"
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las relaciones entre libros y autores",
        });
    }
}

export async function createLibroAutor(req: Request, res: Response) {
    const { id_libro, id_autor } = req.body;

    try {
        const text = `
            INSERT INTO libro_autor (id_libro, id_autor)
            VALUES ($1, $2)
            RETURNING *
        `;

        const values = [id_libro, id_autor];

        const { rows } = await query(text, values);

        res.status(201).json({
            mensaje: "Relación libro-autor creada con éxito",
            data: rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la relación libro-autor",
        });
    }
}

export async function deleteLibroAutor(req: Request, res: Response) {
    const { id_libro, id_autor } = req.params;

    try {
        const text = `
            DELETE FROM libro_autor
            WHERE id_libro = $1 AND id_autor = $2
            RETURNING *
        `;

        const values = [id_libro, id_autor];

        const { rows } = await query(text, values);

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Relación libro-autor no encontrada",
            });
        }

        res.json({
            mensaje: "Relación libro-autor eliminada con éxito",
            data: rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar la relación libro-autor",
        });
    }
}

// fin - archivo src/controllers/controller.ts
