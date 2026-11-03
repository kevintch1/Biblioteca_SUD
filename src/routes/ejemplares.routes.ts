import { Router } from "express";
import { actualizaEjemplar, eliminarEjemplar, crearEjemplar, listarEjemplares, obtenerEjemplaresPorId } from "../controllers/ejemplares.controller.js";

const router = Router();

router.get("/", listarEjemplares);
router.get("/:id", obtenerEjemplaresPorId);
router.post("/", crearEjemplar);
router.put("/:id", actualizaEjemplar);
router.delete("/:id", eliminarEjemplar);


export default router;