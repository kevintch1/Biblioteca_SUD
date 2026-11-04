import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateSchema(schema: z.ZodType) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const flattened = z.flattenError(error);

                return res.status(400).json({
                    status: "error",
                    message: "Error de validación en los datos enviados",
                    errors: flattened.fieldErrors,
                });
            }

            next(error);
        }
    };
}