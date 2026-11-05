import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateSchema(
    schema: z.ZodType,
    source: "body" | "query" = "body"
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = source === "query" ? req.query : req.body;

            const validatedData = await schema.parseAsync(data);

            if (source === "body") {
                req.body = validatedData;
            } else {
                res.locals.validatedQuery = validatedData;
            }

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