import { z } from "zod";
import { idParamsSchema } from "./common.schema.js";

export const categoriaBodySchema = z
    .object({
        nombre: z
            .string()
            .trim()
            .min(1, "El nombre de la categoría es obligatorio."),
    })
    .strict();

export const categoriaParamsSchema = idParamsSchema;
