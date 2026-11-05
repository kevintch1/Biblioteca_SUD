import { Router } from "express";
import {
    createAuthor,
    deleteAuthor,
    getAuthor,
    getAuthors,
    updateAuthor,
} from "../controllers/autores.controller.js";

import { autorBodySchema, autorParamsSchema } from "../schemas/autores.schema.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { validateParams } from "../middlewares/validate-params.middleware.js";

const router = Router();

router.get("/", getAuthors);
router.get("/:id", validateParams(autorParamsSchema), getAuthor);
router.post("/", validateBody(autorBodySchema), createAuthor);
router.put(
    "/:id",
    validateParams(autorParamsSchema),
    validateBody(autorBodySchema),
    updateAuthor,
);
router.delete("/:id", validateParams(autorParamsSchema), deleteAuthor);

export default router;
