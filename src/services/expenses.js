import Expense from "../models/expenses.js";

export const expensesService = {
  getAll: (options) => {
    try {
      return Expense.find({ ...options });
    } catch (error) {}
  },
  getOne: (options) => {
    try {
      return Expense.findOne({ ...options });
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
        },
        { new: true }
      );
    } catch (error) {
      return error;
    }
  },
  update: (id, newExpenseData) => {
    try {
      return Expense.updateOne({ _id: id }, { $set: newExpenseData });
    } catch (error) {
      return error;
    }
  },
};
