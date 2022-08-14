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
  store: async (newUser) => {
    try {
      const anUser = new User();
      anUser.firstName = newUser.firstName;
      anUser.lastName = newUser.lastName;
      anUser.username = newUser.username;
      anUser.password = newUser.password;
      anUser.email = newUser.email;

      return await anUser.save();
    } catch (error) {
      return error;
    }
  },
};
