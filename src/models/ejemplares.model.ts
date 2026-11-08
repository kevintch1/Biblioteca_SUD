import { pool } from "../config/db.js";

export const EjemplarModel = {
    async listar(filters: {
        estado?: string | undefined;
        page: number;
        limit: number;
    }) {
        const { estado, page, limit } = filters;

        let sqlBase = "WHERE 1=1";
        const values: (string | number)[] = [];
        let paramIndex = 1;

        if (estado !== undefined) {
            sqlBase += ` AND estado = $${paramIndex}`;
            values.push(estado);
            paramIndex++;
        }

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM ejemplares
            ${sqlBase}
        `;

        const countResult = await pool.query(countQuery, values);
        const totalItem = Number(countResult.rows[0].total);

        const offset = (page - 1) * limit;

        const dataQuery = `
            SELECT *
            FROM ejemplares
            ${sqlBase}
            ORDER BY id_ejemplar ASC
            LIMIT $${paramIndex}
            OFFSET $${paramIndex + 1}
        `;

        const queryValues = [...values, limit, offset];
        const { rows } = await pool.query(dataQuery, queryValues);

        return {
            data: rows,
            pagination: {
                totalItem, 
                itemsPerPage: limit,
                currentPage: page,
                totalPages: Math.ceil(totalItem / limit)
            }
        };
    },
    async obtenerPorId(id: number) {
        return pool.query(
            "SELECT * FROM ejemplares WHERE id_ejemplar = $1",
            [id]
        );
    },

    async crear(id_libro: number, estado: string) {
        return pool.query(
            `INSERT INTO ejemplares (id_libro, estado)
             VALUES ($1, $2)
             RETURNING *`,
            [id_libro, estado]
        );
    },

    async actualizar(id: number, id_libro: number, estado: string) {
        return pool.query(
            `UPDATE ejemplares
             SET id_libro = $1, estado = $2
             WHERE id_ejemplar = $3
             RETURNING *`,
            [id_libro, estado, id]
        );
    },

    async eliminar(id: number) {
        return pool.query(
            `DELETE FROM ejemplares
             WHERE id_ejemplar = $1
             RETURNING *`,
            [id]
        );
    }
};