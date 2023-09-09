import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import colors from "colors";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// import routes
import budgetsRouter from "./routes/budgets.js";
import expensesRouter from "./routes/expenses.js";
import usersRouter from "./routes/users.js";
import incomesRouter from "./routes/incomes.js";
import debtsRouter from "./routes/debts.js";
import investmentsRouter from "./routes/investments.js";
import currenciesRouter from "./routes/currencies.js";

// DB Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.5pqkwyp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection OK"))
  .catch((error) => console.log("error db: ", error));

// app instance
const app = express();

app.use(cookieParser());
app.use(
  cors({ origin: ["https://budget-app-rouge.vercel.app"], credentials: true })
);
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const ACCEPTED_ORIGINS = ["https://budget-app-rouge.vercel.app"];

//       if (ACCEPTED_ORIGINS.includes(origin)) {
//         return callback(null, true);
//       }

//       if (!origin) {
//         return callback(null, true);
//       }
//     },
//   })
// );

// para capturar el body
// json middleware
// app.use(express.json()); -> una opción sin body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("tiny"));

// route middleware
app.use("/api/v1/budgets", budgetsRouter);
app.use("/api/v1/incomes", incomesRouter);
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/debts", debtsRouter);
app.use("/api/v1/investments", investmentsRouter);
app.use("/api/v1/currencies", currenciesRouter);

// app server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(colors.rainbow(`Server is running on port ${PORT}`))
);

export default app;
