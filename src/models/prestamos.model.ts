// src/models/prestamos.model.ts
import { pool } from '../config/db.js';

// Interfaces para tipar las respuestas de la base de datos
export interface PrestamoSQL {
  id_prestamo: number;    fecha_entrega: Date;
  fecha_limite: Date;     fecha_real_devolucion: Date | null;
  usuario_nombre: string; usuario_correo: string;
  id_ejemplar: number;    ejemplar_estado: string;
  libro_titulo: string;   autores_nombres?: string;
}

interface FiltrosPrestamo {
  id_usuario?: string;            id_ejemplar?: string;
  fecha_entrega?: string;         fecha_limite?: string;
  fecha_real_devolucion?: string; usuario_nombre?: string;
  libro_titulo?: string;          autor_nombre?: string;
  limit?: string | number;        page?: string | number; // evitar fallos
}

// Función auxiliar para transformar "DD/MM/YYYY" al formato "YYYY-MM-DD" que requiere PostgreSQL
const formatoAPIaPostgres = (fechaStr?: string | null): string | null => {
  if (!fechaStr) return null;    const [dia, mes, anio] = fechaStr.split('/');
  return `${anio}-${mes}-${dia}`;
};

// ***** modelo 2 ************************************************

export const prestamosModel = {
  async getAllPrestamos(filtros: FiltrosPrestamo = {}): Promise<{ count: number; results: any[] }> {
    const { 
      id_usuario, id_ejemplar, fecha_entrega, fecha_limite, 
      fecha_real_devolucion, usuario_nombre, libro_titulo, 
      autor_nombre, limit, page 
    } = filtros;
    
    const values: any[] = [];
    let paramIndex = 1;

    // numeros si vienen como Strings desde la URL (?limit=2&page=1)
    const parsedLimit = limit ? parseInt(limit.toString(), 10) : null;
    const parsedPage = page ? parseInt(page.toString(), 10) : 1;    

    // Bloque WHERE compartido para mantener los filtros identicos en Data y en Count
    let whereQuery = ' WHERE 1=1';
    
    if (id_usuario && !isNaN(Number(id_usuario))) { 
      whereQuery += ` AND p.id_usuario = $${paramIndex}`;
      values.push(Number(id_usuario));      paramIndex++;     }
    if (id_ejemplar && !isNaN(Number(id_ejemplar))) { 
      whereQuery += ` AND p.id_ejemplar = $${paramIndex}`;
      values.push(Number(id_ejemplar));      paramIndex++;   }
    if (fecha_entrega) { 
      whereQuery += ` AND p.fecha_entrega = $${paramIndex}`;
      values.push(formatoAPIaPostgres(fecha_entrega));     paramIndex++;      }
    if (fecha_limite)  { 
      whereQuery += ` AND p.fecha_limite = $${paramIndex}`;
      values.push(formatoAPIaPostgres(fecha_limite));      paramIndex++;      }
    if (fecha_real_devolucion) { 
      whereQuery += ` AND p.fecha_real_devolucion = $${paramIndex}`;
      values.push(formatoAPIaPostgres(fecha_real_devolucion));  paramIndex++;      }
    if (usuario_nombre) { 
      whereQuery += ` AND u.nombre ILIKE $${paramIndex}`; 
      values.push(`%${usuario_nombre}%`);       paramIndex++;   }
    if (libro_titulo)   { 
      whereQuery += ` AND l.titulo ILIKE $${paramIndex}`;
      values.push(`%${libro_titulo}%`);       paramIndex++;     }
    if (autor_nombre)   { 
      whereQuery += ` AND a.nombre ILIKE $${paramIndex}`;
      values.push(`%${autor_nombre}%`);        paramIndex++;    }

    // 1. TOTAL: registros cumplen filtros
    const sqlCount = `
      SELECT COUNT(DISTINCT p.id_prestamo) as total
      FROM Prestamos p
      INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar
      INNER JOIN Libros l ON e.id_libro = l.id_libro
      LEFT  JOIN Libro_Autor la ON l.id_libro = la.id_libro
      LEFT  JOIN Autores a ON la.id_autor = a.id_autor
      ${whereQuery}
    `;

    // Clonar array de parametros exactos usados para query de Count
    const countValues = [...values];

    // 2. consulta DATA con PAGINACION (LIMIT Y OFFSET)
    let sqlData = `
      SELECT DISTINCT 
        p.id_prestamo, p.fecha_entrega, p.fecha_limite, p.fecha_real_devolucion, 
        u.nombre AS usuario_nombre, u.correo AS usuario_correo, u.tipo AS usuario_tipo, 
        e.id_ejemplar, e.estado AS ejemplar_estado, l.titulo AS libro_titulo, 
        STRING_AGG(a.nombre, ', ') AS autores_nombres
      FROM Prestamos p
      INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar
      INNER JOIN Libros l ON e.id_libro = l.id_libro
      LEFT  JOIN Libro_Autor la ON l.id_libro = la.id_libro
      LEFT  JOIN Autores a ON la.id_autor = a.id_autor
      ${whereQuery}
      GROUP BY p.id_prestamo, u.id_usuario, e.id_ejemplar, l.id_libro 
      ORDER BY p.id_prestamo DESC 
    `;
  
    // Agrega LIMIT
    if (parsedLimit && !isNaN(parsedLimit)) { 
      sqlData += ` LIMIT $${paramIndex}`;
      values.push(parsedLimit); paramIndex++; 

    // agrega OFFSET segun pg actual ( (page - 1 ) * limit )
      const offset = (parsedPage - 1) * parsedLimit;
      sqlData += ` OFFSET $${paramIndex}`;
      values.push(offset);  paramIndex++;
    }

    // console.log(`Ejecutando SQL Data: ${sqlData}`);

    // Ejecutamos ambas consultas en paralelo 
    const [countResult, dataResult] = await Promise.all([
      pool.query(sqlCount, countValues),  pool.query(sqlData, values) ]);

    const totalRegistros = parseInt(countResult.rows[0].total, 10);

    return {
      count: totalRegistros, // Total BD (ej. 5)
      results: dataResult.rows // Array recortado porpágina (ej. 2 reg)
    };
  },

  // Obtener un prestamo por ID
  async getPrestamoById(id: string): Promise<any> {
    const sql = `
      SELECT p.*, u.nombre AS usuario_nombre, l.titulo AS libro_titulo 
      FROM Prestamos p 
      INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario 
      INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar 
      INNER JOIN Libros l ON e.id_libro = l.id_libro 
      WHERE p.id_prestamo = $1;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  },


  // Verifica existencia y estado de un ejemplar
  async checkEjemplarStatus(id_ejemplar: number): Promise<string | null> {
    const { rows } = await pool.query('SELECT estado FROM Ejemplares WHERE id_ejemplar = $1', [id_ejemplar]);
    return rows.length > 0 ? rows[0].estado : null;
  },

  // Registra un prestamo y cambia estado del ejemplar a 'Prestado'
  async createPrestamo(id_usuario: number, id_ejemplar: number, fecha_limite: string, fecha_entrega?: string): Promise<any> {
    // CORREGIDO: Mapeo de fechas al formato ISO de la base de datos
    const fechaLimiteISO = formatoAPIaPostgres(fecha_limite);
    const fechaEntregaISO = formatoAPIaPostgres(fecha_entrega);

    const sqlPrestamo = `
      INSERT INTO Prestamos (id_usuario, id_ejemplar, fecha_entrega, fecha_limite) 
      VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4) RETURNING *;
    `;
    const { rows } = await pool.query(sqlPrestamo, [id_usuario, id_ejemplar, fechaEntregaISO, fechaLimiteISO]);
    await pool.query("UPDATE Ejemplares SET estado = 'Prestado' WHERE id_ejemplar = $1", [id_ejemplar]);
    return rows[0];
  },

  // Actualiza prestamo y opcional disponible el ejemplar
  async updatePrestamo(id: string, fecha_limite: string | null, fecha_real_devolucion: string | null): Promise<any> {
    const prestamoActual = await pool.query('SELECT id_ejemplar, fecha_real_devolucion FROM Prestamos WHERE id_prestamo = $1', [id]);
    if (prestamoActual.rows.length === 0) return null;

    const { id_ejemplar, fecha_real_devolucion: devolucionPrevia } = prestamoActual.rows[0];

    // CORREGIDO: Mapeo seguro de fechas opcionales para evitar romper la sintaxis SQL
    const fechaLimiteISO = formatoAPIaPostgres(fecha_limite);
    const fechaDevolucionISO = formatoAPIaPostgres(fecha_real_devolucion);

    const sqlUpdate = `
      UPDATE Prestamos 
      SET fecha_limite = COALESCE($1, fecha_limite), fecha_real_devolucion = COALESCE($2, fecha_real_devolucion) 
      WHERE id_prestamo = $3 RETURNING *;
    `;
    const { rows } = await pool.query(sqlUpdate, [fechaLimiteISO, fechaDevolucionISO, id]);

    if (fecha_real_devolucion && !devolucionPrevia) {
      await pool.query("UPDATE Ejemplares SET estado = 'Disponible' WHERE id_ejemplar = $1", [id_ejemplar]);
    }

    return rows[0];
  },

  // Elimina un prestamo y revertir el estado del ejemplar si no se había devuelto
  async deletePrestamo(id: string): Promise<boolean> {
    const prestamo = await pool.query('SELECT id_ejemplar, fecha_real_devolucion FROM Prestamos WHERE id_prestamo = $1', [id]);
    if (prestamo.rows.length === 0) return false;

    const { id_ejemplar, fecha_real_devolucion } = prestamo.rows[0];

    await pool.query('DELETE FROM Prestamos WHERE id_prestamo = $1', [id]);

    if (!fecha_real_devolucion) {
      await pool.query("UPDATE Ejemplares SET estado = 'Disponible' WHERE id_ejemplar = $1", [id_ejemplar]);
    }

    return true;
  }
};
// fin - src/models/prestamos.model.ts 