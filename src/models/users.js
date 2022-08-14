import { mongoose } from "mongoose";
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

userSchema.pre("save", function (next) {
  console.log("saving");
  next();
});

const User = model("user", userSchema);

export default User;
