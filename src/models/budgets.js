import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const budgetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  expectedAmount: {
    type: Number,
    required: true,
  },
  spentAmount: {
    type: Number,
    default: 0,
  },
  leftAmount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    inmutable: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
  deletedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  updatedBy: {
    type: SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
});

budgetSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Budget = model("budget", budgetSchema);

export default Budget;
