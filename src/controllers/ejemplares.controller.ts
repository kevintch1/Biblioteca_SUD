import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { EjemplarModel } from "../models/ejemplares.model.js";
import {
    crearEjemplarService
} from "../services/ejemplares.service.js";
import { isModuleNamespaceObject } from "node:util/types";
import type {
    GetEjemplaresQueryInput
} from "../schemas/EjemplaresSchema.js";

export async function listarEjemplares(req: Request, res: Response) {
    try {
        const filtros: GetEjemplaresQueryInput =
            res.locals.queryValidada;

        const resultado = await EjemplarModel.listar(filtros);

        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Error al consultar ejemplares:", error);

        res.status(500).json({
            mensaje: "Error al obtener los ejemplares"
        });
    }
}

export async function obtenerEjemplaresPorId(req:Request, res: Response) {
    const id: number = res.locals.paramsValidados.id;
    try {
        const resultado = await EjemplarModel.obtenerPorId(id);

        const ejemplar = resultado.rows[0];

        if (!ejemplar) {
            res.status(404).json({
                mensaje: "Ejemplar no encontrado"
            });
            return;
        }

        res.status(200).json(ejemplar);
    } catch (error) {
        console.error("Error ala consultar ejemplar:", error);

        res.status(500).json({
            mensaje: "Error al obtener el ejemplar"
        });
    }
}

export async function crearEjemplar(req: Request, res: Response) {

    try { 
        const ejemplar = await crearEjemplarService(req.body);

        res.status(201).json(ejemplar);
    } catch (error) {
       if (error instanceof Error && "tipo" in error) {
        switch (error.tipo) {
            case "REFERENCIA_INVALIDA":
                res.status(422).json({
                    mensaje: error.message
                });
                return;
            case "CAMPO_REQUERIDO":
            case "VALOR_INVALIDO":
                res.status(400).json({
                    mensaje: error.message
                });
                return;
        }
       }

       console.error("Error al crear ejemplar", error);
       res.status(500).json({
        mensaje: "Error al crear el ejemplar"
       });
    }
}

export async function actualizaEjemplar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { id_libro, estado } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            mensaje: "El ID debe ser un entero positivo"
        });
        return;
    }

    if (
        typeof id_libro !== "number" ||
        !Number.isInteger(id_libro) ||
        id_libro<=0
    ) {
        res.status(400).json({
            mensaje: "id_libro debe ser un entero positivo"
        });
        return;
    }

    if (estado !== "Disponible" && estado !== "Prestado") {
        res.status(400).json({
            mensaje: "El estado debe ser Disponible o Prestado"
        });
        return;
    }

    try {
        const resultado = await EjemplarModel.actualizar(id, id_libro, estado);
        if (resultado.rows.length === 0) {
            res.status(404).json({
                mensaje: "Ejemplar no encontrado"
            });
            return;
        }

        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error("Error al actualizar ejemplar:", error);

        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "23503"
        ) {
            res.status(400).json({
                mensaje: "El libro indicado no existe"
            });
            return;
        }

        res.status(500).json({
            mensaje: "Error al actualizar el ejemplar"
        });
    }


}

export async function eliminarEjemplar(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            mensaje: "El ID debe ser un entero positivo"
        });
        return;
    }

    try {
        const resultado = await EjemplarModel.eliminar(id);

        if (resultado.rows.length === 0) {
            res.status(404).json({
                mensaje: "Ejemplar no encontrado"
            });
            return;
        }

        res.status(200).json({
            mensaje: "Ejemplar eliminado correctamente",
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error("Error al eliminar ejemplar:", error);

        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "23503"
        ) {
            res.status(409).json({
                mensaje: "No se puede eliminar: el ejemplar tiene préstamos registrados"
            });
            return;
        }

        res.status(500).json({
            mensaje: "Error al eliminar el ejemplar"
        });
    }
}