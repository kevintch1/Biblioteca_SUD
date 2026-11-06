import { z } from "zod";

export const queryLibrosSchema = z.object({
    page: z.string()
        .regex(/^\d+$/, "La página debe contener solo números")
        .transform((valor) => parseInt(valor, 10))
        .refine((valor) => valor > 0, "La página debe ser mayor que cero")
        .optional(),

    limit: z.string()
        .regex(/^\d+$/, "El límite debe contener solo números")
        .transform((valor) => parseInt(valor, 10))
        .refine((valor) => valor > 0, "El límite debe ser mayor que cero")
        .optional()
});