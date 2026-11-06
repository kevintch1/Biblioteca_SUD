import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { ZodType } from "zod";

export function validarParams(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {

        const resultado = schema.safeParse(req.params);

        if (!resultado.success) {
            return res.status(400).json({
                error: "Parámetros de ruta inválidos",
                detalles: z.treeifyError(resultado.error)
            });
        }

        req.params = resultado.data as any;

        next();
    };
}