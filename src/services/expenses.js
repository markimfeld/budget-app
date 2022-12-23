import Expense from "../models/expenses.js";

export const expensesService = {
  getAll: (options) => {
    try {
      return Expense.find({ ...options })
        .populate("budget")
        .sort({ createdAt: -1 });
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
  update: async (id, newExpenseData) => {
    try {
      const expense = await Expense.findOne({ _id: id });
      expense.name = newExpenseData.name;
      expense.amount = newExpenseData.amount;
      expense.description = newExpenseData.description;
      expense.budget = newExpenseData.budget;

      return await expense.save();
    } catch (error) {
      return error;
    }
  },
};
