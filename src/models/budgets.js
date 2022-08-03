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
});

budgetSchema.pre("save", function (next) {
  this.leftAmount = this.expectedAmount;
  next();
});

const Budget = model("budget", budgetSchema);

export default Budget;
