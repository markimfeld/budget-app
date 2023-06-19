import jwt from "jsonwebtoken";

import { ACCESS_DENIED, INVALID_TOKEN } from "../labels/labels.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: ACCESS_DENIED,
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: INVALID_TOKEN,
    });
  }
};

export default verifyToken;
