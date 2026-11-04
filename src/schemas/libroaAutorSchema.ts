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

export type CreateLibroAutorInput = z.infer<
    typeof createLibroAutorSchema
>;