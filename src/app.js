import express from "express";
import mongoose from "mongoose";
import colors from "colors";

// import routes
import budgetsRouter from "./routes/budgets.js";

// DB Connection
mongoose
  .connect("mongodb://localhost:27017/budgetApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(colors.bgCyan("DB Connection OK")));

// app instance
const app = express();

// middlewares

// json middleware
app.use(express.json());

// route middleware
app.use("/api/v1/budgets", budgetsRouter);

// app server listening

app.listen(3000, () =>
  console.log(colors.rainbow("Server is running on port 3000"))
);
