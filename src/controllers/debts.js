import { debtService } from "../services/debts.js";
import { MISSING_FIELDS_REQUIRED, NOT_FOUND } from "../labels/labels.js";

const debtsController = {
  getAll: async (req, res) => {
    const currentMonth = req.query.month
      ? req.query.month
      : new Date().getMonth() + 1;
    const currentYear = req.query.year
      ? req.query.year
      : new Date().getFullYear();

    const createdBy = req.user.id;

    const debts = await debtService.getAll({
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
      total: debts.length,
      data: debts,
    });
  },
  getOne: async (req, res) => {
    const { id } = req.params;

    const debt = await debtService.getOne({ _id: id });

    if (!debt) {
      return res.status(404).json({
        status: 404,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: debt,
    });
  },
  store: async (req, res) => {
    if (
      !req.body.name ||
      !req.body.initialAmountInstallments ||
      (!req.body.leftAmountInstallments &&
        req.body.leftAmountInstallments !== 0) ||
      !req.body.installmentAmount ||
      !req.body.startDate ||
      !req.body.endDate
    ) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    const debtToStore = { ...req.body };
    debtToStore.createdBy = req.user.id;
    debtToStore.updatedBy = req.user.id;

    if (debtToStore.leftAmountInstallments === 0) {
      debtToStore.status = true;
    }

    const debtToStored = await debtService.store(debtToStore);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: debtToStored,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const debtDeleted = await debtService.delete(id);

    if (!debtDeleted) {
      return res.status(404).json({
        status: 404,
        isDeleted: false,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: debtDeleted,
    });
  },
  update: async (req, res) => {
    if (
      !req.body.name ||
      !req.body.initialAmountInstallments ||
      (!req.body.leftAmountInstallments &&
        req.body.leftAmountInstallments !== 0) ||
      !req.body.installmentAmount ||
      !req.body.startDate ||
      !req.body.endDate
    ) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    const { id } = req.params;

    const oldDebt = await debtService.getOne({ _id: id });

    if (!oldDebt) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: NOT_FOUND,
      });
    }

    let newDebtData = { ...oldDebt._doc, ...req.body };
    console.log(newDebtData);

    if (newDebtData.leftAmountInstallments === 0) {
      newDebtData.status = true;
    } else {
      newDebtData.status = false;
    }

    const debtUpdated = await debtService.update(id, newDebtData);

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: debtUpdated,
    });
  },
};

export default debtsController;
