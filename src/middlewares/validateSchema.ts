import type { Response, Request, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { z } from "zod";

type RequestSource = "body" | "query" | "params";

export function validateSchema(
    schema: ZodObject,
    source: RequestSource = "body"
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const datos = await schema.parseAsync(req[source]);

            if (source === "body") {
                req.body = datos;
            } else if (source === "query") {
                res.locals.queryValidada = datos;
            } else {
                res.locals.paramsValidados = datos;
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const flattened = z.flattenError(error);

                res.status(400).json({
                    status: "error", 
                    message: "Error de vaidación en los datos enviados",
                    errors: flattened.fieldErrors
                });
                return;
            }

            next(error);
        }
    }
}
