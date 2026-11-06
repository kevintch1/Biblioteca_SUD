import type { Request, Response } from "express";
import type { GetLibroAutorQueryInput } from "../schemas/libroaAutorSchema.js";
import {
    getLibroAutorModel,
    createLibroAutorModel,
    deleteLibroAutorModel
} from "../models/libroAutorModel.js";

export async function getLibroAutor(req: Request, res: Response) {
    const {
        id_libro,
        id_autor,
        page,
        limit
    } = res.locals.validatedQuery as GetLibroAutorQueryInput;

    try {
        const rows = await getLibroAutorModel({
            id_libro,
            id_autor,
            page,
            limit
        });

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

    } catch (error: any) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "Esta relación entre libro y autor ya existe",
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                error: "El libro o el autor indicado no existe",
            });
        }

        res.status(500).json({
            error: "Error al crear la relación libro-autor",
        });
    }
}

export async function deleteLibroAutor(req: Request, res: Response) {
    const id_libro = Number(req.params.id_libro);
    const id_autor = Number(req.params.id_autor);

    if (
        !Number.isInteger(id_libro) || id_libro <= 0 ||
        !Number.isInteger(id_autor) || id_autor <= 0
    ) {
        return res.status(400).json({
            error: "Los IDs deben ser números enteros positivos",
        });
    }

    try {
        const data = await deleteLibroAutorModel(id_libro, id_autor);

        if (!data) {
            return res.status(404).json({
                error: "Relación libro-autor no encontrada",
            });
        }

        return res.json({
            mensaje: "Relación libro-autor eliminada con éxito",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Error al eliminar la relación libro-autor",
        });
    }
}