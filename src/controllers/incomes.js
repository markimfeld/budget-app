import { incomesService } from "../services/incomes.js";
import { MISSING_FIELDS_REQUIRED, NOT_FOUND } from "../labels/labels.js";

const incomesController = {
  getAll: async (req, res) => {
    const currentMonth = req.query.month
      ? req.query.month
      : new Date().getMonth() + 1;
    const currentYear = req.query.year
      ? req.query.year
      : new Date().getFullYear();

    const createdBy = req.user.id;

    const incomes = await incomesService.getAll({
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
      total: incomes.length,
      data: incomes,
    });
  },
  getOne: async (req, res) => {
    const { id } = req.params;

    const income = await incomesService.getOne({ _id: id });

    if (!income) {
      return res.status(404).json({
        status: 404,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: income,
    });
  },
  store: async (req, res) => {
    if (!req.body.name || !req.body.amount) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    // capturamos el user para guardar en el incomes
    const incomeToStore = { ...req.body };
    incomeToStore.createdBy = req.user.id;
    incomeToStore.updatedBy = req.user.id;

    const incomeStored = await incomesService.store(incomeToStore);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: incomeStored,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const incomeDeleted = await incomesService.delete(id);

    if (!incomeDeleted) {
      return res.status(404).json({
        status: 404,
        isDeleted: false,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: incomeDeleted,
    });
  },
  update: async (req, res) => {
    if (!req.body.name || !req.body.amount) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    const { id } = req.params;

    const oldIncome = await incomesService.getOne({ _id: id });

    if (!oldIncome) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: NOT_FOUND,
      });
    }

    const newIncomeData = { ...oldIncome._doc, ...req.body };

    const incomeUpdated = await incomesService.update(id, newIncomeData);

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: incomeUpdated,
    });
  },
};

export default incomesController;
