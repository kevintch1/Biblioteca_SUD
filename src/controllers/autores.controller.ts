import type { Request, Response } from "express";
import {
    createAuthor as insertAuthor,
    deleteAuthor as removeAuthor,
    findAllAuthors,
    findAuthorById,
    updateAuthor as saveAuthor,
} from "../models/autores.model.js";

type IdParams = { id: string };
type AuthorBody = { nombre?: unknown; nacionalidad?: unknown };

function parseId(req: Request<IdParams>, res: Response): number | undefined {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
        res.status(400).json({ error: "El id debe ser un entero positivo." });
        return undefined;
    }
    return id;
}

function requiredName(value: unknown): string | undefined {
    if (typeof value !== "string" || value.trim().length === 0) {
        return undefined;
    }
    return value.trim();
}

function optionalNationality(value: unknown): string | null | undefined {
    if (value === undefined || value === null) {
        return null;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    return value.trim() || null;
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
    req: Request<Record<string, string>, unknown, AuthorBody>,
    res: Response,
): Promise<void> {
    const nombre = requiredName(req.body?.nombre);
    const nacionalidad = optionalNationality(req.body?.nacionalidad);
    if (!nombre || nacionalidad === undefined) {
        res.status(400).json({
            error: "El nombre es obligatorio y la nacionalidad debe ser texto o null.",
        });
        return;
    }

    await handleDatabaseError(res, async () => {
        res.status(201).json(await insertAuthor(nombre, nacionalidad));
    });
}

export async function updateAuthor(
    req: Request<IdParams, unknown, AuthorBody>,
    res: Response,
): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;
    const nombre = requiredName(req.body?.nombre);
    const nacionalidad = optionalNationality(req.body?.nacionalidad);
    if (!nombre || nacionalidad === undefined) {
        res.status(400).json({
            error: "El nombre es obligatorio y la nacionalidad debe ser texto o null.",
        });
        return;
    }

    await handleDatabaseError(res, async () => {
        const author = await saveAuthor(id, nombre, nacionalidad);
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
