import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { EjemplarModel } from "../models/ejemplares.model.js";
import {
    crearEjemplarService
} from "../services/ejemplares.service.js";
import {
    getEjemplaresQuerySchema
} from "../schemas/EjemplaresSchema.js";

export async function listarEjemplares(req: Request, res: Response) {
    // #swagger.tags= ['Ejemplares']
    // #swagger.summary = 'Listar ejemplares'
    // #swagger.description = 'Obtiene ejemplares con paginación y filtro opcional por estado.'
    
    /* #swagger.parameters['estado'] = {
        in: 'query',
        description: 'Estado de los ejemplares que se desean consultar',
        required: false,
        type: 'string',
        enum: ['Disponible', 'Prestado']
    } */

    /* #swagger.parameters['page'] = {
        in: 'query',
        description: 'Página solicitada. Debe ser un enetero positivo.',
        required: false,
        type: 'integer',
        minimum: 1,
        default: 1
    } */

    /* #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Cantidad máxima de ejemplares por página.',
        required: false,
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10
    } */

    /* #swagger.responses[200] = {
        description: 'Listado obtenido. La respuesta contiene data y pagination.'
    } */

    /* #swagger.responses[400] = {
        description: 'Estado, página o límite inválidos.'
    } */

    /* #swagger.responses[500] = {
        description: 'Error al consultar los ejemplares.'
    } */
        
    try {
        const resultado = getEjemplaresQuerySchema.safeParse(req.query);

        if (!resultado.success) {
            res.status(400).json({
                mensaje: "Parámetros de consulta inválidos",
                errores: resultado.error.issues
            });
            return;
        }

        const ejemplares = await EjemplarModel.listar(resultado.data);

        res.status(200).json(ejemplares);
    } catch (error) {
        console.error("Error al consultar ejemplares:", error);

        res.status(500).json({
            mensaje: "Error al obtener los ejemplares"
        });
    }
}

export async function obtenerEjemplaresPorId(req:Request, res: Response) {
    // #swagger.tags = ['Ejemplares']
    // #swagger.summary = 'Obtener un ejemplar por ID'
    // #swagger.description = 'Busca un ejemplar específico mediante su identificador.'

    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del ejemplar. Debe ser un entero positivo.',
        required: true, 
        type: 'integer',
        minimum: 1
    } */

    /* #swagger.responses[200] = {
        description: 'Ejemplar encontrado.'
    } */

    /* #swagger.responses[400] = {
        description: 'El ID no es un entero positivo válido.'k
    } */

    /* #swagger.responses[404] = { 
        description: 'No existe un ejemplar con ese ID.'
    } */

    /* #swagger.responses[500] = {
        description: 'Error al consultar el ejemplar.'
    } */
    
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
    // #swagger.tags = ['Ejemplares']
    // #swagger.summary = 'Crear un ejemplar'
    // #swagger.description = 'Registra un ejemplar físico de un libro existente.'

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo ejemplar.',
        required: true,
        schema: {
            $id_libro: 1,
            estado: 'Disponible'
        }
    } */

    /* #swagger.responses[201] = {
        description: 'Ejemplar creado correctamente.'
    } */

    /* #swagger.responses[400] = {
        description: 'Los datos enviados son inválidos.'
    } */

    /* #swagger.responses[500] = {
        description: 'Error interno al crear el ejemplar.'
    } */
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
    // #swagger.tags = ['Ejemplares']
    // #swagger.summary = 'Actualizar un ejemplar'
    // #swagger.description = 'Actualiza el libro asociado y el estado de un ejemplar.'

    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del ejemplar que se desea actualizar.',
        required: true,
        type: 'integer',
        minimum: 1
    } */
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo ejemplar.',
        required: true,
        schema: {
            $id_libro: 1,
            estado: 'Disponible'
        }
    } */

    /* #swagger.responses[200] = {
        description: 'Ejemplar actualizado correctamente.'
    } */

    /* #swagger.responses[400] = {
        description: 'ID o datos inválidos, o el libro indicado no existe.'
    } */

    /* #swagger.responses[404] = {
        description: 'Ejemplar no encontrado.'
    } */

    /* #swagger.responses[500] = {
        description: 'Error interno al actualizar el ejemplar.'
    } */
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
    // #swagger.tags = ['Ejemplares']
    // #swagger.summary = 'Eliminar un ejemplar'
    // #swagger.description = 'Elimina un ejemplar si no tiene préstamos registrados.'

    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del ejemplar que se desea eliminar.',
        required: true,
        type: 'integer',
        minimum: 1
    } */

    /* #swagger.responses[200] = {
        description: 'Ejemplar eliminado correctamente.'
    } */

    /* #swagger.responses[400] = {
        description: 'El ID debe ser un entero positivo.'
    } */

    /* #swagger.responses[404] = {
        description: 'Ejemplar no encontrado.'
    } */

    /* #swagger.responses[409] = {
        description: 'No se puede eliminar porque tiene préstamos registrados.'
    } */

    /* #swagger.responses[500] = {
        description: 'Error interno al eliminar el ejemplar.'
    } */

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