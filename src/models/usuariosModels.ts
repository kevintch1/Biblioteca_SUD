 import { query } from "../config/db.js";


export const usuariosModels = {
  async findAll() {
    const { rows } = await query("SELECT * FROM usuarios ORDER BY id ASC");
    return rows;
  },
async findById(id: number) {
    const { rows } = await query("SELECT * FROM usuarios WHERE id=$1", [id]);
    return rows[0]; 
  },
  async create(name: string, type: string, email: string) {
    const text = "INSERT INTO usuarios(name,type,email) VALUES($1,$2) RETURNING *";
    const { rows } = await query(text, [name, type, email]);
    return rows[0];
  },
  async findByEmail(email: string) {
    const { rows } = await query("SELECT * FROM usuarios WHERE email=$1", [email]);
    return rows[0];
  },
};