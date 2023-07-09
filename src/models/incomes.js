import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const incomeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
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

incomeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Income = model("income", incomeSchema);

export default Income;
