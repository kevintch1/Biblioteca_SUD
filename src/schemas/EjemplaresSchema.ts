import { z } from "zod";

export const createEjemplarSchema = z.object({
    id_libro: z.number()
    .positive("El ID debe ser un número positivo")
    .int("El ID debe ser un número entero"),
    
    estado: z.enum(["Disponible","Prestado"])
    .default("Disponible"),
});

export const updateEjemplarSchema = z.object({
    id_libro: z.number()
        .int("EL ID debe ser un número entero")
        .positive("El ID debe ser un número positivo"),
    
    estado: z.enum(["Disponible", "Prestado"]),
});

export const getEjemplaresQuerySchema = z.object({
    estado: z.enum(["Disponible", "Prestado"]).optional(),

    page: z.string()
        .regex(/^\d+$/, "El límite debe contener solo números")
        .transform(Number)
        .refine(
            (valor) => Number.isSafeInteger(valor) && valor > 0, 
            "La página debe ser un entero positivo"
        )
        .default(1),
    limit: z.string()
        .regex(/^\d+$/, "El límite debe contener solo números")
        .transform(Number)
        .refine(
            (valor) =>
                Number.isSafeInteger(valor) &&
                valor >= 1 &&
                valor <= 100,
            "El límite debe ser un entero entre 1 y 100"
        )
        .default(10)
});


export const ejemplarIdSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "El ID debe contener solamente números")
        .transform(Number)
        .refine(
            (id) => Number.isSafeInteger(id) && id > 0,
            "El ID debe ser un entero positivo"
        )
});



export type GetEjemplaresQueryInput = z.infer<typeof getEjemplaresQuerySchema>;

export type UpdateEjemplarInput = z.infer<typeof updateEjemplarSchema>;

export type CreateEjemplarInput = z.infer<typeof createEjemplarSchema>;