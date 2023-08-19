import { Router } from "express";

import debtsController from "../controllers/debts.js";

import verifyToken from "../middlewares/validate-token.js";

const debtsRouter = Router();

// GET - http://localhost:3000/api/v1/debts/
debtsRouter.get("/", verifyToken, debtsController.getAll);

// GET - http://localhost:3000/api/v1/debts/:id
debtsRouter.get("/:id", verifyToken, debtsController.getOne);

// POST - http://localhost:3000/api/v1/debts/
debtsRouter.post("/", verifyToken, debtsController.store);

// PUT - http://localhost:3000/api/v1/debts/:id
debtsRouter.put("/:id", verifyToken, debtsController.update);

// PUT - http://localhost:3000/api/v1/debts/
debtsRouter.put("/", verifyToken, debtsController.updateMany);

// DELETE - http://localhost:3000/api/v1/debts/:id
debtsRouter.delete("/:id", verifyToken, debtsController.delete);

export default debtsRouter;
