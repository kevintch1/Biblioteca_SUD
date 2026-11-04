import { z } from "zod";

const positiveIdSchema = z
    .string()
    .regex(/^\d+$/, "El id debe ser un entero positivo.")
    .transform(Number)
    .refine(
        (id) => Number.isSafeInteger(id) && id > 0,
        "El id debe ser un entero positivo.",
    );

export const idParamsSchema = z.object({
    id: positiveIdSchema,
});
