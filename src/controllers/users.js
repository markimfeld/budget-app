import { userService } from "../services/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersController = {
  getAll: async (req, res) => {
    const users = await userService.getAll({});

    return res.status(200).json({
      status: 200,
      total: users.length,
      data: users,
    });
  },
  login: async (req, res) => {
    const user = await userService.getOne({ email: req.body.email });

    if (user === undefined || user === null) {
      return res.status(404).json({
        status: 404,
        message: "Usuario no existe",
      });
    }

    const isValidPassword = await user.isValidPassword(req.body.password);

    if (!isValidPassword) {
      return res.status(404).json({
        status: 404,
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
      { expiresIn: "2h" }
    );

    const aUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken: token,
    };

    return res.status(200).json({
      status: 200,
      user: aUser,
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
        message: `El nombre, apellido, usuario, email y constraseña son requeridos`,
      });
    }

    if (req.body.password.length < 6) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: `La contraseña debe ser mayor a 6 caracteres`,
      });
    }

    const alreadyExist = await userService.getOne({ email: req.body.email });

    if (alreadyExist) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: `Ya existe un usuario con ese email`,
      });
    }

    const storedUser = await userService.store({ ...req.body });

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: storedUser,
    });
  },
};

export default usersController;
