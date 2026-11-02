
import type { Request, Response } from "express";
import { pool } from "../config/db.js";

// 1. Consultar todos los libros
export const obtenerLibros = async (req: Request, res: Response) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM libros ORDER BY id_libro ASC"
        );

        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al consultar los libros" });
    }
};

// 2. Consultar un libro por ID
export const obtenerLibroPorId = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));

        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID no válido" });
        }

        const resultado = await pool.query(
            "SELECT * FROM libros WHERE id_libro = $1",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json(resultado.rows[0]);

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

        const resultado = await pool.query(
            `INSERT INTO libros (titulo, editorial, anio_publicacion, id_categoria)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                titulo,
                editorial || null,
                anio_publicacion || null,
                id_categoria || null
            ]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al crear el libro" });
    }
};

// 4. Actualizar un libro
export const actualizarLibro = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const { titulo, editorial, anio_publicacion, id_categoria } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID no válido" });
        }

        if (!titulo) {
            return res.status(400).json({
                mensaje: "El título es obligatorio"
            });
        }

        const resultado = await pool.query(
            `UPDATE libros
            SET titulo = $1, editorial = $2, anio_publicacion = $3, id_categoria = $4
            WHERE id_libro = $5
            RETURNING *`,
            [
                titulo,
                editorial || null,
                anio_publicacion || null,
                id_categoria || null,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el libro" });
    }
};

// 5. Eliminar un libro
export const eliminarLibro = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));

        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID no válido" });
        }

        const resultado = await pool.query(
            "DELETE FROM libros WHERE id_libro = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }

        res.json({
            mensaje: "Libro eliminado correctamente",
            libro: resultado.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el libro" });
    }
};
