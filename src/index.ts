import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes/route.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import librosRouter from "./routes/libros.routes.js";

//importa prestamosRouter from "./routes/prestamosRoute.js"; // Importamos las rutas de préstamos
import prestamosRouter from "./routes/prestamosRoute.js"; // Importamos las rutas de préstamos


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuariosRouter);
app.use("/api/libros", librosRouter);


app.use("/api", route);

// Rutas de prestamos
app.use("/api/prestamos", prestamosRouter);

app.listen(PORT, function () {
    console.log(`server BIBLIOTECA en: http://localhost:${PORT} online`);
});