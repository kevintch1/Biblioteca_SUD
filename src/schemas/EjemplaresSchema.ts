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

export type UpdateEjemplarInput = z.infer<typeof updateEjemplarSchema>;

export type CreateEjemplarInput = z.infer<typeof createEjemplarSchema>;