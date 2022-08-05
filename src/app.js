import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// import routes
import budgetsRouter from "./routes/budgets.js";
import expensesRouter from "./routes/expenses.js";
import usersRouter from "./routes/users.js";

// DB Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.5pqkwyp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(colors.bgCyan("DB Connection OK")))
  .catch((error) => console.log("error db: ", error));

// app instance
const app = express();

// para capturar el body
// json middleware
// app.use(express.json()); -> una opción sin body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("tiny"));

// route middleware
app.use("/api/v1/budgets", budgetsRouter);
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/users", usersRouter);

// app server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(colors.rainbow(`Server is running on port ${PORT}`))
);
