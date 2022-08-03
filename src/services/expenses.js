import Expense from "../models/expenses.js";

export const expensesService = {
  getAll: (options) => {
    try {
      return Expense.find({ ...options }).populate("budget");
    } catch (error) {}
  },
  getOne: (options) => {
    try {
      return Expense.findOne({ ...options }).populate("budget");
    } catch (error) {
      return error;
    }
  },
  store: (newExpense) => {
    try {
      return Expense.create(newExpense);
    } catch (error) {
      return error;
    }
  },
  delete: (id) => {
    try {
      return Expense.findByIdAndUpdate(
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
  update: (id, newExpenseData) => {
    try {
      newExpenseData.updatedAt = new Date();
      return Expense.updateOne({ _id: id }, { $set: newExpenseData });
    } catch (error) {
      return error;
    }
  },
};
