import { currencyService } from "../services/currencies.js";
import { MISSING_FIELDS_REQUIRED, NOT_FOUND } from "../labels/labels.js";

const currencyController = {
  getAll: async (req, res) => {
    const createdBy = req.user.id;

    const currencies = await currencyService.getAll({
      $expr: {
        $and: [
          { $eq: ["$isDeleted", false] },
          { $eq: ["$createdBy", createdBy] },
        ],
      },
    });

    return res.status(200).json({
      status: 200,
      total: currencies.length,
      data: currencies,
    });
  },
  getOne: async (req, res) => {
    const { id } = req.params;

    const currency = await currencyService.getOne({ _id: id });

    if (!currency) {
      return res.status(404).json({
        status: 404,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: currency,
    });
  },
  store: async (req, res) => {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    const currencyToStore = { ...req.body };
    currencyToStore.createdBy = req.user.id;
    currencyToStore.updatedBy = req.user.id;

    const currencyToStored = await currencyService.store(currencyToStore);

    return res.status(201).json({
      status: 201,
      isStored: true,
      data: currencyToStored,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const currencyDeleted = await currencyService.delete(id);

    if (!currencyDeleted) {
      return res.status(404).json({
        status: 404,
        isDeleted: false,
        message: NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      isDeleted: true,
      data: currencyDeleted,
    });
  },
  update: async (req, res) => {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        status: 400,
        isStored: false,
        message: MISSING_FIELDS_REQUIRED,
      });
    }

    const { id } = req.params;

    const oldCurrency = await currencyService.getOne({ _id: id });

    if (!oldCurrency) {
      return res.status(404).json({
        status: 404,
        isUpdated: false,
        message: NOT_FOUND,
      });
    }

    let newCurrencyData = { ...oldCurrency._doc, ...req.body };

    const currencyUpdated = await currencyService.update(id, newCurrencyData);

    return res.status(200).json({
      status: 200,
      isUpdated: true,
      data: currencyUpdated,
    });
  },
};

export default currencyController;
