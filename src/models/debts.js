import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const debtSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  initialAmountInstallments: {
    type: Number,
    required: true,
  },
  leftAmountInstallments: {
    type: Number,
    required: true,
  },
  installmentAmount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    inmutable: true,
    required: true,
    // default: () => new Date(),
  },
  endDate: {
    type: Date,
    inmutable: true,
    required: true,
    // default: () => new Date(),
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
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

debtSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Debt = model("debt", debtSchema);

export default Debt;
