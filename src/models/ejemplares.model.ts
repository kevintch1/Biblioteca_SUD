import { pool } from "../config/db.js";

export const EjemplarModel = {
    async listar() {
        return pool.query(
            "SELECT * FROM ejemplares ORDER BY id_ejemplar ASC"
        );
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