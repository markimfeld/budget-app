import { Router } from "express";

import incomesController from "../controllers/incomes.js";

import verifyToken from "../middlewares/validate-token.js";

const incomesRouter = Router();

// GET - http://localhost:3000/api/v1/incomes/
incomesRouter.get("/", verifyToken, incomesController.getAll);

// GET - http://localhost:3000/api/v1/incomes/:id
incomesRouter.get("/:id", verifyToken, incomesController.getOne);

// POST - http://localhost:3000/api/v1/incomes/
incomesRouter.post("/", verifyToken, incomesController.store);

// PUT - http://localhost:3000/api/v1/incomes/:id
incomesRouter.put("/:id", verifyToken, incomesController.update);

// DELETE - http://localhost:3000/api/v1/incomes/:id
incomesRouter.delete("/:id", verifyToken, incomesController.delete);

export default incomesRouter;
