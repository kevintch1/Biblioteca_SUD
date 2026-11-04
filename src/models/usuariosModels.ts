import { query } from "../config/db.js";

export const usuariosModels = {
  async findAll() {
    const { rows } = await query(
      "SELECT * FROM usuarios ORDER BY id_usuario ASC"
    );
    return rows;
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