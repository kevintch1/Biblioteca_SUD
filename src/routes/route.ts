
import { Router } from "express";

import {
    getLibroAutor,
    createLibroAutor,
    deleteLibroAutor
} from "../controllers/controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import {
    createLibroAutorSchema,
    getLibroAutorQuerySchema,
    deleteLibroAutorSchema
} from "../schemas/libroaAutorSchema.js";

const router = Router();

//mostra datos
router.get(
    "/libro-autor",
    validateSchema(getLibroAutorQuerySchema, "query"),
    getLibroAutor
);

//crea
router.post(
    "/libro-autor",
    validateSchema(createLibroAutorSchema),
    createLibroAutor
);
//elimina
router.delete(
    "/libro-autor/:id_libro/:id_autor",
    validateSchema(deleteLibroAutorSchema, "params"),
    deleteLibroAutor
);
export default router;
