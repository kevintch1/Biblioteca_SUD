import type { Request, Response } from "express";

import {
    getLibroAutorModel,
    createLibroAutorModel,
    deleteLibroAutorModel
} from "../models/libroAutorModel.js";

export async function getLibroAutor(req: Request, res: Response) {
    try {
        const rows = await getLibroAutorModel();

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
        const data = await createLibroAutorModel(id_libro, id_autor);

        res.status(201).json({
            mensaje: "Relación libro-autor creada con éxito",
            data,
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
        const data = await deleteLibroAutorModel(
            Number(id_libro),
            Number(id_autor)
        );

        if (!data) {
            return res.status(404).json({
                error: "Relación libro-autor no encontrada",
            });
        }

        res.json({
            mensaje: "Relación libro-autor eliminada con éxito",
            data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar la relación libro-autor",
        });
    }
}

