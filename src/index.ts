import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import autoresRouter from "./routes/autores.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import ejemplaresRouter from "./routes/ejemplares.routes.js";
import route from "./routes/route.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import librosRouter from "./routes/libros.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger_output.json" with { type: "json" }; dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/categorias", categoriasRouter);
app.use("/api/autores", autoresRouter);
app.use("/api", route);
app.use("/api/ejemplares", ejemplaresRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/libros", librosRouter);



app.listen(PORT, function () {
    console.log(`servidor corriendo en: http://localhost:${PORT}`);
});