import { Router } from "express";

import currenciesController from "../controllers/currencies.js";

import verifyToken from "../middlewares/validate-token.js";

const currenciesRouter = Router();

// GET - http://localhost:3000/api/v1/currencies/
currenciesRouter.get("/", verifyToken, currenciesController.getAll);

// GET - http://localhost:3000/api/v1/currencies/:id
currenciesRouter.get("/:id", verifyToken, currenciesController.getOne);

// POST - http://localhost:3000/api/v1/currencies/
currenciesRouter.post("/", verifyToken, currenciesController.store);

// PUT - http://localhost:3000/api/v1/currencies/:id
currenciesRouter.put("/:id", verifyToken, currenciesController.update);

// DELETE - http://localhost:3000/api/v1/currencies/:id
currenciesRouter.delete("/:id", verifyToken, currenciesController.delete);

export default currenciesRouter;
