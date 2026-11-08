
import type { Request, Response } from "express";
import {
    createCategory as insertCategory,
    deleteCategory as removeCategory,
    findAllCategories,
    findCategoryById,
    updateCategory as saveCategory,
} from "../models/categorias.model.js";
import { categoriaBodySchema } from "../schemas/categorias.schema.js";
import type { z } from "zod";

type ValidatedIdParams = {
    id: number;
};

async function handleDatabaseError(
    res: Response,
    action: () => Promise<void>,
): Promise<void> {
    try {
        await action();
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({
                error: "Error interno al consultar la base de datos.",
            });
        }
    }
}

export async function getCategories(
    req: Request,
    res: Response,
): Promise<void> {
    const nombre = req.query.nombre;

    if (nombre !== undefined && typeof nombre !== "string") {
        res.status(400).json({
            error: "El filtro nombre debe ser un texto.",
        });
        return;
    }

    const filtro = nombre?.trim() || undefined;

    await handleDatabaseError(res, async () => {
        res.json(await findAllCategories(filtro));
    });
}

export async function getCategory(
    req: Request,
    res: Response,
): Promise<void> {
    const { id } = res.locals.paramsValidados as ValidatedIdParams;

    await handleDatabaseError(res, async () => {
        const category = await findCategoryById(id);

        if (!category) {
            res.status(404).json({
                error: "Categoría no encontrada.",
            });
            return;
        }

        res.json(category);
    });
}

export async function createCategory(
    req: Request<
        Record<string, string>,
        unknown,
        z.infer<typeof categoriaBodySchema>
    >,
    res: Response,
): Promise<void> {
    await handleDatabaseError(res, async () => {
        res.status(201).json(
            await insertCategory(req.body.nombre),
        );
    });
}

export async function updateCategory(
    req: Request<
        Record<string, string>,
        unknown,
        z.infer<typeof categoriaBodySchema>
    >,
    res: Response,
): Promise<void> {
    const { id } = res.locals.paramsValidados as ValidatedIdParams;

    await handleDatabaseError(res, async () => {
        const category = await saveCategory(id, req.body.nombre);

        if (!category) {
            res.status(404).json({
                error: "Categoría no encontrada.",
            });
            return;
        }

        res.json(category);
    });
}

export async function deleteCategory(
    req: Request,
    res: Response,
): Promise<void> {
    const { id } = res.locals.paramsValidados as ValidatedIdParams;

    await handleDatabaseError(res, async () => {
        const deletedRows = await removeCategory(id);

        if (deletedRows === 0) {
            res.status(404).json({
                error: "Categoría no encontrada.",
            });
            return;
        }

        res.status(204).send();
    });
}
