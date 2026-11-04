import type { Request, Response } from "express";
import {
    createAuthor as insertAuthor,
    deleteAuthor as removeAuthor,
    findAllAuthors,
    findAuthorById,
    updateAuthor as saveAuthor,
} from "../models/autores.model.js";
import { autorBodySchema, autorParamsSchema } from "../schemas/autores.schema.js";

type IdParams = { id: string };

function parseId(req: Request<IdParams>, res: Response): number | undefined {
    const resultado = autorParamsSchema.safeParse(req.params);
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

export async function getAuthors(_req: Request, res: Response): Promise<void> {
    await handleDatabaseError(res, async () => {
        res.json(await findAllAuthors());
    });
}

export async function getAuthor(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const author = await findAuthorById(id);
        if (!author) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.json(author);
    });
}

export async function createAuthor(
    req: Request<Record<string, string>, unknown, unknown>,
    res: Response,
): Promise<void> {
    const resultado = autorBodySchema.safeParse(req.body);
    if (!resultado.success) {
        res.status(400).json({
            error: resultado.error.issues[0]?.message ?? "Datos de autor inválidos.",
        });
        return;
    }

    await handleDatabaseError(res, async () => {
        const { nombre, nacionalidad } = resultado.data;
        res.status(201).json(await insertAuthor(nombre, nacionalidad ?? null));
    });
}

export async function updateAuthor(
    req: Request<IdParams, unknown, unknown>,
    res: Response,
): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;
    const resultado = autorBodySchema.safeParse(req.body);
    if (!resultado.success) {
        res.status(400).json({
            error: resultado.error.issues[0]?.message ?? "Datos de autor inválidos.",
        });
        return;
    }

    await handleDatabaseError(res, async () => {
        const { nombre, nacionalidad } = resultado.data;
        const author = await saveAuthor(id, nombre, nacionalidad ?? null);
        if (!author) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.json(author);
    });
}

export async function deleteAuthor(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const deletedRows = await removeAuthor(id);
        if (deletedRows === 0) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.status(204).send();
    });
}
