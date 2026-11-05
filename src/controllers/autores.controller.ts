import type { Request, Response } from "express";
import {
    createAuthor as insertAuthor,
    deleteAuthor as removeAuthor,
    findAllAuthors,
    findAuthorById,
    updateAuthor as saveAuthor,
} from "../models/autores.model.js";
import { autorBodySchema } from "../schemas/autores.schema.js";
import type { z } from "zod";

type IdParams = { id: string };

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
    const id = Number(req.params.id);

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
    req: Request<
        Record<string, string>,
        unknown,
        z.infer<typeof autorBodySchema>
    >,
    res: Response,
): Promise<void> {
    const { nombre, nacionalidad } = req.body;

    await handleDatabaseError(res, async () => {
        res.status(201).json(await insertAuthor(nombre, nacionalidad ?? null));
    });
}

export async function updateAuthor(
    req: Request<IdParams, unknown, z.infer<typeof autorBodySchema>>,
    res: Response,
): Promise<void> {
    const id = Number(req.params.id);

    const { nombre, nacionalidad } = req.body;

    await handleDatabaseError(res, async () => {
        const author = await saveAuthor(id, nombre, nacionalidad ?? null);
        if (!author) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.json(author);
    });
}

export async function deleteAuthor(req: Request<IdParams>, res: Response): Promise<void> {
    const id = Number(req.params.id);

    await handleDatabaseError(res, async () => {
        const deletedRows = await removeAuthor(id);
        if (deletedRows === 0) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.status(204).send();
    });
}
