
import { z } from "zod";

export const createEjemplarSchema = z.object({
    id_libro: z.number()
        .int("El ID debe ser un número entero")
        .positive("El ID debe ser un número positivo")
        .safe("El ID debe ser un entero seguro"),

    estado: z.enum(["Disponible", "Prestado"])
        .default("Disponible"),
}).strict();

export const updateEjemplarSchema = z.object({
    id_libro: z.number()
        .int("El ID debe ser un número entero")
        .positive("El ID debe ser un número positivo")
        .safe("El ID debe ser un entero seguro"),

    estado: z.enum(["Disponible", "Prestado"]),
}).strict();

export const getEjemplaresQuerySchema = z.object({
    estado: z.enum(["Disponible", "Prestado"]).optional(),

    limit: z.string()
        .regex(/^\d+$/, "El límite debe contener solamente números")
        .transform(Number)
        .refine(
            (valor) => Number.isSafeInteger(valor) && valor > 0,
            "El límite debe ser un entero positivo"
        )
        .optional()
}).strict();

export const ejemplarIdSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "El ID debe contener solamente números")
        .transform(Number)
        .refine(
            (id) => Number.isSafeInteger(id) && id > 0,
            "El ID debe ser un entero positivo"
        )
}).strict();

export type GetEjemplaresQueryInput =
    z.infer<typeof getEjemplaresQuerySchema>;

export type UpdateEjemplarInput =
    z.infer<typeof updateEjemplarSchema>;

export type CreateEjemplarInput =
    z.infer<typeof createEjemplarSchema>;
