import Budget from "../models/budgets.js";

export const budgetsService = {
  getAll: (options) => {
    try {
      return Budget.find({ ...options });
    } catch (error) {
      return error;
    }
  },
  getOne: (options) => {
    try {
      return Budget.findOne({ ...options });
    } catch (error) {
      return error;
    }
  },
  store: (newBudget) => {
    try {
      return Budget.create(newBudget);
    } catch (error) {
      return error;
    }
  },
  delete: (id) => {
    try {
      return Budget.findByIdAndUpdate(
        id,
        {
          deletedAt: new Date(),
        },
        { new: true }
      );
    } catch (error) {
      return error;
    }
  },
  update: (id, newBudgetData) => {
    try {
      return Budget.updateOne({ _id: id }, { $set: newBudgetData });
    } catch (error) {
      return error;
    }
  },
};
