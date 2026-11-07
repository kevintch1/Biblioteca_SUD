import type { RequestHandler, Response, Request, NextFunction } from "express";
import type { ZodType } from "zod";
import { ZodError, z } from "zod";

type RequestSource = "body" | "query" | "params";

// Validar parámetros
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

        next();
    };
}

// Validar body, query y params
export function validateSchema(
    schema: z.ZodType,
    source: RequestSource = "body"
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const datos = await schema.parseAsync(req[source]);

            if (source === "body") {
                req.body = datos;
            } else if (source === "query") {
                res.locals.validatedQuery = datos;
            } else {
                res.locals.paramsValidados = datos;
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const flattened = z.flattenError(error);

                res.status(400).json({
                    status: "error",
                    message: "Error de validación en los datos enviados",
                    errors: flattened.fieldErrors
                });
                return;
            }

            next(error);
        }
    };
}