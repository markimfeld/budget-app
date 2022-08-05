import User from "../models/users.js";

export const userService = {
  getOne: (credentials) => {
    try {
      return User.findOne({ ...credentials });
    } catch (error) {
      return error;
    }
  },
  store: (newUser) => {
    try {
      return User.create(newUser);
    } catch (error) {
      return error;
    }
  },
};
