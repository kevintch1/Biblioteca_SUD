
import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";

import {
    createEjemplarSchema,
    getEjemplaresQuerySchema,
    updateEjemplarSchema,
    ejemplarIdSchema
} from "../schemas/EjemplaresSchema.js";


router.get("/",listarEjemplares);
router.get("/:id", validateSchema(ejemplarIdSchema, "params"), obtenerEjemplaresPorId);
router.post("/", validateSchema(createEjemplarSchema), crearEjemplar);
router.put("/:id", validateSchema(updateEjemplarSchema),actualizaEjemplar);
router.delete("/:id", eliminarEjemplar);

import {
    actualizaEjemplar,
    eliminarEjemplar,
    crearEjemplar,
    listarEjemplares,
    obtenerEjemplaresPorId
} from "../controllers/ejemplares.controller.js";

const router = Router();

router.get(
    "/",
    validateSchema(getEjemplaresQuerySchema, "query"),
    listarEjemplares
);
router.get(
    "/:id",
    validateSchema(ejemplarIdSchema, "params"),
    obtenerEjemplaresPorId
);
router.post(
    "/",
    validateSchema(createEjemplarSchema, "body"),
    crearEjemplar
);
router.put(
    "/:id",
    validateSchema(ejemplarIdSchema, "params"),
    validateSchema(updateEjemplarSchema, "body"),
    actualizaEjemplar
);
router.delete(
    "/:id",
    validateSchema(ejemplarIdSchema, "params"),
    eliminarEjemplar
);

export default router;
