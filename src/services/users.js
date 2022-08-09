import User from "../models/users.js";

export const userService = {
  getAll: (options) => {
    try {
      return User.find({ ...options });
    } catch (error) {
      return error;
    }
  },
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
