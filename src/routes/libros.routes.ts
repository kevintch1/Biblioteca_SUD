import { Router } from "express";

import {
    obtenerLibros,
    obtenerLibroPorId,
    crearLibro,
    actualizarLibro,
    eliminarLibro
} from "../controllers/libros.controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import {
    libroParamsSchema,
    crearLibroSchema,
    actualizarLibroSchema
} from "../schemas/libro.schema.js";

const router = Router();

router.get("/", obtenerLibros);

router.get(
    "/:id",
    validateSchema(libroParamsSchema, "params"),
    obtenerLibroPorId
);
router.post(
    "/",
    validateSchema(crearLibroSchema, "body"),
    crearLibro
);
router.put(
    "/:id",
    validateSchema(libroParamsSchema, "params"),
    validateSchema(actualizarLibroSchema, "body"),
    actualizarLibro
);
router.delete(
    "/:id",
    validateSchema(libroParamsSchema, "params"),
    eliminarLibro
);

export default router;