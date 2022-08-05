import { Router } from "express";

import expensesController from "../controllers/expenses.js";

import verifyToken from "../middlewares/validate-token.js";

const expensesRouter = Router();

// GET - http://localhost:3000/api/v1/budgets/
expensesRouter.get("/", verifyToken, expensesController.getAll);

// GET - http://localhost:3000/api/v1/budgets/:id
expensesRouter.get("/:id", verifyToken, expensesController.getOne);

// POST - http://localhost:3000/api/v1/budgets/
expensesRouter.post("/", verifyToken, expensesController.store);

// PUT - http://localhost:3000/api/v1/budgets/:id
expensesRouter.put("/:id", verifyToken, expensesController.update);

// DELETE - http://localhost:3000/api/v1/budgets/:id
expensesRouter.delete("/:id", verifyToken, expensesController.delete);

export default expensesRouter;
