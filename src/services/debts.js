import Debt from "../models/debts.js";

export const debtService = {
  getAll: (options) => {
    try {
      return Debt.find({ ...options });
    } catch (error) {
      return error;
    }
  },
  getOne: (options) => {
    try {
      return Debt.findOne({ ...options });
    } catch (error) {
      return error;
    }
  },
  store: (newDebt) => {
    try {
      return Debt.create(newDebt);
    } catch (error) {
      return error;
    }
  },
  delete: (id) => {
    try {
      return Debt.findByIdAndUpdate(
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
  update: async (id, newDebtData) => {
    try {
      const debt = await Debt.findOne({ _id: id });
      debt.name = newDebtData?.name;
      debt.initialAmountInstallments = newDebtData?.initialAmountInstallments;
      debt.leftAmountInstallments = newDebtData?.leftAmountInstallments;
      debt.installmentAmount = newDebtData?.installmentAmount;
      debt.startDate = newDebtData?.startDate;
      debt.endDate = newDebtData?.endDate;
      debt.status = newDebtData?.status;

      return await debt.save();
    } catch (error) {
      return error;
    }
  },
};
