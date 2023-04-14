import { expensesService } from "../services/expenses.js";
import { budgetsService } from "../services/budgets.js";

const expensesController = {
  getAll: async (req, res) => {
    const expenses = await expensesService.getAll({
      isDeleted: false,
    });

    return res.status(200).json({
      status: 200,
      total: expenses.length,
      data: expenses,
    });
  },
  getOne: async (req, res) => {
    const { id } = req.params;

    const expense = await expensesService.getOne({ _id: id });

    if (!expense) {
      return res.status(404).json({
        status: 404,
        message: `The expense with ID ${id} is notFound`,
      });
    }

    return res.status(200).json({
      status: 200,
      data: expense,
    });
  },
  store: async (req, res) => {
    if (!req.body.name || !req.body.amount || !req.body.budget) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: "The name, amount and budget are required",
      });
    }

    const newExpense = await expensesService.store(req.body);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: newExpense,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const expenseToDelete = await expensesService.getOne({ _id: id });

    if (!expenseToDelete) {
      return res.status(404).json({
        status: 404,
        isDeleted: false,
        message: `notFound`,
      });
    }

    const expenseDeleted = await expensesService.delete({ _id: id });

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: expenseDeleted,
    });
  },
  update: async (req, res) => {
    const { id } = req.params;

    const oldExpense = await expensesService.getOne({ _id: id });

    if (!oldExpense) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: `The expense trying to update with ID ${id} is notFound`,
      });
    }

    const newExpenseData = { ...oldExpense._doc, ...req.body };

    const expenseUpdated = await expensesService.update(id, newExpenseData);

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: expenseUpdated,
    });
  },
};

export default expensesController;
