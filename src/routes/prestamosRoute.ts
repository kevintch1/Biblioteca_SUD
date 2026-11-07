// src/routes/prestamosRoute.ts

import { Router } from 'express';
import { getPrestamos,   getPrestamoById, 
         createPrestamo, updatePrestamo,  deletePrestamo, } 
         from '../controllers/prestamosController.js';
import { validateCreatePrestamo, validateUpdatePrestamo } 
         from '../middlewares/validate-Prestamos.js';
import { validateQueryPrestamo } 
         from '../middlewares/validate-Prestamos.js';

const router = Router();

// Validar Query Params antes del controlador
router.get('/', validateQueryPrestamo, getPrestamos);

/**
 * @swagger
 * components:
 *   schemas:
 *     PrestamoResponse:
 *       type: object
 *       properties:
 *         id_prestamo:
 *           type: integer
 *           example: 1
 *         fecha_entrega:
 *           type: string
 *           format: date
 *           example: "2026-11-06"
 *         fecha_limite:
 *           type: string
 *           format: date
 *           example: "2026-11-15"
 *         fecha_real_devolucion:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: null
 *         usuario_nombre:
 *           type: string
 *           example: "Juan Pérez"
 *         usuario_correo:
 *           type: string
 *           example: "juan@correo.com"
 *         id_ejemplar:
 *           type: integer
 *           example: 3
 *         ejemplar_estado:
 *           type: string
 *           example: "Prestado"
 *         libro_titulo:
 *           type: string
 *           example: "Clean Code"
 *         autores_nombres:
 *           type: string
 *           example: "Robert C. Martin"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Datos de préstamo inválidos"
 *         detalles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               campo:
 *                 type: string
 *                 example: "fecha_limite"
 *               mensaje:
 *                 type: string
 *                 example: "Debe ser una fecha válida en formato DD/MM/YYYY"
 */

/**
 * @swagger
 * /api/prestamos:
 *   get:
 *     summary: Obtener todos los préstamos con filtros opcionales
 *     tags: [Préstamos]
 *     parameters:
 *       - in: query
 *         name: usuario_nombre
 *         schema:
 *           type: string
 *         description: Filtrar por coincidencia parcial del nombre del usuario
 *       - in: query
 *         name: libro_titulo
 *         schema:
 *           type: string
 *         description: Filtrar por coincidencia parcial del título del libro
 *     responses:
 *       200:
 *         description: Lista de préstamos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PrestamoResponse'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getPrestamos);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   get:
 *     summary: Obtener un préstamo por ID
 *     tags: [Préstamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del préstamo
 *     responses:
 *       200:
 *         description: Préstamo encontrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrestamoResponse'
 *       404:
 *         description: Préstamo no encontrado
 */
router.get('/:id', getPrestamoById);

/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Registrar un nuevo préstamo
 *     tags: [Préstamos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_ejemplar
 *               - fecha_limite
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               id_ejemplar:
 *                 type: integer
 *                 example: 3
 *               fecha_limite:
 *                 type: string
 *                 example: "15/11/2026"
 *               fecha_entrega:
 *                 type: string
 *                 example: "06/11/2026"
 *     responses:
 *       201:
 *         description: Préstamo creado y ejemplar marcado como 'Prestado'
 *       400:
 *         description: Error de validación o el ejemplar no está disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateCreatePrestamo, createPrestamo);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   put:
 *     summary: Actualizar fechas o registrar una devolución
 *     tags: [Préstamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_limite:
 *                 type: string
 *                 example: "30/11/2026"
 *               fecha_real_devolucion:
 *                 type: string
 *                 example: "08/11/2026"
 *     responses:
 *       200:
 *         description: Préstamo modificado correctamente
 *       404:
 *         description: Préstamo no encontrado
 */
router.put('/:id', validateUpdatePrestamo, updatePrestamo);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   delete:
 *     summary: Eliminar un préstamo del sistema
 *     tags: [Préstamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Préstamo eliminado y estado del ejemplar restaurado
 *       404:
 *         description: Préstamo no encontrado
 */
router.delete('/:id', deletePrestamo);

export default router;
// fin - archivo src/routes/prestamosRoute.ts 