import { Router, type Router as RouterType } from "express";

import {
    obtenerLibros,
    obtenerLibroPorId,
    crearLibro,
    actualizarLibro,
    eliminarLibro
} from "../controllers/libros.controller.js";

import { validarParams } from "../middlewares/validarParams.js";
import { paramsIdSchema } from "../schemas/params.schema.js";
import { validarQuery } from "../middlewares/validarQuery.js";
import { queryLibrosSchema } from "../schemas/query.schema.js";

const router: RouterType = Router();

router.get("/", validarQuery(queryLibrosSchema), obtenerLibros);
router.get("/:id", validarParams(paramsIdSchema), obtenerLibroPorId);
router.post("/", crearLibro);
router.put("/:id", validarParams(paramsIdSchema), actualizarLibro);
router.delete("/:id", validarParams(paramsIdSchema), eliminarLibro);

export default router;
