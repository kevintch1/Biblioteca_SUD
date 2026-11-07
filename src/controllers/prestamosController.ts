import type { Request, Response } from "express";
import { pool } from "../config/db.js";

type ValidatedIdParams = {
  id: number;
};

// READ ALL - Obtener todos los préstamos
export const getPrestamos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const sql = `
            SELECT
                p.id_prestamo,
                p.fecha_entrega,
                p.fecha_limite,
                p.fecha_real_devolucion,
                u.nombre AS usuario_nombre,
                u.correo AS usuario_correo,
                e.id_ejemplar,
                e.estado AS ejemplar_estado,
                l.titulo AS libro_titulo
            FROM Prestamos p
            INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
            INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar
            INNER JOIN Libros l ON e.id_libro = l.id_libro
            ORDER BY p.id_prestamo DESC
        `;

    const { rows } = await pool.query(sql);

    res.status(200).json(rows);

  } catch (error) {
    console.error("Error al obtener los préstamos:", error);

    res.status(500).json({
      error: "Error al obtener los préstamos"
    });
  }
};

// READ ONE - Obtener un préstamo por ID
export const getPrestamoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = res.locals.paramsValidados as ValidatedIdParams;

  try {
    const sql = `
            SELECT
                p.*,
                u.nombre AS usuario_nombre,
                l.titulo AS libro_titulo
            FROM Prestamos p
            INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
            INNER JOIN Ejemplares e ON p.id_ejemplar = e.id_ejemplar
            INNER JOIN Libros l ON e.id_libro = l.id_libro
            WHERE p.id_prestamo = $1
        `;

    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      res.status(404).json({
        error: "Préstamo no encontrado"
      });
      return;
    }

    const prestamo = rows[0];

    if (prestamo.fecha_real_devolucion) {
      prestamo.mensaje = "Este préstamo ya ha sido devuelto.";
    }

    res.status(200).json(prestamo);

  } catch (error) {
    console.error("Error al obtener el préstamo:", error);

    res.status(500).json({
      error: "Error al obtener el préstamo"
    });
  }
};

// CREATE - Registrar un préstamo nuevo
export const createPrestamo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    id_usuario,
    id_ejemplar,
    fecha_limite,
    fecha_entrega
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Comprobar que el usuario existe
    const usuario = await client.query(
      "SELECT id_usuario FROM Usuarios WHERE id_usuario = $1",
      [id_usuario]
    );

    if (usuario.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        error: "El usuario especificado no existe"
      });
      return;
    }

    // Bloquear el ejemplar mientras se procesa el préstamo
    const ejemplar = await client.query(
      `SELECT estado
             FROM Ejemplares
             WHERE id_ejemplar = $1
             FOR UPDATE`,
      [id_ejemplar]
    );

    if (ejemplar.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        error: "El ejemplar especificado no existe"
      });
      return;
    }

    if (ejemplar.rows[0].estado !== "Disponible") {
      await client.query("ROLLBACK");

      res.status(400).json({
        error: "El ejemplar no está disponible para préstamo"
      });
      return;
    }

    // Registrar el préstamo
    const sqlPrestamo = `
            INSERT INTO Prestamos (
                id_usuario,
                id_ejemplar,
                fecha_entrega,
                fecha_limite
            )
            VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4)
            RETURNING *
        `;

    const resultado = await client.query(sqlPrestamo, [
      id_usuario,
      id_ejemplar,
      fecha_entrega ?? null,
      fecha_limite
    ]);

    // Cambiar el estado del ejemplar
    await client.query(
      `UPDATE Ejemplares
             SET estado = 'Prestado'
             WHERE id_ejemplar = $1`,
      [id_ejemplar]
    );

    await client.query("COMMIT");

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al procesar el préstamo:", error);

    res.status(500).json({
      error: "Error al procesar el préstamo"
    });

  } finally {
    client.release();
  }
};

// UPDATE - Actualizar préstamo o registrar devolución
export const updatePrestamo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = res.locals.paramsValidados as ValidatedIdParams;

  const {
    fecha_limite,
    fecha_real_devolucion
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const prestamoActual = await client.query(
      `SELECT id_ejemplar, fecha_real_devolucion
             FROM Prestamos
             WHERE id_prestamo = $1
             FOR UPDATE`,
      [id]
    );

    if (prestamoActual.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        error: "Préstamo no encontrado"
      });
      return;
    }

    const {
      id_ejemplar,
      fecha_real_devolucion: devolucionPrevia
    } = prestamoActual.rows[0];

    if (devolucionPrevia && fecha_real_devolucion) {
      await client.query("ROLLBACK");

      res.status(400).json({
        error: "Este préstamo ya fue devuelto"
      });
      return;
    }

    const sqlUpdate = `
            UPDATE Prestamos
            SET
                fecha_limite = COALESCE($1::date, fecha_limite),
                fecha_real_devolucion =
                    COALESCE($2::date, fecha_real_devolucion)
            WHERE id_prestamo = $3
            RETURNING *
        `;

    const { rows } = await client.query(sqlUpdate, [
      fecha_limite ?? null,
      fecha_real_devolucion ?? null,
      id
    ]);

    // Si se registra la devolución, liberar el ejemplar
    if (fecha_real_devolucion && !devolucionPrevia) {
      await client.query(
        `UPDATE Ejemplares
                 SET estado = 'Disponible'
                 WHERE id_ejemplar = $1`,
        [id_ejemplar]
      );
    }

    await client.query("COMMIT");

    res.status(200).json(rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al actualizar el préstamo:", error);

    res.status(500).json({
      error: "Error al actualizar el préstamo"
    });

  } finally {
    client.release();
  }
};

// DELETE - Eliminar un préstamo
export const deletePrestamo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = res.locals.paramsValidados as ValidatedIdParams;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const prestamo = await client.query(
      `SELECT id_ejemplar, fecha_real_devolucion
             FROM Prestamos
             WHERE id_prestamo = $1
             FOR UPDATE`,
      [id]
    );

    if (prestamo.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        error: "Préstamo no encontrado"
      });
      return;
    }

    const {
      id_ejemplar,
      fecha_real_devolucion
    } = prestamo.rows[0];

    await client.query(
      "DELETE FROM Prestamos WHERE id_prestamo = $1",
      [id]
    );

    // Si el préstamo no había sido devuelto,
    // el ejemplar vuelve a estar disponible
    if (!fecha_real_devolucion) {
      await client.query(
        `UPDATE Ejemplares
                 SET estado = 'Disponible'
                 WHERE id_ejemplar = $1`,
        [id_ejemplar]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Registro de préstamo eliminado correctamente"
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al eliminar el préstamo:", error);

    res.status(500).json({
      error: "Error al eliminar el préstamo"
    });

  } finally {
    client.release();
  }
};
