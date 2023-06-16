import { userService } from "../services/users.js";
import jwt from "jsonwebtoken";

import transporter from "../helpers/mailer.js";

import {
  NOT_FOUND,
  INVALID_CREDENTIALS,
  MISSING_FIELDS_REQUIRED,
  INVALID_PASSWORD_LENGTH,
  DUPLICATE_RECORD,
} from "../labels/labels.js";

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
        message: NOT_FOUND,
      });
    }

    const isValidPassword = await user.isValidPassword(req.body.password);

    if (!isValidPassword) {
      return res.status(404).json({
        status: 404,
        message: INVALID_CREDENTIALS,
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

    const aUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      accessToken: token,
    };

    transporter
      .sendMail({
        from: "Finanzas App sebastianimfeld@gmail.com",
        to: req.body.email,
        subject: "Aviso de inicio de sesión",
        body: "Iniciaste sesión ahora mismo",
      })
      .then((res) => console.log(res));

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
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    if (req.body.password.length < 6) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: INVALID_PASSWORD_LENGTH,
      });
    }

    const alreadyExist = await userService.getOne({ email: req.body.email });

    if (alreadyExist) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: DUPLICATE_RECORD,
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
