// src/index.ts
// 

import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import route from "./routes/route.js";

// importa ruta de prestamos
import prestamosRouter from "./routes/prestamosRoute.js"; // Importamos las rutas de préstamos


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Agrega las rutas del CRUD de prestamos
app.use("/api/prestamos", prestamosRouter);
// ayuda Para probar los Endpoints (Thunder Client)
// URL: http://localhost:3000/api/prestamos    1- todos los prestamos (GET)
// URL: http://localhost:3000/api/prestamos/2  2- Un prestamo especifico (GET)
// URL: http://localhost:3000/api/prestamos    3- Crear un nuevo prestamo (POST):
//     Body (JSON):json
//     {"id_usuario": 1, "id_ejemplar": 3, "fecha_limite": "2026-11-15" }
// URL: http://localhost:3000/api/prestamos/2  4-Registrar devolucion / Actualiza (PUT)
//	Body (JSON):json
//    {"fecha_real_devolucion": "2026-11-02"}
// URL: http://localhost:3000/api/prestamos/1  5- Eliminar un prestamo (DELETE):
//


app.listen(PORT, function () {
    console.log(`\nhttp://localhost:3000/api/prestamos\nserver BIBLIOTECA http://localhost:${PORT} en linea...`);
});

// fin - archivo src/index.ts
