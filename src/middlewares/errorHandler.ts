// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Si es un error controlado manualmente por nosotros
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      detalles: err.detalles,
    });
    return;
  }

  // 2. Interceptación de errores nativos de PostgreSQL (pg)
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation (Duplicados)
        res.status(409).json({
          error: 'Conflicto de duplicidad',
          detalles: 'El registro ya existe en el sistema.',
        });
        return;

      case '23503': // Foreign key violation (Llaves foraneas)
        res.status(400).json({
          error: 'Error de relación o referencia',
          detalles: 'El ID de usuario o ejemplar proporcionado no existe en la base de datos.',
        });
        return;

      case '22007': // Invalid datetime format (Fechas invalidas)
        res.status(400).json({
          error: 'Formato de datos erróneo',
          detalles: 'La fecha enviada no cumple con la estructura requerida por el motor de base de datos.',
        });
        return;
    }
  }

  // 3. Fallo genérico de seguridad (Error 500 no controlado)
  console.error('> Error no controlado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalles: 'Ocurrio un problema inesperado. Por favor, intente más tarde.',
  });
};
// fin - archivo src/middlewares/errorHandler.ts 
