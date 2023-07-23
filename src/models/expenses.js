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
    default: () => new Date().toLocaleDateString(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date().toLocaleDateString(),
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

expenseSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Expense = model("expense", expenseSchema);

export default Expense;
