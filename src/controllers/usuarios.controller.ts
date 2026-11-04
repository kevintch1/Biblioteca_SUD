
import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { usuariosModels } from "../models/usuariosModels.js";
import { EliminarUsuarioSchema } from "../schemas/usuariosSchemas.js";

// 1. Consultar todos los usuarios
export async function obtenerUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await usuariosModels.findAll();
    res.status(200). json(usuarios);
  } catch (error: any) {
    console.error(error)
    res.status(500).json; ({
        error: "error al obtener todos los usuarios",
      detalles: error.mesagge,
    });
  }
}

// 2. Consultar un usuario por ID
export async function obtenerUsuarioPorId(req: Request, res: Response)  {
const idBuscado = Number(req.params.id) 
    try {
        const usuarios = await usuariosModels.findById(idBuscado);
        res.status(200).json({
            ok: true,
            data: usuarios
        })
        
  } catch (error: any) {
    console.error(error)
    res.status(404).json; ({
        error: "usuario no encontrado",
      detalles: error.mesagge,
    });
  }
}

// 3. Crear un usuario
export  async function crearUsuario(req: Request, res: Response) {
        const { nombre, tipo, correo } = req.body;

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
export async function actualizarUsuario(req: Request, res: Response) {
    const { id } = req.params; 
    const { nombre, tipo, correo } = req.body;

    try {
        const actualizarUsuario = await usuariosModels.update(id, nombre, tipo, correo);
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
                message: "formato de id invalido",
                detalles: validacion.error.format() // Te da el desglose del error exacto
            });
        }
        const id = validacion.data.params.id;
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

    } catch (error: any) {
        console.error("Error al eliminar usuario", error);
        
        return res.status(500).json({ 
            ok: false,
            message: "Error al intentar eliminar usuario",
            detalles: error.message
        });
    }
};

