
import type { Request, Response } from "express";
import { EjemplarModel } from "../models/ejemplares.model.js";
import { crearEjemplarService } from "../services/ejemplares.service.js";
import type {
    GetEjemplaresQueryInput
} from "../schemas/EjemplaresSchema.js";

type ValidatedIdParams = {
    id: number;
};

export async function listarEjemplares(
    req: Request,
    res: Response
) {
    try {
        const filtros =
            res.locals.validatedQuery as GetEjemplaresQueryInput;

        const resultado = await EjemplarModel.listar(filtros);

        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Error al consultar ejemplares:", error);

        return res.status(500).json({
            mensaje: "Error al obtener los ejemplares"
        });
    }
}

export async function obtenerEjemplaresPorId(
    req: Request,
    res: Response
) {
    const { id } =
        res.locals.paramsValidados as ValidatedIdParams;

    try {
        const resultado = await EjemplarModel.obtenerPorId(id);

        const ejemplar = resultado.rows[0];

        if (!ejemplar) {
            return res.status(404).json({
                mensaje: "Ejemplar no encontrado"
            });
        }

        return res.status(200).json(ejemplar);
    } catch (error) {
        console.error("Error al consultar ejemplar:", error);

        return res.status(500).json({
            mensaje: "Error al obtener el ejemplar"
        });
    }
}

export async function crearEjemplar(
    req: Request,
    res: Response
) {
    try {
        const ejemplar = await crearEjemplarService(req.body);

        return res.status(201).json(ejemplar);
    } catch (error) {
        if (error instanceof Error && "tipo" in error) {
            switch (error.tipo) {
                case "REFERENCIA_INVALIDA":
                    return res.status(422).json({
                        mensaje: error.message
                    });

                case "CAMPO_REQUERIDO":
                case "VALOR_INVALIDO":
                    return res.status(400).json({
                        mensaje: error.message
                    });
            }
        }

        console.error("Error al crear ejemplar:", error);

        return res.status(500).json({
            mensaje: "Error al crear el ejemplar"
        });
    }
}

export async function actualizaEjemplar(
    req: Request,
    res: Response
) {
    const { id } =
        res.locals.paramsValidados as ValidatedIdParams;

    const { id_libro, estado } = req.body ?? {};

    if (
        typeof id_libro !== "number" ||
        !Number.isInteger(id_libro) ||
        id_libro <= 0
    ) {
        return res.status(400).json({
            mensaje: "id_libro debe ser un entero positivo"
        });
    }

    if (estado !== "Disponible" && estado !== "Prestado") {
        return res.status(400).json({
            mensaje: "El estado debe ser Disponible o Prestado"
        });
    }

    try {
        const resultado = await EjemplarModel.actualizar(
            id,
            id_libro,
            estado
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Ejemplar no encontrado"
            });
        }

        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error("Error al actualizar ejemplar:", error);

        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "23503"
        ) {
            return res.status(400).json({
                mensaje: "El libro indicado no existe"
            });
        }

        return res.status(500).json({
            mensaje: "Error al actualizar el ejemplar"
        });
    }
}

export async function eliminarEjemplar(
    req: Request,
    res: Response
) {
    const { id } =
        res.locals.paramsValidados as ValidatedIdParams;

    try {
        const resultado = await EjemplarModel.eliminar(id);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Ejemplar no encontrado"
            });
        }

        return res.status(200).json({
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
            return res.status(409).json({
                mensaje: "No se puede eliminar: el ejemplar tiene préstamos registrados"
            });
        }

        return res.status(500).json({
            mensaje: "Error al eliminar el ejemplar"
        });
    }
}
