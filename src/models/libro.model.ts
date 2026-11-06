import { query } from "../config/db.js";
export const LibroModel = {
    async findAll(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const { rows } = await query(
        "SELECT * FROM libros ORDER BY id_libro ASC LIMIT $1 OFFSET $2",
        [limit, offset]
    );

    return rows;
},

    async findById (id: number) {
        const { rows } = await query(
            "SELECT * FROM libros WHERE id_libro =$1",
            [id]
        );
        return rows[0];
    },

    async create (
        titulo: string,
        editorial: string,
        anio_publicacion: number,
        id_categoria: number
    ) {
         const { rows } = await query(
            "INSERT INTO libros (titulo, editorial, anio_publicacion, id_categoria) VALUES ($1, $2 ,$3 ,$4) RETURNING *",
        [titulo, editorial, anio_publicacion, id_categoria] 
        );
        return rows[0];
    },

    async update (
        id: number,
        titulo: string,
        editorial: string,
        anio_publicacion: number,
        id_categoria: number
    ) {
         const { rows } = await query(
            "UPDATE libros SET titulo = $1, editorial = $2, anio_publicacion = $3, id_categoria = $4 WHERE id_libro = $5 RETURNING *",
        [titulo, editorial, anio_publicacion, id_categoria, id] 
        );
        return rows[0];
},
async delete (id: number) {
        const { rows } = await query(
            "DELETE FROM libros WHERE id_libro =$1 RETURNING *",
            [id]
        );
        return rows[0];
    },
}; 