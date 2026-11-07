import { Router } from "express";

import {
  getPrestamos,
  getPrestamoById,
  createPrestamo,
  updatePrestamo,
  deletePrestamo,
} from "../controllers/prestamosController.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import {
  prestamoParamsSchema,
  crearPrestamoSchema,
  actualizarPrestamoSchema,
} from "../schemas/prestamos.schema.js";

const router = Router();

// Obtener todos los préstamos
router.get("/", getPrestamos);

// Obtener un préstamo por ID
router.get(
  "/:id",
  validateSchema(prestamoParamsSchema, "params"),
  getPrestamoById
);

// Registrar un préstamo
router.post(
  "/",
  validateSchema(crearPrestamoSchema, "body"),
  createPrestamo
);

// Actualizar un préstamo o registrar su devolución
router.put(
  "/:id",
  validateSchema(prestamoParamsSchema, "params"),
  validateSchema(actualizarPrestamoSchema, "body"),
  updatePrestamo
);

// Eliminar un préstamo
router.delete(
  "/:id",
  validateSchema(prestamoParamsSchema, "params"),
  deletePrestamo
);

export default router;
