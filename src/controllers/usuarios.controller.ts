
import type { Request, Response } from "express";
import { usuariosModels } from "../models/usuariosModels.js";

// 1. Consultar todos los usuarios
export async function obtenerUsuarios(req: Request, res: Response) {
    try {
        const usuarios = await usuariosModels.findAll();

        return res.status(200).json({
            ok: true,
            data: usuarios
        });

    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
}

// 2. Consultar un usuario por ID
export async function obtenerUsuarioPorId(req: Request, res: Response) {
    try {
        const { id } = res.locals.paramsValidados;

        const usuario = await usuariosModels.findById(id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            data: usuario
        });

    } catch (error) {
        console.error("Error al obtener usuario:", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
}

export async function crearUsuario(req: Request, res: Response) {
    const { nombre, tipo, correo } = req.body;

    try {
        const usuarioCreado = await usuariosModels.create(
            nombre,
            tipo,
            correo
        );

        return res.status(201).json({
            ok: true,
            data: usuarioCreado
        });

    } catch (error) {
        const dbError = error as { code?: string };

        console.error("Error al crear usuario:", error);

        if (dbError.code === "23505") {
            return res.status(409).json({
                ok: false,
                message: "El correo electrónico ya está registrado"
            });
        }

        return res.status(500).json({
            ok: false,
            message: "Error al crear el usuario"
        });
    }
}

export async function actualizarUsuario(req: Request, res: Response) {
    const { id } = res.locals.paramsValidados as { id: number };
    const { nombre, tipo, correo } = req.body;

    try {
        const usuarioActualizado = await usuariosModels.update(
            id,
            nombre,
            tipo,
            correo
        );

        if (!usuarioActualizado) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Usuario actualizado correctamente",
            data: usuarioActualizado
        });

    } catch (error) {
        const dbError = error as { code?: string };

        console.error("Error al actualizar usuario:", error);

        if (dbError.code === "23505") {
            return res.status(409).json({
                ok: false,
                message: "El correo electrónico ya está registrado"
            });
        }

        return res.status(500).json({
            ok: false,
            message: "Error al intentar actualizar usuario"
        });
    }
}
export async function eliminarUsuario(req: Request, res: Response) {
    try {
        const { id } = res.locals.paramsValidados as { id: number };

        const usuarioEliminado = await usuariosModels.delete(id);

        if (!usuarioEliminado) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Usuario eliminado exitosamente",
            data: usuarioEliminado
        });

    } catch (error) {
        const dbError = error as { code?: string };

        console.error("Error al eliminar usuario:", error);

        if (dbError.code === "23503") {
            return res.status(409).json({
                ok: false,
                message: "No se puede eliminar el usuario porque tiene préstamos asociados"
            });
        }

        return res.status(500).json({
            ok: false,
            message: "Error al intentar eliminar usuario"
        });
    }
}