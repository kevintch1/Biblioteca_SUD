// src/controllers/prestamosController.ts

import type { Request, Response } from 'express';
import { pool } from '../config/db.js';

// Guía Probar los Endpoints
// http://localhost:3000/api/prestamos     1- todos los prestamos (GET):
// http://localhost:3000/api/prestamos/2   2- Obtener prestamo especifico (GET):
// http://localhost:3000/api/prestamos     3- Crear un nuevo prestamo (POST):
//   Body (JSON):json
//   { "id_usuario": 1, "id_ejemplar": 3, "fecha_limite": "2026-11-15"}
// http://localhost:3000/api/prestamos/2   4- Registra una devolucion / Actualizar (PUT):
// 	 Body (JSON):json 
//   {"fecha_real_devolucion": "2026-11-02"}
// http://localhost:3000/api/prestamos/1   5- Eliminar un prestamo (DELETE):


// READ ALL - OBTENER TODOS LOS PRESTAMOS 
export const getPrestamos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Usamos INNER JOIN para traer información útil de los usuarios y libros vinculados
    const sql = `
      SELECT p.id_prestamo, p.fecha_entrega, p.fecha_limite, p.fecha_real_devolucion,
             u.nombre AS usuario_nombre, u.correo AS usuario_correo,
             e.id_ejemplar, e.estado AS ejemplar_estado,
             l.titulo AS libro_titulo
      FROM Prestamos p
      INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar
      INNER JOIN Libros l ON e.id_libro = l.id_libro
      ORDER BY p.id_prestamo DESC
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los préstamos' });
  }
};

// READ ONE - OBTENER UN PRESTAMO POR ID 
export const getPrestamoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT p.*, u.nombre AS usuario_nombre, l.titulo AS libro_titulo 
      FROM Prestamos p
      INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar
      INNER JOIN Libros l ON e.id_libro = l.id_libro
      WHERE p.id_prestamo = $1
    `;
    const { rows } = await pool.query(sql, [id]);
    
    if (rows.length === 0) {
      res.status(404).json({ error: 'Préstamo no encontrado' });
      return;
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el préstamo' });
  }
};

// CREATE - REGISTRAR PRESTAMO NUEVO
export const createPrestamo = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, id_ejemplar, fecha_limite, fecha_entrega } = req.body;
  
  if (!id_usuario || !id_ejemplar || !fecha_limite) {
    res.status(400).json({ error: 'Faltan campos obligatorios (id_usuario, id_ejemplar, fecha_limite)' });
    return;
  }

  try {
    // Verificar si el ejemplar existe y si está "Disponible"
    const ejemplarCheck = await pool.query('SELECT estado FROM Ejemplares WHERE id_ejemplar = $1', [id_ejemplar]);
    
    if (ejemplarCheck.rows.length === 0) {
      res.status(404).json({ error: 'El ejemplar especificado no existe' });
      return;
    }
    
    if (ejemplarCheck.rows[0].estado !== 'Disponible') {
      res.status(400).json({ error: 'El ejemplar no está disponible para préstamo actual en este momento' });
      return;
    }

    // Insertar el prestamo (fecha_entrega por defecto es CURRENT_DATE si no se envía)
    const sqlPrestamo = `
      INSERT INTO Prestamos (id_usuario, id_ejemplar, fecha_entrega, fecha_limite) 
      VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4) 
      RETURNING *`;
    const { rows } = await pool.query(sqlPrestamo, [id_usuario, id_ejemplar, fecha_entrega, fecha_limite]);

    // Actualizar el estado del ejemplar a 'Prestado'
    await pool.query("UPDATE Ejemplares SET estado = 'Prestado' WHERE id_ejemplar = $1", [id_ejemplar]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el préstamo' });
  }
};

// UPDATE - DEVOLUCION O ACTUALIZAR UN PRESTAMO 
export const updatePrestamo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fecha_limite, fecha_real_devolucion } = req.body;

  try {
    // Obtener datos actuales del préstamo antes de actualizar
    const prestamoActual = await pool.query('SELECT id_ejemplar, fecha_real_devolucion FROM Prestamos WHERE id_prestamo = $1', [id]);
    
    if (prestamoActual.rows.length === 0) {
      res.status(404).json({ error: 'Préstamo no encontrado' });
      return;
    }

    const { id_ejemplar, fecha_real_devolucion: devolucionPrevia } = prestamoActual.rows[0];

    const sqlUpdate = `
      UPDATE Prestamos 
      SET fecha_limite = COALESCE($1, fecha_limite), 
          fecha_real_devolucion = COALESCE($2, fecha_real_devolucion) 
      WHERE id_prestamo = $3 
      RETURNING *`;
      
    const { rows } = await pool.query(sqlUpdate, [fecha_limite, fecha_real_devolucion, id]);

    // Si se acaba de registrar la fecha de devolución real y antes no estaba devuelto
    if (fecha_real_devolucion && !devolucionPrevia) {
      await pool.query("UPDATE Ejemplares SET estado = 'Disponible' WHERE id_ejemplar = $1", [id_ejemplar]);
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el préstamo' });
  }
};

// DELETE - ELIMINAR UN PRESTAMO
export const deletePrestamo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // Si borramos el préstamo, debemos asegurar el estado del ejemplar involucrado
    const prestamo = await pool.query('SELECT id_ejemplar, fecha_real_devolucion FROM Prestamos WHERE id_prestamo = $1', [id]);
    
    if (prestamo.rows.length === 0) {
      res.status(404).json({ error: 'Préstamo no encontrado' });
      return;
    }

    const { id_ejemplar, fecha_real_devolucion } = prestamo.rows[0];

    await pool.query('DELETE FROM Prestamos WHERE id_prestamo = $1', [id]);

    // Si el préstamo se elimina estando todavía activo (sin devolver), liberamos el libro
    if (!fecha_real_devolucion) {
      await pool.query("UPDATE Ejemplares SET estado = 'Disponible' WHERE id_ejemplar = $1", [id_ejemplar]);
    }

    res.json({ message: 'Registro de préstamo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el préstamo' });
  }
};

// fin - archivo src/controllers/prestamosController.ts
