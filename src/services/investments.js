import Investment from "../models/investments.js";

export const investmentService = {
  getAll: (options) => {
    try {
      return Investment.find({ ...options }).sort({ createdAt: -1 });
    } catch (error) {
      return error;
    }
  },
  getOne: (options) => {
    try {
      return Investment.findOne({ ...options });
    } catch (error) {
      return error;
    }
  },
  store: (newInvestment) => {
    try {
      return Investment.create(newInvestment);
    } catch (error) {
      return error;
    }
  },
  delete: (id) => {
    try {
      return Investment.findByIdAndUpdate(
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
  update: async (id, newInvestmentData) => {
    try {
      const investment = await Investment.findOne({ _id: id });
      investment.name = newInvestmentData?.name;
      investment.amount = newInvestmentData?.amount;

      return await investment.save();
    } catch (error) {
      return error;
    }
  },
};
