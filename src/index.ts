import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ejemplaresRouter from "./routes/ejemplares.routes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/ejemplares", ejemplaresRouter);


app.listen(PORT, function () {
    console.log(`servidor corriendo en: http://localhost:${PORT}`);
});
