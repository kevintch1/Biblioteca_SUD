import { EjemplarModel } from "../models/ejemplares.model.js";

interface CrearEjemplarDatos {
    id_libro: number;
    estado: string;
}

export async function crearEjemplarService(datos: CrearEjemplarDatos) {
    try {
        const resultado = await EjemplarModel.crear(
            datos.id_libro,
            datos.estado
        );

        return resultado.rows[0];
    } catch (error) {
        if (error instanceof Error && "code" in error) {
            if (error.code === "23503") {
                throw Object.assign(
                    new Error("El libro indicado no existe"),
                    { tipo: "REFERENCIA_INVALIDA" }
                );
            }

            if (error.code === "23514") {
                throw Object.assign(
                    new Error("Los datos incumplen una regla de la base"), 
                    { tipo: "VALOR_INVALIDO" }
                );
            }
        }
        throw error;
    }
}