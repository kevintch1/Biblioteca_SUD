import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import autoresRouter from "./routes/autores.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import route from "./routes/route.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Mantener estas rutas al integrar; son los endpoints de Categorías y Autores.
app.use("/api/categorias", categoriasRouter);
app.use("/api/autores", autoresRouter);
app.use("/api", route);

app.listen(PORT, function () {
    console.log(`servidor corriendo en: http://localhost:${PORT}`);
});
