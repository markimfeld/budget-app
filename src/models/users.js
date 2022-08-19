import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    inmutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  deletedAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  const jumps = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, jumps);

  this.password = hash;

  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = model("user", userSchema);

export default User;
