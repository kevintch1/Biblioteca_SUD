import { query } from "../config/db.js";

export const usuariosModels = {
  async findAll(filters: { 
    nombre?: string | undefined;
    correo?: string | undefined;
    page: number;
    limit: number;
  }) {
    const { nombre, correo, page, limit } = filters; 
     let sqlBase = "WHERE 1=1";
    const values: any[] = [];
    let paramIndex = 1;

    if (nombre) {
      sqlBase += ` AND nombre LIKE $${paramIndex}`;
      values.push(`%${nombre}%`);
      paramIndex++;
    }
    if (correo) {
      sqlBase += ` AND correo LIKE $${paramIndex}`;
      values.push(`%${correo}%`);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM users ${sqlBase}`;
    const countResult = await query(countQuery, values);
    const totalItem = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * limit;
    let dataQuery = `SELECT * FROM users ${sqlBase} ORDER BY id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const queryValues = [...values, limit, offset];
    const { rows } = await query(dataQuery, queryValues);
    return {
      data: rows,
      pagination: {
        totalItem,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalItem / limit),
      },
    };  
   
  },

  async findById(id: number) {
    const { rows } = await query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [id]
    );
    return rows[0];
  },

  async create(nombre: string, tipo: string, correo: string) {
    const text = `
            INSERT INTO usuarios (nombre, tipo, correo)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

    const { rows } = await query(text, [nombre, tipo, correo]);
    return rows[0];
  },

  async findByEmail(correo: string) {
    const { rows } = await query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );
    return rows[0];
  },
  async update(
    id: number,
    nombre: string,
    tipo: string,
    correo: string
  ) {
    const text = `
      UPDATE usuarios
      SET nombre = $1,
          tipo = $2,
          correo = $3
      WHERE id_usuario = $4
      RETURNING *
    `;

    const { rows } = await query(text, [nombre, tipo, correo, id]);
    return rows[0];
  },

  async delete(id: number) {
    const text = `
      DELETE FROM usuarios
      WHERE id_usuario = $1
      RETURNING *
    `;

    const { rows } = await query(text, [id]);
    return rows[0];
  }

};