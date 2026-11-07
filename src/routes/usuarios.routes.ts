
import { Router } from "express";

import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/usuarios.controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import {
    actualizarUsuarioSchema,
    crearUsuarioSchema,
    EliminarUsuarioSchema,
    obtenerUsuarioPorIdSchema,
    GetUserQuerySchema
} from "../schemas/usuariosSchemas.js";

const router = Router();

// Obtener todos los usuarios
router.get(
    "/",
    validateSchema(GetUserQuerySchema, "query"),
    obtenerUsuarios
);

// Obtener un usuario por ID
router.get(
    "/:id",
    validateSchema(obtenerUsuarioPorIdSchema, "params"),
    obtenerUsuarioPorId
);

// Crear un usuario
router.post(
    "/",
    validateSchema(crearUsuarioSchema, "body"),
    crearUsuario
);

router.put(
    "/:id",
    validateSchema(obtenerUsuarioPorIdSchema, "params"),
    validateSchema(actualizarUsuarioSchema.omit({ id: true }), "body"),
    actualizarUsuario
);

// Eliminar un usuario
router.delete(
    "/:id",
    validateSchema(EliminarUsuarioSchema, "params"),
    eliminarUsuario
);

export default router;
