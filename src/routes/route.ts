// archivo src/routes/route.ts

import { Router } from "express";

import { getPrestamos, getPrestamoById, createPrestamo, updatePrestamo, deletePrestamo } from "../controllers/prestamosController.js";















const router = Router();

// Rutas para el recurso Usuarios
// router.get('/usuarios', getUsers);
// router.get('/usuarios/:id', getUserById);
// router.post('/usuarios', createUser);
// router.put('/usuarios/:id', updateUser);
// router.delete('/usuarios/:id', deleteUser);

// Rutas para el recurso Préstamos
router.get('/prestamos', getPrestamos);
router.get('/prestamos/:id', getPrestamoById);
router.post('/prestamos', createPrestamo);
router.put('/prestamos/:id', updatePrestamo);
router.delete('/prestamos/:id', deletePrestamo);

export default router;

// 

// fin - archivo src/routes/route.ts
