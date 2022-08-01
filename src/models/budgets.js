import mongoose from "mongoose";
const { Schema, model } = mongoose;

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
});

const Budget = model("budget", budgetSchema);

export default Budget;
