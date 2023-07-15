import Income from "../models/incomes.js";

export const incomesService = {
  getAll: (options) => {
    try {
      return Income.find({ ...options });
    } catch (error) {
      return error;
    }
  },
  getOne: (options) => {
    try {
      return Income.findOne({ ...options });
    } catch (error) {
      return error;
    }
  },
  store: (newIncome) => {
    try {
      return Income.create(newIncome);
    } catch (error) {
      return error;
    }
  },
  delete: (id) => {
    try {
      return Income.findByIdAndUpdate(
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
  update: async (id, newIncomeData) => {
    try {
      const income = await Income.findOne({ _id: id });
      income.name = newIncomeData?.name;
      income.amount = newIncomeData?.amount;

      return await income.save();
    } catch (error) {
      return error;
    }
  },
};
