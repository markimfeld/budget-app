import { Router } from "express";

import usersController from "../controllers/users.js";

import verifyToken from "../middlewares/validate-token.js";

const usersRouter = Router();

usersRouter.get("/", verifyToken, usersController.getAll);
usersRouter.post("/login", usersController.login);
usersRouter.post("/register", usersController.store);

export default usersRouter;
