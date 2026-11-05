import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod analiza el body, query o params que configuraste en tu esquema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next(); // Si todo es correcto, pasa al controlador
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          ok: false,
          error: "Error de validación",
          detalles: error.errors.map(err => ({
            campo: err.path.join("."),
            mensaje: err.message
          }))
        });
      }
      return res.status(500).json({ ok: false, error: "Error interno en la validación" });
    }
  };