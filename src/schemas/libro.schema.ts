import { z } from "zod";

// Validación del ID recibido por la URL
export const libroParamsSchema = z.object({
    id: z.string()
        .regex(/^[1-9]\d*$/, "El ID debe ser un entero positivo.")
        .transform(Number)
        .refine(
            (id) => Number.isSafeInteger(id),
            "El ID está fuera del rango permitido."
        ),
}).strict();

// Validación para crear un libro
export const crearLibroSchema = z.object({
    titulo: z.string()
        .trim()
        .min(1, "El título es obligatorio.")
        .max(255, "El título no puede superar los 255 caracteres."),

    editorial: z.string()
        .trim()
        .max(100, "La editorial no puede superar los 100 caracteres.")
        .nullable()
        .optional(),

    anio_publicacion: z.number()
        .int("El año debe ser un número entero.")
        .nullable()
        .optional(),

    id_categoria: z.number()
        .int("El ID de categoría debe ser un número entero.")
        .positive("El ID de categoría debe ser positivo.")
        .safe()
        .nullable()
        .optional(),
}).strict();

// Validación para actualizar un libro
export const actualizarLibroSchema = crearLibroSchema;