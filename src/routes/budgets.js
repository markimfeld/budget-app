import { Router } from "express";

import budgetsController from "../controllers/budgets.js";

import verifyToken from "../middlewares/validate-token.js";

const budgetsRouter = Router();

// GET - http://localhost:3000/api/v1/budgets/
budgetsRouter.get("/", verifyToken, budgetsController.getAll);

// GET - http://localhost:3000/api/v1/budgets/:id
budgetsRouter.get("/:id", verifyToken, budgetsController.getOne);

// POST - http://localhost:3000/api/v1/budgets/
budgetsRouter.post("/", verifyToken, budgetsController.store);

// PUT - http://localhost:3000/api/v1/budgets/:id
budgetsRouter.put("/:id", verifyToken, budgetsController.update);

// DELETE - http://localhost:3000/api/v1/budgets/:id
budgetsRouter.delete("/:id", verifyToken, budgetsController.delete);

export default budgetsRouter;
