import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createEjemplarSchema, updateEjemplarSchema } from "../schemas/EjemplaresSchema.js";
import { actualizaEjemplar, eliminarEjemplar, crearEjemplar, listarEjemplares, obtenerEjemplaresPorId} from "../controllers/ejemplares.controller.js";

const router = Router();

router.get("/", listarEjemplares);
router.get("/:id", obtenerEjemplaresPorId);
router.post("/", validateSchema(createEjemplarSchema), crearEjemplar);
router.put("/:id", validateSchema(updateEjemplarSchema),actualizaEjemplar);
router.delete("/:id", eliminarEjemplar);


export default router;