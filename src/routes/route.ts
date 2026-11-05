import { Router } from "express";

import {
    getLibroAutor,
    createLibroAutor,
    deleteLibroAutor
} from "../controllers/controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import { createLibroAutorSchema, getLibroAutorQuerySchema } from "../schemas/libroaAutorSchema.js";

const router = Router();

router.get("/libro-autor", validateSchema(getLibroAutorQuerySchema, "query"), getLibroAutor);

router.post("/libro-autor", validateSchema(createLibroAutorSchema), createLibroAutor);

router.delete("/libro-autor/:id_libro/:id_autor", deleteLibroAutor);

export default router;