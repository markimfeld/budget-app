import { Router } from "express";

import usersController from "../controllers/users.js";

import verifyToken from "../middlewares/validate-token.js";

const usersRouter = Router();

usersRouter.get("/", verifyToken, usersController.getAll);
usersRouter.post("/profile", verifyToken, usersController.getOne);
usersRouter.put("/profile/:id", verifyToken, usersController.update);
usersRouter.post("/login", usersController.login);
usersRouter.post("/register", usersController.store);
usersRouter.put("/recovery-password", usersController.recoverPassword);
usersRouter.put("/new-password", usersController.newPassword);

export default usersRouter;
