import { Router } from "express";
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/usuarios.controller.js";
import { validate } from "../middlewares/validateSchema.js"; 
import { 
    actualizarUsuarioSchema, 
    crearUsuarioSchema, 
    EliminarUsuarioSchema, 
    obtenerUsuarioPorIdSchema, 
    obtenerUsuariosSchema 
} from "../schemas/usuariosSchemas.js";

const router = Router();

// ✅ CORREGIDO: Ahora todos usan 'validate(...)'
router.get("/", validate(obtenerUsuariosSchema), obtenerUsuarios);
router.get("/:id", validate(obtenerUsuarioPorIdSchema), obtenerUsuarioPorId);
router.post("/", validate(crearUsuarioSchema), crearUsuario);
router.put("/:id", validate(actualizarUsuarioSchema), actualizarUsuario);
router.delete("/:id", validate(EliminarUsuarioSchema), eliminarUsuario);

export default router;