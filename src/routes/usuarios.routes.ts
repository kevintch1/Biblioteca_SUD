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
    obtenerUsuariosSchema 
} from "../schemas/usuariosSchemas.js";
import { 
    GetUserQuerySchema, 
    GetUserParamsSchema 
} from "../schemas/usuariosSchemas.js"

const router = Router();


router.get("/", validateSchema(GetUserQuerySchema, "query"), obtenerUsuarios);
router.get("/:id", validateSchema(GetUserParamsSchema, "params"), obtenerUsuarioPorId);
router.post("/", validateSchema(crearUsuarioSchema), crearUsuario);
router.put("/:id", validateSchema(actualizarUsuarioSchema), actualizarUsuario);
router.delete("/:id", validateSchema(EliminarUsuarioSchema), eliminarUsuario);

export default router;