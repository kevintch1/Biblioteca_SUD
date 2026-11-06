
import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { usuariosModels } from "../models/usuariosModels.js";
import { EliminarUsuarioSchema } from "../schemas/usuariosSchemas.js"; 
import { GetUserQuerySchema } from "../schemas/usuariosSchemas.js";

// 1. Consultar todos los usuarios

export async function obtenerUsuarios(
  req: Request, 
  res: Response
) {
  try {
   const result = GetUserQuerySchema.safeParse(req);

    if (!result.success) {
      return res.status(400).json({
        error: "Parámetros de consulta inválidos",
        detalles: result.error.format(),
      });
    } 
    const { nombre, correo, limit, page } = result.data.query;
    const users = await usuariosModels.findAll({ nombre, correo, limit, page });
    res.status(200).json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener todos los usuarios",
      detalles: error.message,
    });
  }

    
}

// 2. Consultar un usuario por ID

export async function obtenerUsuarioPorId(
  req: Request,
  res: Response
) {
  try {
    
    const idBuscado = Number(req.params.id);

    
    const usuario = await usuariosModels.findById(idBuscado);

    
    if (!usuario) {
      return res.status(404).json({ error: "usuario no encontrado" });
    }

    
    return res.status(200).json({
      ok: true,
      data: usuario
    });

  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor",
      detalles: error.message, 
    });
  }
}

// 3. Crear un usuario

export const crearUsuario = async (req: Request, res: Response) => {
    const { nombre, tipo, correo } = req.body;

    if (!nombre || !tipo) {
        return res.status(400).json({
            mensaje: "El nombre y el tipo son obligatorios"
        });
    }
    try {
        const crearUsuario = await usuariosModels.create(nombre, tipo, correo);
        res.status(201).json({
            ok: true,
            data: crearUsuario
        })


    } catch (error: any) {
        console.error(error);
        res.status(500).json
            ({ mensaje: "Error al crear el usuario" });

    }
};

// 4. Actualizar un usuario

export const actualizarUsuario = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nombre, tipo, correo } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            ok: false,
            message: "El ID debe ser un número entero positivo"
        });
    }

    if (!nombre || !tipo || !correo) {
        return res.status(400).json({
            ok: false,
            message: "Nombre, tipo y correo son requeridos"
        });
    }

    try {
        const actualizarUsuario = await usuariosModels.update(
            id,
            nombre,
            tipo,
            correo
        );

        if (!actualizarUsuario) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Usuario actualizado correctamente",
            data: actualizarUsuario
        });

    } catch (error: any) {
        console.error("Error al actualizar usuario:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al intentar actualizar usuario"
        });
    }
};
// 5. Eliminar un usuario

export async function eliminarUsuario(req: Request, res: Response) {
    try {
        
        const validacion = EliminarUsuarioSchema.safeParse({ params: req.params });

        if (!validacion.success) {
            return res.status(400).json({
                ok: false,
                message: "Formato de parámetros inválido",
                detalles: validacion.error.format()
            });
            
        }
        
        const id = validacion.data.params.id;
        const usuarioEliminado = await usuariosModels.delete(id);

        if (isNaN(Number(id))) { 
            return res.status(400).json({
                ok: false,
                message: "formato de id invalido"
            });
            const usuarioEliminado = await usuariosModels.delete(id); 
        }
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

    } catch (error: any) {
        console.error("Error al eliminar usuario", error);

        return res.status(500).json({
            ok: false,
            message: "Error al intentar eliminar usuario"
        });
    }
};

