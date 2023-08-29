import { investmentService } from "../services/investments.js";
import { MISSING_FIELDS_REQUIRED, NOT_FOUND } from "../labels/labels.js";

const investmentsController = {
  getAll: async (req, res) => {
    const currentMonth = req.query.month
      ? req.query.month
      : new Date().getMonth() + 1;
    const currentYear = req.query.year
      ? req.query.year
      : new Date().getFullYear();

    const createdBy = req.user.id;

    const investments = await investmentService.getAll({
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
      total: investments.length,
      data: investments,
    });
  },
  getOne: async (req, res) => {
    const { id } = req.params;

    const investment = await investmentService.getOne({ _id: id });

    if (!investment) {
      return res.status(404).json({
        status: 404,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: investment,
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

    const investmentToStore = { ...req.body };
    investmentToStore.createdBy = req.user.id;
    investmentToStore.updatedBy = req.user.id;

    if (investmentToStore.leftAmountInstallments === 0) {
      investmentToStore.isPaid = true;
    }

    const investmentToStored = await investmentService.store(investmentToStore);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: investmentToStored,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const investmentDeleted = await investmentService.delete(id);

    if (!investmentDeleted) {
      return res.status(404).json({
        status: 404,
        isDeleted: false,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: investmentDeleted,
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

    const oldInvestment = await investmentService.getOne({ _id: id });

    if (!oldInvestment) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: NOT_FOUND,
      });
    }

    let newInvestmentData = { ...oldInvestment._doc, ...req.body };

    if (newInvestmentData.leftAmountInstallments === 0) {
      newInvestmentData.isPaid = true;
    } else {
      newInvestmentData.isPaid = false;
    }

    const investmentUpdated = await investmentService.update(
      id,
      newInvestmentData
    );

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: investmentUpdated,
    });
  },
};

export default investmentsController;
