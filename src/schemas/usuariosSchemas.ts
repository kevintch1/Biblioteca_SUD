import { z } from "zod";
import { idParamsSchema } from "./common.schema.js";

// Obtener usuarios mediante query params
export const GetUserQuerySchema = z.object({
  nombre: z.string()
    .trim()
    .min(1, "El nombre no puede estar vacío.")
    .optional(),

  correo: z.string()
    .trim()
    .email("Formato de correo no válido.")
    .optional(),

  limit: z.string()
    .regex(/^[1-9]\d*$/, "El límite debe ser un entero positivo.")
    .transform(Number)
    .refine(
      (limit) => Number.isSafeInteger(limit),
      "El límite está fuera del rango permitido."
    )
    .optional(),
}).strict();

export type GetUserQueryInput = z.infer<typeof GetUserQuerySchema>;

// Obtener un usuario por ID
export const GetUserParamsSchema = idParamsSchema;

export type GetUserParamsInput = z.infer<typeof GetUserParamsSchema>;

// Esquema para obtener todos los usuarios
export const obtenerUsuariosSchema = z.object({
  id: z.string().optional(),

  nombre: z.string()
    .trim()
    .min(2)
    .max(150),

  correo: z.string()
    .trim()
    .email(),
}).strict();

// Esquema para obtener un usuario por ID
export const obtenerUsuarioPorIdSchema = GetUserParamsSchema;

// Esquema para crear un usuario
export const crearUsuarioSchema = z.object({
  nombre: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(150, "El nombre no puede superar los 150 caracteres."),

  tipo: z.string()
    .trim()
    .min(2, "El tipo debe tener al menos 2 caracteres.")
    .max(50, "El tipo no puede superar los 50 caracteres."),

  correo: z.string()
    .trim()
    .email("Formato de correo no válido.")
    .max(100, "El correo no puede superar los 100 caracteres."),
}).strict();

// Esquema para actualizar un usuario
export const actualizarUsuarioSchema = z.object({
  id: idParamsSchema.shape.id,

  nombre: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(150, "El nombre no puede superar los 150 caracteres."),

  tipo: z.string()
    .trim()
    .min(2, "El tipo debe tener al menos 2 caracteres.")
    .max(50, "El tipo no puede superar los 50 caracteres."),

  correo: z.string()
    .trim()
    .email("Formato de correo no válido.")
    .max(100, "El correo no puede superar los 100 caracteres."),
}).strict();

// Esquema para eliminar un usuario
export const EliminarUsuarioSchema = GetUserParamsSchema;
