import { z } from "zod";

export const paramsIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "El ID debe contener solo números")
        .transform((valor) => parseInt(valor, 10))
        .refine((valor) => valor > 0, "El ID debe ser mayor que cero"),
});

