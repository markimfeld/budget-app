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
          isDeleted: true,
        },
        { new: true }
      );
    } catch (error) {
      return error;
    }
  },
  update: async (id, newBudgetData) => {
    try {
      const budget = await Budget.findOne({ _id: id });
      budget.name = newBudgetData.name;
      budget.expectedAmount = newBudgetData.expectedAmount;
      budget.leftAmount = newBudgetData.leftAmount;
      budget.spentAmount = newBudgetData.spentAmount;

      return await budget.save();
    } catch (error) {
      return error;
    }
  },
};
