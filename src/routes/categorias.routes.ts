import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from "../controllers/categorias.controller.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { validateParams } from "../middlewares/validate-params.middleware.js";
import { categoriaBodySchema, categoriaParamsSchema } from "../schemas/categorias.schema.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", validateParams(categoriaParamsSchema), getCategory);
router.post("/", validateBody(categoriaBodySchema), createCategory);
router.put(
    "/:id",
    validateParams(categoriaParamsSchema),
    validateBody(categoriaBodySchema),
    updateCategory,
);
router.delete("/:id", validateParams(categoriaParamsSchema), deleteCategory);

export default router;
