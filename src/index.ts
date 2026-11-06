// src/index.ts
import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
// import 'dotenv/config'; // Debe estar en primera línea del archivo index.ts

import swaggerUi from "swagger-ui-express"; // Importar Swagger UI
import { swaggerSpec } from "./config/swagger.js"; // Importar configuración

import route from "./routes/route.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import librosRouter from "./routes/libros.routes.js";
import ejemplaresRouter from "./routes/ejemplares.routes.js";

import prestamosRouter from "./routes/prestamosRoute.js"; // Importamos las rutas de préstamos
import { errorHandler } from './middlewares/errorHandler.js';

// dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Montar Swagger UI en /api/docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Capas de enrutamiento
app.use("/api/usuarios",   usuariosRouter);
app.use("/api/libros",     librosRouter);
app.use("/api/ejemplares", ejemplaresRouter);
app.use('/api/prestamos',  prestamosRouter); // Rutas de prestamos, Vinculación limpia de la ruta distribuida
app.use("/api", route);

// CONTROLADOR DE ERRORES GLOBAL - DEBE IR SIEMPRE AL FINAL
app.use(errorHandler);

app.listen(PORT, function () {
    console.log(`server BIBLIOTECA en: http://localhost:${PORT} online`);
});
// fin - src/index.ts
