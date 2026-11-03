
import type { Request, Response } from "express";
import { pool } from "../config/db.js";

// 1. Consultar todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM usuarios ORDER BY id_usuario ASC"
        );

        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al consultar los usuarios" });
    }
};

// 2. Consultar un usuario por ID
export const obtenerUsuarioPorId = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));

        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID no válido" });
        }

        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE id_usuario = $1",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al consultar el usuario" });
    }
};

// 3. Crear un usuario
export const crearUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, tipo, correo } = req.body;

        if (!nombre || !tipo) {
            return res.status(400).json({
                mensaje: "El nombre y el tipo son obligatorios"
            });
        }

        const resultado = await pool.query(
            "INSERT INTO usuarios (nombre, tipo, correo) VALUES ($1, $2, $3) RETURNING *",
            [nombre, tipo, correo || null]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al crear el usuario" });
    }
};

// 4. Actualizar un usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const { nombre, tipo, correo } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID no válido" });
        }

        if (!nombre || !tipo) {
            return res.status(400).json({
                mensaje: "El nombre y el tipo son obligatorios"
            });
        }

        const resultado = await pool.query(
            "UPDATE usuarios SET nombre = $1, tipo = $2, correo = $3 WHERE id_usuario = $4 RETURNING *",
            [nombre, tipo, correo || null, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
};

// 5. Eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));

        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID no válido" });
        }

        const resultado = await pool.query(
            "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({
            mensaje: "Usuario eliminado correctamente",
            usuario: resultado.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el usuario" });
    }
};
