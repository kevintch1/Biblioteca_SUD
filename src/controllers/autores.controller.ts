import type { Request, Response } from "express";
import { pool } from "../config/db.js";

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
        const { rows } = await pool.query(
            "SELECT id_autor, nombre, nacionalidad FROM autores ORDER BY id_autor",
        );
        res.json(rows);
    });
}

export async function getAuthor(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const { rows } = await pool.query(
            "SELECT id_autor, nombre, nacionalidad FROM autores WHERE id_autor = $1",
            [id],
        );
        if (rows.length === 0) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.json(rows[0]);
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
        const { rows } = await pool.query(
            "INSERT INTO autores (nombre, nacionalidad) VALUES ($1, $2) RETURNING id_autor, nombre, nacionalidad",
            [nombre, nacionalidad],
        );
        res.status(201).json(rows[0]);
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
        const { rows } = await pool.query(
            "UPDATE autores SET nombre = $1, nacionalidad = $2 WHERE id_autor = $3 RETURNING id_autor, nombre, nacionalidad",
            [nombre, nacionalidad, id],
        );
        if (rows.length === 0) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.json(rows[0]);
    });
}

export async function deleteAuthor(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const { rowCount } = await pool.query(
            "DELETE FROM autores WHERE id_autor = $1",
            [id],
        );
        if (rowCount === 0) {
            res.status(404).json({ error: "Autor no encontrado." });
            return;
        }
        res.status(204).send();
    });
}
