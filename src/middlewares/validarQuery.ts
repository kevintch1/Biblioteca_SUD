import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { z } from "zod";

export function validarQuery(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {

        const resultado = schema.safeParse(req.query);

        if (!resultado.success) {
            return res.status(400).json({
                error: "Parámetros de consulta inválidos",
                detalles: z.treeifyError(resultado.error)
            });
        }

        res.locals.query = resultado.data;

        next();
    };
}