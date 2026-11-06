
import { z } from "zod";

// Obtener usuarios mediante query params
export const GetUserQuerySchema = z.object({
  nombre: z.string().optional(),
  correo: z.string().email().optional(),
  limit: z.string().optional(),
});

export type GetUserQueryInput = z.infer<typeof GetUserQuerySchema>;

// Obtener un usuario por ID
export const GetUserParamsSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, "El ID debe ser un número entero")
    .transform(Number),
});

export type GetUserParamsInput = z.infer<typeof GetUserParamsSchema>;

// Esquema para obtener todos los usuarios
export const obtenerUsuariosSchema = z.object({
  id: z.string().optional(),
  nombre: z.string()
    .min(2, "El nombre debe tener al menos dos caracteres")
    .max(150, "El nombre no debe superar los 150 caracteres"),
  correo: z.string().email("Formato de correo no válido"),
});

// Esquema para obtener un usuario por ID
export const obtenerUsuarioPorIdSchema = GetUserParamsSchema;

// Esquema para crear un usuario
export const crearUsuarioSchema = z.object({
  nombre: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),

  tipo: z.string()
    .min(2, "El tipo debe tener al menos 2 caracteres")
    .max(50, "El tipo no puede superar los 50 caracteres"),

  correo: z.string().email("Formato de correo no válido"),
});

// Esquema para actualizar un usuario
export const actualizarUsuarioSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, "El ID debe ser un número entero")
    .transform(Number),

  nombre: z.string()
    .trim()
    .min(2)
    .max(150)
    .optional(),

  tipo: z.string()
    .min(2)
    .max(50)
    .optional(),

  correo: z.string()
    .email()
    .optional(),
}).strict();

// Esquema para eliminar un usuario
export const EliminarUsuarioSchema = GetUserParamsSchema;
