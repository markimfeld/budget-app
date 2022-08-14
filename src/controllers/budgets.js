import { budgetsService } from "../services/budgets.js";

const budgetsController = {
  getAll: async (req, res) => {
    const budgets = await budgetsService.getAll({});

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
        message: `The budget with ID ${id} is notFound`,
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
        message: "The name and expectedAmount are required",
      });
    }

    // capturamos el user para guardar en el budgets
    const budgetToStore = { ...req.body };
    budgetToStore.createdBy = req.user.id;
    budgetToStore.updatedBy = req.user.id;
    budgetToStore.leftAmount = req.body.expectedAmount;

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
        message: `The budget trying to delete with ID ${id} is notFound`,
      });
    }

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: budgetDeleted,
    });
  },
  update: async (req, res) => {
    const { id } = req.params;

    const oldBudget = await budgetsService.getOne({ _id: id });

    if (!oldBudget) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: `The budget trying to update with ID ${id} is notFound`,
      });
    }

    const newBudgetData = { ...oldBudget._doc, ...req.body };

    // Tests
    // when update expectedAmount then update leftAmount
    // if spentAount is greater than zero then leftAmount = expectedAmount - spentAmount

    // TODO: fix this -> is not working
    // if (
    // oldBudget.expectedAmount !== req.body.expectedAmount &&
    // oldBudget.spentAmount === 0 &&
    // req.body.spentAmount === 0
    // ) {
    newBudgetData.leftAmount = req.body.expectedAmount; // ?? oldBudget.expectedAmount;
    // }

    if (
      oldBudget.spentAmount > 0 &&
      req.body.spentAmount > 0 &&
      req.body.expectedAmount !== undefined &&
      req.body.expectedAmount !== null
    ) {
      newBudgetData.leftAmount =
        req.body.expectedAmount - oldBudget.spentAmount;
      console.log("entro 1");
    }

    if (
      req.body.spentAmount > 0 &&
      req.body.expectedAmount !== undefined &&
      req.body.expectedAmount !== null
    ) {
      newBudgetData.leftAmount = req.body.expectedAmount - req.body.spentAmount;
      console.log("entro 2");
    }

    if (
      req.body.spentAmount > 0 &&
      (req.body.expectedAmount === undefined ||
        req.body.expectedAmount === null)
    ) {
      newBudgetData.leftAmount =
        oldBudget.expectedAmount - req.body.spentAmount;
      console.log("entro 3");
    }

    const budgetUpdated = await budgetsService.update(id, newBudgetData);

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: budgetUpdated,
    });
  },
};

export default budgetsController;
