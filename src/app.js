import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();

// import routes
import budgetsRouter from "./routes/budgets.js";
import expensesRouter from "./routes/expenses.js";

// DB Connection
mongoose
  .connect("mongodb://localhost:27017/budgetApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(colors.bgCyan("DB Connection OK")));

// app instance
const app = express();

// para capturar el body
// json middleware
// app.use(express.json()); -> una opción sin body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// route middleware
app.use("/api/v1/budgets", budgetsRouter);
app.use("/api/v1/expenses", expensesRouter);

// app server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(colors.rainbow(`Server is running on port ${PORT}`))
);
