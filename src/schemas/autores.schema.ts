import { z } from "zod";
import { idParamsSchema } from "./common.schema.js";

export const autorBodySchema = z
    .object({
        nombre: z
            .string()
            .trim()
            .min(1, "El nombre del autor es obligatorio."),
        nacionalidad: z.preprocess(
            (value) => typeof value === "string" && value.trim() === "" ? null : value,
            z.string().trim().nullable().optional(),
        ),
    })
    .strict();

export const autorParamsSchema = idParamsSchema;
