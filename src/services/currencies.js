import Currency from "../models/currencies.js";

export const currencyService = {
  getAll: (options) => {
    try {
      return Currency.find({ ...options }).sort({ createdAt: -1 });
    } catch (error) {
      return error;
    }
  },
  getOne: (options) => {
    try {
      return Currency.findOne({ ...options });
    } catch (error) {
      return error;
    }
  },
  store: (newCurrency) => {
    try {
      return Currency.create(newCurrency);
    } catch (error) {
      return error;
    }
  },
  delete: (id) => {
    try {
      return Currency.findByIdAndUpdate(
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
  update: async (id, newCurrencyData) => {
    try {
      const currency = await Currency.findOne({ _id: id });
      currency.name = newCurrencyData?.name;
      currency.price = newCurrencyData?.price;

      return await currency.save();
    } catch (error) {
      return error;
    }
  },
};
