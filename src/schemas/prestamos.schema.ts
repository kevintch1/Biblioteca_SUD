import { z } from "zod";

// Validación del ID recibido por la URL
export const prestamoParamsSchema = z.object({
    id: z.string()
        .regex(/^[1-9]\d*$/, "El ID debe ser un entero positivo.")
        .transform(Number)
        .refine(
            (id) => Number.isSafeInteger(id),
            "El ID está fuera del rango permitido."
        ),
}).strict();

// Validación para registrar un préstamo
export const crearPrestamoSchema = z.object({
    id_usuario: z.number()
        .int("El ID del usuario debe ser un entero.")
        .positive("El ID del usuario debe ser positivo.")
        .safe(),

    id_ejemplar: z.number()
        .int("El ID del ejemplar debe ser un entero.")
        .positive("El ID del ejemplar debe ser positivo.")
        .safe(),

    fecha_limite: z.iso.date({
        error: "La fecha límite debe tener el formato YYYY-MM-DD."
    }),

    fecha_entrega: z.iso.date({
        error: "La fecha de entrega debe tener el formato YYYY-MM-DD."
    }).optional(),
}).strict();

// Validación para actualizar un préstamo
export const actualizarPrestamoSchema = z.object({
    fecha_limite: z.iso.date({
        error: "La fecha límite debe tener el formato YYYY-MM-DD."
    }).optional(),

    fecha_real_devolucion: z.iso.date({
        error: "La fecha de devolución debe tener el formato YYYY-MM-DD."
    }).optional(),
}).strict().refine(
    (datos) =>
        datos.fecha_limite !== undefined ||
        datos.fecha_real_devolucion !== undefined,
    {
        message: "Debes proporcionar al menos una fecha para actualizar."
    }
);
