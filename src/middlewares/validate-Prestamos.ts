// src/middlewares/validate-Prestamos.ts

import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const fechaRegExp = /^\d{2}\/\d{2}\/\d{4}$/;
const mensajeFechaInvalida = "Debe ser una fecha válida en formato DD/MM/YYYY";

const esFechaValidaCalendario = (fechaStr: string): boolean => {
  if (!fechaRegExp.test(fechaStr)) return false;
  const [dia = 0, mes = 0, anio = 0] = fechaStr.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
};

const parseFechaLocal = (fechaStr: string): Date => {
  const [dia = 0, mes = 0, anio = 0] = fechaStr.split("/").map(Number);
  return new Date(anio, mes - 1, dia);
};

// Sintaxis compatible con Zod 4 para mapear mensajes requeridos 
// y de tipo
const zFechaSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "La fecha es obligatoria"
        : "La fecha debe ser una cadena de texto",
  })
  .regex(fechaRegExp, { message: mensajeFechaInvalida })
  .superRefine((val, ctx) => {
    if (!esFechaValidaCalendario(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha ingresada no existe en el calendario (ej. mes o día inválido)",
      });
    }
  });

// 1. Esquema de validación para CREAR un préstamo (POST)
export const createPrestamoSchema = z
  .object({
    id_usuario: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "El id_usuario es obligatorio"
            : "El id_usuario debe ser un número entero",
      })
      .int()
      .positive(),
    id_ejemplar: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "El id_ejemplar es obligatorio"
            : "El id_ejemplar debe ser un número entero",
      })
      .int()
      .positive(),
    fecha_limite: zFechaSchema,
    fecha_entrega: zFechaSchema.optional(),
  })
  .refine(
    (data) => {
      if (!data.fecha_limite || !fechaRegExp.test(data.fecha_limite) || !esFechaValidaCalendario(data.fecha_limite)) {
        return true;
      }
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const limite = parseFechaLocal(data.fecha_limite);
      return limite >= hoy;
    },
    {
      message: "La fecha límite debe ser hoy o una fecha posterior",
      path: ["fecha_limite"],
    }
  )
  .refine(
    (data) => {
      if (!data.fecha_entrega) return true;
      if (
        !fechaRegExp.test(data.fecha_limite) ||
        !esFechaValidaCalendario(data.fecha_limite) ||
        !fechaRegExp.test(data.fecha_entrega) ||
        !esFechaValidaCalendario(data.fecha_entrega)
      ) {
        return true;
      }
      const entrega = parseFechaLocal(data.fecha_entrega);
      const limite = parseFechaLocal(data.fecha_limite);
      return limite >= entrega;
    },
    {
      message: "La fecha límite no puede ser anterior a la fecha de entrega",
      path: ["fecha_limite"],
    }
  );

// 2. Esquema de validación para ACTUALIZAR un préstamo (PUT)
export const updatePrestamoSchema = z
  .object({
    fecha_limite: zFechaSchema.optional(),
    fecha_real_devolucion: zFechaSchema.optional(),
  })
  .refine(
    (data) => data.fecha_limite !== undefined || data.fecha_real_devolucion !== undefined,
    { message: "Debes proporcionar al menos un campo para actualizar (fecha_limite o fecha_real_devolucion)" }
  );

// Middlewares interceptores de Express
export const validateCreatePrestamo = (req: Request, res: Response, next: NextFunction): void => {
  const result = createPrestamoSchema.safeParse(req.body);
  if (!result.success) {
    const errores = result.error.issues.map((err: z.ZodIssue) => ({
      campo: err.path.join("."),
      mensaje: err.message
    }));
    res.status(400).json({ error: "Datos de préstamo inválidos", detalles: errores });
    return;
  }
  req.body = result.data;
  next();
};

export const validateUpdatePrestamo = (req: Request, res: Response, next: NextFunction): void => {
  const result = updatePrestamoSchema.safeParse(req.body);
  if (!result.success) {
    const errores = result.error.issues.map((err: z.ZodIssue) => ({
      campo: err.path.join("."),
      mensaje: err.message
    }));
    res.status(400).json({ error: "Datos de actualización inválidos", detalles: errores });
    return;
  }
  req.body = result.data;
  next();
};

// fin - src/middlewares/validate-Prestamos.ts