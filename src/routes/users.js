import { Router } from "express";

import usersController from "../controllers/users.js";

const usersRouter = Router();

usersRouter.post("/login", usersController.login);
usersRouter.post("/register", usersController.store);

export default usersRouter;
