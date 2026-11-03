import type { Request, Response } from "express";
import { pool } from "../config/db.js";

type IdParams = { id: string };
type CategoryBody = { nombre?: unknown };

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
        const { rows } = await pool.query(
            "SELECT id_categoria, nombre FROM categorias ORDER BY id_categoria",
        );
        res.json(rows);
    });
}

export async function getCategory(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const { rows } = await pool.query(
            "SELECT id_categoria, nombre FROM categorias WHERE id_categoria = $1",
            [id],
        );
        if (rows.length === 0) {
            res.status(404).json({ error: "Categoría no encontrada." });
            return;
        }
        res.json(rows[0]);
    });
}

export async function createCategory(
    req: Request<Record<string, string>, unknown, CategoryBody>,
    res: Response,
): Promise<void> {
    const nombre = requiredName(req.body?.nombre);
    if (!nombre) {
        res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
        return;
    }

    await handleDatabaseError(res, async () => {
        const { rows } = await pool.query(
            "INSERT INTO categorias (nombre) VALUES ($1) RETURNING id_categoria, nombre",
            [nombre],
        );
        res.status(201).json(rows[0]);
    });
}

export async function updateCategory(
    req: Request<IdParams, unknown, CategoryBody>,
    res: Response,
): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;
    const nombre = requiredName(req.body?.nombre);
    if (!nombre) {
        res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
        return;
    }

    await handleDatabaseError(res, async () => {
        const { rows } = await pool.query(
            "UPDATE categorias SET nombre = $1 WHERE id_categoria = $2 RETURNING id_categoria, nombre",
            [nombre, id],
        );
        if (rows.length === 0) {
            res.status(404).json({ error: "Categoría no encontrada." });
            return;
        }
        res.json(rows[0]);
    });
}

export async function deleteCategory(req: Request<IdParams>, res: Response): Promise<void> {
    const id = parseId(req, res);
    if (id === undefined) return;

    await handleDatabaseError(res, async () => {
        const { rowCount } = await pool.query(
            "DELETE FROM categorias WHERE id_categoria = $1",
            [id],
        );
        if (rowCount === 0) {
            res.status(404).json({ error: "Categoría no encontrada." });
            return;
        }
        res.status(204).send();
    });
}
