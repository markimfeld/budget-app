import { budgetsService } from "../services/budgets.js";
import { MISSING_FIELDS_REQUIRED, NOT_FOUND } from "../labels/labels.js";

const budgetsController = {
  getAll: async (req, res) => {
    const currentMonth = req.query.month
      ? req.query.month
      : new Date().getMonth() + 1;
    const currentYear = req.query.year
      ? req.query.year
      : new Date().getFullYear();

    const createdBy = req.user.id;

    const budgets = await budgetsService.getAll({
      $expr: {
        $and: [
          { $eq: [{ $year: "$createdAt" }, currentYear] },
          { $eq: [{ $month: "$createdAt" }, currentMonth] },
          { $eq: ["$isDeleted", false] },
          { $eq: ["$createdBy", createdBy] },
        ],
      },
    });

    return res.status(200).json({
      status: 200,
      total: budgets.length,
      data: budgets,
    });
  },
  getOne: async (req, res) => {
    const { id } = req.params;

    const budget = await budgetsService.getOne({ _id: id });

    if (!budget) {
      return res.status(404).json({
        status: 404,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: budget,
    });
  },
  store: async (req, res) => {
    if (!req.body.name || !req.body.expectedAmount) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    // capturamos el user para guardar en el budgets
    const budgetToStore = { ...req.body };
    budgetToStore.createdBy = req.user.id;
    budgetToStore.updatedBy = req.user.id;
    budgetToStore.leftAmount = req.body.expectedAmount;

    if (req.body.spentAmount) {
      budgetToStore.leftAmount = req.body.expectedAmount - req.body.spentAmount;
    }

    const budgetStored = await budgetsService.store(budgetToStore);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: budgetStored,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const budgetDeleted = await budgetsService.delete(id);

    if (!budgetDeleted) {
      return res.status(404).json({
        status: 404,
        isDeleted: false,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: budgetDeleted,
    });
  },
  update: async (req, res) => {
    if (!req.body.name || !req.body.expectedAmount) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    const { id } = req.params;

    const oldBudget = await budgetsService.getOne({ _id: id });

    if (!oldBudget) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: NOT_FOUND,
      });
    }

    const newBudgetData = { ...oldBudget._doc, ...req.body };

    const budgetUpdated = await budgetsService.update(id, newBudgetData);

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: budgetUpdated,
    });
  },
};

export default budgetsController;
