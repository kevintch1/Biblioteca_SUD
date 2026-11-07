
import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateParams(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.params);

        if (!resultado.success) {
            res.status(400).json({
                error:
                    resultado.error.issues[0]?.message ??
                    "Parámetros inválidos.",
            });
            return;
        }

        res.locals.paramsValidados = resultado.data;
        next();
    };
}
