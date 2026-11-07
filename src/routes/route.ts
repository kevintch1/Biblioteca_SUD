
import { Router } from "express";

import {
    getLibroAutor,
    createLibroAutor,
    deleteLibroAutor
} from "../controllers/controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import {
    createLibroAutorSchema,
    getLibroAutorQuerySchema
} from "../schemas/libroaAutorSchema.js";

const router = Router();

// Obtener relaciones con filtros y paginación
router.get(
    "/libro-autor",
    validateSchema(getLibroAutorQuerySchema, "query"),
    getLibroAutor
);

// Crear relación entre libro y autor
router.post(
    "/libro-autor",
    validateSchema(createLibroAutorSchema),
    createLibroAutor
);

// Eliminar relación entre libro y autor
router.delete(
    "/libro-autor/:id_libro/:id_autor",
    getLibroAutor,
    deleteLibroAutor
);

export default router;
