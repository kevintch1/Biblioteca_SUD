// archivo src/routes/route.ts

import { Router } from "express";
import { getLibroAutor, createLibroAutor, deleteLibroAutor } from "../controllers/controller.js";

const router = Router();

router.get("/libro-autor", getLibroAutor);
router.post("/libro-autor", createLibroAutor);
router.delete("/libro-autor/:id_libro/:id_autor", deleteLibroAutor);

export default router;

// fin - archivo src/routes/route.ts
