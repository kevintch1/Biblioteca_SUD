import { z } from "zod";

export const createLibroAutorSchema = z.object({
    id_libro: z
        .number()
        .int("El ID del libro debe ser un número entero")
        .positive("El ID del libro debe ser positivo"),

    id_autor: z
        .number()
        .int("El ID del autor debe ser un número entero")
        .positive("El ID del autor debe ser positivo"),
});

export const getLibroAutorQuerySchema = z.object({
    id_libro: z
        .string()
        .regex(/^[1-9]\d*$/, "El id_libro debe ser un número positivo")
        .transform(Number)
        .optional(),

    id_autor: z
        .string()
        .regex(/^[1-9]\d*$/, "El id_autor debe ser un número positivo")
        .transform(Number)
        .optional(),
});

export type CreateLibroAutorInput = z.infer<typeof createLibroAutorSchema>;
export type GetLibroAutorQueryInput = z.infer<typeof getLibroAutorQuerySchema>;