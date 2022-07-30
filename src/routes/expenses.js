import { Router } from "express";

import expensesController from "../controllers/expenses.js";

const expensesRouter = Router();

// GET - http://localhost:3000/api/v1/budgets/
expensesRouter.get("/", expensesController.getAll);

// GET - http://localhost:3000/api/v1/budgets/:id
expensesRouter.get("/:id", expensesController.getOne);

// POST - http://localhost:3000/api/v1/budgets/
expensesRouter.post("/", expensesController.store);

// PUT - http://localhost:3000/api/v1/budgets/:id
expensesRouter.put("/:id", expensesController.update);

// DELETE - http://localhost:3000/api/v1/budgets/:id
expensesRouter.delete("/:id", expensesController.delete);

export default expensesRouter;
