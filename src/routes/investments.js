import { Router } from "express";

import investmentsController from "../controllers/investments.js";

import verifyToken from "../middlewares/validate-token.js";

const investmentsRouter = Router();

// GET - http://localhost:3000/api/v1/investments/
investmentsRouter.get("/", verifyToken, investmentsController.getAll);

// GET - http://localhost:3000/api/v1/investments/:id
investmentsRouter.get("/:id", verifyToken, investmentsController.getOne);

// POST - http://localhost:3000/api/v1/investments/
investmentsRouter.post("/", verifyToken, investmentsController.store);

// PUT - http://localhost:3000/api/v1/investments/:id
investmentsRouter.put("/:id", verifyToken, investmentsController.update);

// DELETE - http://localhost:3000/api/v1/investments/:id
investmentsRouter.delete("/:id", verifyToken, investmentsController.delete);

export default investmentsRouter;
