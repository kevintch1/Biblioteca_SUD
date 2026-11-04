import type { Request, Response } from "express";
import {
    createCategory as insertCategory,
    deleteCategory as removeCategory,
    findAllCategories,
    findCategoryById,
    updateCategory as saveCategory,
} from "../models/categorias.model.js";
import { categoriaBodySchema, categoriaParamsSchema } from "../schemas/categorias.schema.js";

type IdParams = { id: string };

function parseId(req: Request<IdParams>, res: Response): number | undefined {
    const resultado = categoriaParamsSchema.safeParse(req.params);
    if (!resultado.success) {
        res.status(400).json({
            error: resultado.error.issues[0]?.message ?? "Parámetros inválidos.",
        });
        return undefined;
    }
    return resultado.data.id;
}

async function handleDatabaseError(
    res: Response,
    action: () => Promise<void>,
): Promise<void> {
    try {
        await action();
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error interno al consultar la base de datos." });
        }
    }
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
    await handleDatabaseError(res, async () => {
        res.json(await findAllCategories());
    });
}

export async function getCategory(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const category = await findCategoryById(id);
        if (!category) {
            res.status(404).json({ error: "Categoría no encontrada." });
            return;
        }
        res.json(category);
    });
}

export async function createCategory(
    req: Request<Record<string, string>, unknown, unknown>,
    res: Response,
): Promise<void> {
    const resultado = categoriaBodySchema.safeParse(req.body);
    if (!resultado.success) {
        res.status(400).json({
            error:
                resultado.error.issues[0]?.message ?? "Datos de categoría inválidos.",
        });
        return;
    }

    await handleDatabaseError(res, async () => {
        res.status(201).json(await insertCategory(resultado.data.nombre));
    });
}

export async function updateCategory(
    req: Request<IdParams, unknown, unknown>,
    res: Response,
): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;
    const resultado = categoriaBodySchema.safeParse(req.body);
    if (!resultado.success) {
        res.status(400).json({
            error:
                resultado.error.issues[0]?.message ?? "Datos de categoría inválidos.",
        });
        return;
    }

    await handleDatabaseError(res, async () => {
        const category = await saveCategory(id, resultado.data.nombre);
        if (!category) {
            res.status(404).json({ error: "Categoría no encontrada." });
            return;
        }
        res.json(category);
    });
}

export async function deleteCategory(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const deletedRows = await removeCategory(id);
        if (deletedRows === 0) {
            res.status(404).json({ error: "Categoría no encontrada." });
            return;
        }
        res.status(204).send();
    });
}
