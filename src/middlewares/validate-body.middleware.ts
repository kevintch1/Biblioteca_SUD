import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {
            res.status(400).json({
                error:
                    resultado.error.issues[0]?.message ??
                    "Datos inválidos.",
            });
            return;
        }

        req.body = resultado.data;
        next();
    };
}