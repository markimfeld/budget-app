import { userService } from "../services/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersController = {
  login: async (req, res) => {
    const user = await userService.getOne({ email: req.body.email });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        status: 401,
        message: "Credenciales inválidas",
      });
    }

    // dos partes: payload y el secret token
    // aca generamos el token
    const token = jwt.sign(
      {
        name: user.firstName + " " + user.lastName,
        id: user._id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).header("auth-token", token).json({
      status: 200,
      message: "Welcome",
    });
  },
  store: async (req, res) => {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email
    ) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: `The firstName, lastName, username, password and email are required`,
      });
    }

    const saltos = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, saltos);

    const newUser = { ...req.body };
    newUser.password = password;

    const storedUser = await userService.store(newUser);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: storedUser,
    });
  },
};

export default usersController;
