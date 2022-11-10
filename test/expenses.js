import Expense from "../src/models/expenses.js";
import Budget from "../src/models/budgets.js";

// Require the dev-dependencies
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/app.js";
const should = chai.should();

const EMAIL = "sebastianimfeld@gmail.com";
const PASSWORD = "mimfeld";
const BAD_EXPENSE_ID = "42fad1a642fa54f064e02967";

chai.use(chaiHttp);

// our parent block
describe("Expenses", () => {
  beforeEach((done) => {
    Expense.deleteMany({}, (err) => {});
    Budget.deleteMany({}, (err) => {});
    done();
  });
  after((done) => {
    Expense.deleteMany({}, (err) => {});
    Budget.deleteMany({}, (err) => {});
    done();
  });

  describe("/GET expenses empty", () => {
    it("it should GET all the expenses", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];
          chai
            .request(server)
            .get("/api/v1/expenses")
            .set("auth-token", token)
            .end((err, res) => {
              res.body.status.should.be.eql(200);
              res.body.data.should.be.a("array");
              res.body.total.should.be.eql(0);
              done();
            });
        });
    });
    it("it should GET all the expenses", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let oneBudget = new Budget({
            name: "Comida",
            expectedAmount: 10000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          oneBudget.save((err, budget) => {
            chai
              .request(server)
              .get("/api/v1/budgets")
              .set("auth-token", token)
              .end((err, res) => {
                let anExpense = new Expense({
                  name: "Pollo",
                  amount: 4500,
                  budget: budget.id,
                });

                let anotherExpense = new Expense({
                  name: "Pepsi",
                  amount: 230,
                  budget: budget.id,
                });

                Expense.create(anExpense, anotherExpense).then((res) => {
                  chai
                    .request(server)
                    .get("/api/v1/expenses")
                    .set("auth-token", token)
                    .end((err, res) => {
                      res.body.status.should.be.eql(200);
                      res.body.data.should.be.a("array");
                      res.body.total.should.be.eql(2);
                      done();
                    });
                });
              });
          });
        });
    });
  });

  describe("/POST expenses", () => {
    it("it should POST an expense", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let oneBudget = new Budget({
            name: "Comida",
            expectedAmount: 10000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          oneBudget.save((err, budget) => {
            let anExpense = new Expense({
              name: "Pollo",
              amount: 4500,
              budget: budget.id,
            });
            chai
              .request(server)
              .post("/api/v1/expenses")
              .set("auth-token", token)
              .send(anExpense)
              .end((err, res) => {
                res.body.status.should.be.eql(201);
                res.body.isStored.should.be.eql(true);
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("amount");
                res.body.data.should.have.property("budget");
                res.body.data.should.have.property("name").eql("Pollo");
                res.body.data.should.have.property("amount").eql(4500);
                res.body.data.should.have.property("budget").eql(oneBudget.id);
                done();
              });
          });
        });
    });
    it("it should not POST an expense if there are missing fields", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let oneBudget = new Budget({
            name: "Comida",
            expectedAmount: 10000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          oneBudget.save((err, budget) => {
            let anExpense = new Expense({
              name: "Pollo",
              budget: budget.id,
            });
            chai
              .request(server)
              .post("/api/v1/expenses")
              .set("auth-token", token)
              .send(anExpense)
              .end((err, res) => {
                res.body.status.should.be.eql(400);
                res.body.isStored.should.be.eql(false);
                res.body.message.should.be.eql(
                  "The name, amount and budget are required"
                );
                done();
              });
          });
        });
    });
  });

  describe("/PUT expense", () => {
    it("it should UPDATE an expense", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let oneBudget = new Budget({
            name: "Comida",
            expectedAmount: 10000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          oneBudget.save((err, budget) => {
            let anExpense = new Expense({
              name: "Pollo",
              amount: 4500,
              budget: budget.id,
            });

            anExpense.save((err, expense) => {
              chai
                .request(server)
                .put(`/api/v1/expenses/${expense.id}`)
                .set("auth-token", token)
                .send({ amount: 300 })
                .end((err, res) => {
                  res.body.status.should.be.eql(200);
                  res.body.isUpdated.should.be.eql(true);
                  res.body.data.should.be.a("object");
                  res.body.data.should.have.property("name");
                  res.body.data.should.have.property("amount");
                  res.body.data.should.have.property("budget");
                  res.body.data.should.have.property("name").eql("Pollo");
                  res.body.data.should.have.property("amount").eql(300);
                  res.body.data.budget._id.should.be.eql(budget.id);
                  done();
                });
            });
          });
        });
    });
  });

  describe("/DELETE/:id expense soft delete", () => {
    it("it should DELETE a budget setting deletedAt field", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];
          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 12000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            let anExpense = new Expense({
              name: "Pollo",
              amount: 4500,
              budget: budget.id,
            });

            anExpense.save((err, expense) => {
              chai
                .request(server)
                .delete(`/api/v1/expenses/${expense.id}`)
                .set("auth-token", token)
                .send(anExpense)
                .end((err, res) => {
                  res.body.status.should.be.eql(200);
                  res.body.isDeleted.should.be.eql(true);
                  res.body.data.should.be.a("object");
                  res.body.data.should.have.property("deletedAt");
                  res.body.data.should.have.property("isDeleted");
                  res.body.data.should.have.property("isDeleted").eql(true);
                  done();
                });
            });
          });
        });
    });

    it("it should not DELETE a budget if it is not found", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];
          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 12000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            let anExpense = new Expense({
              name: "Pollo",
              amount: 4500,
              budget: budget.id,
            });

            anExpense.save((err, expense) => {
              chai
                .request(server)
                .delete(`/api/v1/expenses/${BAD_EXPENSE_ID}`)
                .set("auth-token", token)
                .send(anExpense)
                .end((err, res) => {
                  res.body.status.should.be.eql(404);
                  res.body.isDeleted.should.be.eql(false);
                  res.body.message.should.be.eql("notFound");
                  done();
                });
            });
          });
        });
    });
  });
});
