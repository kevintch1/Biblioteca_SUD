import type { Request, Response } from "express";
import { pool } from "../config/db.js";

type ValidatedIdParams = {
    id: number;
};

// 1. Consultar todos los libros
export const obtenerLibros = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM libros ORDER BY id_libro ASC"
        );

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Error al consultar los libros:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los libros"
        });
    }
};

// 2. Consultar un libro por ID
export const obtenerLibroPorId = async (req: Request, res: Response) => {
    const { id } = res.locals.paramsValidados as ValidatedIdParams;

    try {
        const resultado = await pool.query(
            "SELECT * FROM libros WHERE id_libro = $1",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            });
        }

        return res.status(200).json(resultado.rows[0]);

    } catch (error) {
        console.error("Error al consultar el libro:", error);

        return res.status(500).json({
            mensaje: "Error al consultar el libro"
        });
    }
};

// 3. Crear un libro
export const crearLibro = async (req: Request, res: Response) => {
    const { titulo, editorial, anio_publicacion, id_categoria } = req.body;

    try {
        const resultado = await pool.query(
            `INSERT INTO libros
            (titulo, editorial, anio_publicacion, id_categoria)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                titulo,
                editorial ?? null,
                anio_publicacion ?? null,
                id_categoria ?? null
            ]
        );

        return res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Error al crear el libro:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23503"
        ) {
            return res.status(400).json({
                mensaje: "La categoría indicada no existe"
            });
        }

        return res.status(500).json({
            mensaje: "Error al crear el libro"
        });
    }
};

// 4. Actualizar un libro
export const actualizarLibro = async (req: Request, res: Response) => {
    const { id } = res.locals.paramsValidados as ValidatedIdParams;
    const { titulo, editorial, anio_publicacion, id_categoria } = req.body;

    try {
        const resultado = await pool.query(
            `UPDATE libros
            SET titulo = $1,
                editorial = $2,
                anio_publicacion = $3,
                id_categoria = $4
            WHERE id_libro = $5
            RETURNING *`,
            [
                titulo,
                editorial ?? null,
                anio_publicacion ?? null,
                id_categoria ?? null,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            });
        }

        return res.status(200).json(resultado.rows[0]);

    } catch (error) {
        console.error("Error al actualizar el libro:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23503"
        ) {
            return res.status(400).json({
                mensaje: "La categoría indicada no existe"
            });
        }

        return res.status(500).json({
            mensaje: "Error al actualizar el libro"
        });
    }
};

// 5. Eliminar un libro
export const eliminarLibro = async (req: Request, res: Response) => {
    const { id } = res.locals.paramsValidados as ValidatedIdParams;

    try {
        const resultado = await pool.query(
            "DELETE FROM libros WHERE id_libro = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Libro eliminado correctamente",
            libro: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al eliminar el libro:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar el libro"
        });
    }
};
