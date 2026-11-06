// src/controllers/prestamosController.ts

// import { pool } from '../config/db.js';

// Guía Probar los Endpoints
// http://localhost:3000/api/prestamos     1- todos los prestamos (GET):
// http://localhost:3000/api/prestamos/2   2- Obtener prestamo especifico (GET):
// http://localhost:3000/api/prestamos     3- Crear un nuevo prestamo (POST):
//   Body (JSON):
//   { "id_usuario": 1, "id_ejemplar": 3, "fecha_limite": "2026-11-15"}
// http://localhost:3000/api/prestamos/2   4- Registra una devolucion / Actualizar (PUT):
// 	 Body (JSON): 
//   {"fecha_real_devolucion": "2026-11-02"}
// http://localhost:3000/api/prestamos/1   5- Eliminar un prestamo (DELETE):

/** aqui ejec **/
import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { z } from 'zod';
import { prestamosModel } from '../models/prestamos.model.js';
import { createPrestamoSchema, updatePrestamoSchema } from '../middlewares/validate-Prestamos.js';
import { AppError } from '../utils/AppError.js';

type CreatePrestamoInput = z.infer<typeof createPrestamoSchema>;
type UpdatePrestamoInput = z.infer<typeof updatePrestamoSchema>;

/**
 * 1. Obtener todos los préstamos

export const getPrestamos = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const prestamos = await prestamosModel.getAllPrestamos();
  res.status(200).json(prestamos);
});
 */


/**
 * 1. Obtener todos los préstamos (Soporta Query Params de filtrado)
 * Ejemplo: /api/prestamos?usuario_nombre=carlos&libro_titulo=clean
 */
export const getPrestamos = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { 
    id_usuario, 
    id_ejemplar, 
    fecha_entrega, 
    fecha_limite, 
    fecha_real_devolucion, 
    usuario_nombre, 
    libro_titulo, 
    autor_nombre 
  } = req.query;

  const prestamos = await prestamosModel.getAllPrestamos({
    id_usuario: id_usuario as string,
    id_ejemplar: id_ejemplar as string,
    fecha_entrega: fecha_entrega as string,
    fecha_limite: fecha_limite as string,
    fecha_real_devolucion: fecha_real_devolucion as string,
    usuario_nombre: usuario_nombre as string,
    libro_titulo: libro_titulo as string,
    autor_nombre: autor_nombre as string
  });

  res.status(200).json(prestamos);
});



/**
 * 2. Obtener un préstamo por ID
 */
export const getPrestamoById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new AppError('El ID proporcionado es obligatorio.', 400);
  }

  const prestamo = await prestamosModel.getPrestamoById(id);
  if (!prestamo) throw new AppError('Préstamo no encontrado', 404);

  res.status(200).json(prestamo);
});

/**
 * 3. Crear un nuevo préstamo
 */
export const createPrestamo = catchAsync(async (
  req: Request<{}, {}, CreatePrestamoInput>, 
  res: Response 
): Promise<void> => {
  const { id_usuario, id_ejemplar, fecha_limite, fecha_entrega } = req.body;

  const estadoEjemplar = await prestamosModel.checkEjemplarStatus(id_ejemplar);
  if (estadoEjemplar === null) throw new AppError('El ejemplar especificado no existe', 404);
  if (estadoEjemplar !== 'Disponible') throw new AppError('El ejemplar no está disponible en este momento', 400);

  const nuevoPrestamo = await prestamosModel.createPrestamo(id_usuario, id_ejemplar, fecha_limite, fecha_entrega);
  
  res.status(201).json({
    mensaje: 'Préstamo creado con éxito',
    datos: nuevoPrestamo
  });
});

/**
 * 4. Actualizar un préstamo o registrar devolución
 */
export const updatePrestamo = catchAsync(async (
  req: Request<{ id: string }, {}, UpdatePrestamoInput>, 
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { fecha_limite, fecha_real_devolucion } = req.body;

  if (!id) throw new AppError('El ID proporcionado no es válido.', 400);
  
  const prestamoActualizado = await prestamosModel.updatePrestamo(
    id,
    fecha_limite ?? null,
    fecha_real_devolucion ?? null
  );
  if (!prestamoActualizado) throw new AppError('Préstamo no encontrado', 404);

  res.status(200).json({
    mensaje: `Préstamo ${id} actualizado correctamente`,
    datos: prestamoActualizado
  });
});

/**
 * 5. Eliminar un préstamo
 */
export const deletePrestamo = catchAsync(async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) throw new AppError('El ID proporcionado no es válido.', 400);

  const eliminado = await prestamosModel.deletePrestamo(id);
  if (!eliminado) throw new AppError('Préstamo no encontrado para eliminar', 404);

  res.status(200).json({ mensaje: `Préstamo ${id} eliminado con éxito` });
});
// fin - archivo src/controllers/prestamosController.ts
