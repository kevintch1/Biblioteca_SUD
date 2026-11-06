
import { Router } from "express";

import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/usuarios.controller.js";
<<<<<<< HEAD
import { validateSchema } from "../middlewares/validateSchema.js"; 
import { 
    actualizarUsuarioSchema, 
    crearUsuarioSchema, 
    EliminarUsuarioSchema, 
    obtenerUsuarioPorIdSchema, 
    obtenerUsuariosSchema 
=======

import { validateSchema } from "../middlewares/validateSchema.js";

import {
    actualizarUsuarioSchema,
    crearUsuarioSchema,
    EliminarUsuarioSchema,
    obtenerUsuarioPorIdSchema,
    obtenerUsuariosSchema
>>>>>>> b87c4a77840b55b22f068a8b86377a3c3fe8c0ee
} from "../schemas/usuariosSchemas.js";
import { 
    GetUserQuerySchema, 
    GetUserParamsSchema 
} from "../schemas/usuariosSchemas.js"

const router = Router();

<<<<<<< HEAD

router.get("/", validateSchema(GetUserQuerySchema, "query"), obtenerUsuarios);
router.get("/:id", validateSchema(GetUserParamsSchema, "params"), obtenerUsuarioPorId);
router.post("/", validateSchema(crearUsuarioSchema), crearUsuario);
router.put("/:id", validateSchema(actualizarUsuarioSchema), actualizarUsuario);
router.delete("/:id", validateSchema(EliminarUsuarioSchema), eliminarUsuario);
=======
// Obtener todos los usuarios
router.get(
    "/",
    validateSchema(obtenerUsuariosSchema, "query"),
    obtenerUsuarios
);
>>>>>>> b87c4a77840b55b22f068a8b86377a3c3fe8c0ee

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

// Actualizar un usuario
router.put(
    "/:id",
    validateSchema(actualizarUsuarioSchema, "body"),
    actualizarUsuario
);

// Eliminar un usuario
router.delete(
    "/:id",
    validateSchema(EliminarUsuarioSchema, "params"),
    eliminarUsuario
);

export default router;
