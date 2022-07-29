import { Router } from "express";

import budgetsController from "../controllers/budgets.js";

const budgetsRouter = Router();

// GET - http://localhost:3000/api/v1/budgets/
budgetsRouter.get("/", budgetsController.getAll);

// GET - http://localhost:3000/api/v1/budgets/:id
budgetsRouter.get("/:id", budgetsController.getOne);

// POST - http://localhost:3000/api/v1/budgets/
budgetsRouter.post("/", budgetsController.store);

// PUT - http://localhost:3000/api/v1/budgets/:id
budgetsRouter.put("/:id", budgetsController.update);

// DELETE - http://localhost:3000/api/v1/budgets/:id
budgetsRouter.delete("/:id", budgetsController.delete);

export default budgetsRouter;
