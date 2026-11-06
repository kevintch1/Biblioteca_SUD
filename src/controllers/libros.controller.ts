
import type { Request, Response } from "express";
import { LibroModel } from "../models/libro.model.js";

// 1. Consultar todos los libros
export const obtenerLibros = async (req: Request, res: Response) => {
    try {
        const page = res.locals.query.page || 1;
        const limit = res.locals.query.limit || 10;

        const libros = await LibroModel.findAll(page, limit);

        res.json(libros);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al consultar los libros" });
    }
};

// 2. Consultar un libro por ID
export const obtenerLibroPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;

        const libro = await LibroModel.findById(id);

        if (!libro) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json(libro);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al consultar el libro" });
    }
};

// 3. Crear un libro
export const crearLibro = async (req: Request, res: Response) => {
    try {
        const { titulo, editorial, anio_publicacion, id_categoria } = req.body;

        if (!titulo) {
            return res.status(400).json({
                mensaje: "El título es obligatorio"
            });
        }

        const libro = await LibroModel.create(
            titulo,
            editorial || null,
            anio_publicacion || null,
            id_categoria || null
        );

        res.status(201).json(libro);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al crear el libro" });
    }
};

// 4. Actualizar un libro
export const actualizarLibro = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const { titulo, editorial, anio_publicacion, id_categoria } = req.body;

        if (!titulo) {
            return res.status(400).json({
                mensaje: "El título es obligatorio"
            });
        }

        const libro = await LibroModel.update(
            id,
            titulo,
            editorial || null,
            anio_publicacion || null,
            id_categoria || null
        );

        if (!libro) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json(libro);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el libro" });
    }
};

// 5. Eliminar un libro
export const eliminarLibro = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;

        const libro = await LibroModel.delete(id);

        if (!libro) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json({
            mensaje: "Libro eliminado correctamente",
            libro: libro
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el libro" });
    }
};
