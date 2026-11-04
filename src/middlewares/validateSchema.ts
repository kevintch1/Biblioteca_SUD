import type { Response, Request, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { z } from "zod";
export function validateSchema(schema: ZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const flattened = z.flattenError(error);
                res.status(400).json({
                    status: "error", 
                    message: "Error de validación en los datos enviados",
                    errors: flattened.fieldErrors, 
                });
                return;
            }
            next(error);
        }
    };
}