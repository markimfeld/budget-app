import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  budget: {
    type: SchemaTypes.ObjectId,
    ref: "budget",
    required: true,
  },
  description: {
    type: String,
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

const Expense = model("expense", expenseSchema);

export default Expense;
