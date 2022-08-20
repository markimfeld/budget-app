import Budget from "../src/models/budgets.js";

// Require the dev-dependencies
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/app.js";
const should = chai.should();

const EMAIL = "sebastianimfeld@gmail.com";
const PASSWORD = "mimfeld";
const BAD_BUDGET_ID = "42fad1a642fa54f064e02967";

chai.use(chaiHttp);
// our parent block
describe("Budgets", () => {
  beforeEach((done) => {
    Budget.deleteMany({}, (err) => {
      done();
    });
  });
  after((done) => {
    Budget.deleteMany({}, (err) => {
      done();
    });
  });

  describe("/GET budgets empty", () => {
    it("it should GET all the budgets", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];
          chai
            .request(server)
            .get("/api/v1/budgets")
            .set("auth-token", token)
            .end((err, res) => {
              res.body.status.should.be.eql(200);
              res.body.data.should.be.a("array");
              res.body.total.should.be.eql(0);
              done();
            });
        });
    });
    it("it should GET all the budgets", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let oneBudget = new Budget({
            name: "Comida",
            expectedAmount: 200,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          let anotherBudget = new Budget({
            name: "Farmacia",
            expectedAmount: 400,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          Budget.create(oneBudget, anotherBudget).then((res) => {
            chai
              .request(server)
              .get("/api/v1/budgets")
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

  describe("/POST budget", () => {
    it("it should POST a budget", (done) => {
      let budget = {
        name: "Comida",
        expectedAmount: 15000,
      };
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];
          chai
            .request(server)
            .post("/api/v1/budgets")
            .set("auth-token", token)
            .send(budget)
            .end((err, res) => {
              res.body.status.should.be.eql(201);
              res.body.isStored.should.be.eql(true);
              res.body.data.should.be.a("object");
              res.body.data.should.have.property("name");
              res.body.data.should.have.property("expectedAmount");
              res.body.data.should.have.property("spentAmount");
              res.body.data.should.have.property("leftAmount");
              res.body.data.should.not.have.property("deletedAt");
              res.body.data.should.have.property("isDeleted");
              res.body.data.should.have.property("isDeleted").eql(false);
              res.body.data.should.have.property("name").eql("Comida");
              res.body.data.should.have.property("expectedAmount").eql(15000);
              res.body.data.should.have.property("spentAmount").eql(0);
              res.body.data.should.have.property("leftAmount").eql(15000);
              done();
            });
        });
    });
    it("it should not POST a budget if there are missing fields", (done) => {
      let budget = {
        name: "Comida",
      };
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];
          chai
            .request(server)
            .post("/api/v1/budgets")
            .set("auth-token", token)
            .send(budget)
            .end((err, res) => {
              res.body.status.should.be.eql(400);
              res.body.isStored.should.be.eql(false);
              res.body.message.should.be.eql(
                "The name and expectedAmount are required"
              );
              done();
            });
        });
    });
  });

  describe("/GET/:id budget", () => {
    it("it should GET a budget by the given id", (done) => {
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
            chai
              .request(server)
              .get(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send(budget)
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(12000);
                done();
              });
          });
        });
    });
  });

  describe("/PUT/:id budget", () => {
    it("it should UPDATE a budget by the given id", (done) => {
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
            chai
              .request(server)
              .put(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send({ expectedAmount: 5000 })
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("spentAmount");
                res.body.data.should.have.property("leftAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(5000);
                res.body.data.should.have.property("leftAmount").eql(5000);
                res.body.data.should.have.property("spentAmount").eql(0);
                done();
              });
          });
        });
    });
    it("it should UPDATE expectedAmount and calculate other fields", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 12000,
            spentAmount: 2000,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            chai
              .request(server)
              .put(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send({ expectedAmount: 5000 })
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("spentAmount");
                res.body.data.should.have.property("leftAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(5000);
                res.body.data.should.have.property("leftAmount").eql(3000);
                res.body.data.should.have.property("spentAmount").eql(2000);
                done();
              });
          });
        });
    });
    it("it should calculate leftAmount field when update spentAmount", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 100,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            chai
              .request(server)
              .put(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send({ spentAmount: 10 })
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("spentAmount");
                res.body.data.should.have.property("leftAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(100);
                res.body.data.should.have.property("leftAmount").eql(90);
                res.body.data.should.have.property("spentAmount").eql(10);
                done();
              });
          });
        });
    });
    it("it should calculate leftAmount field when update spentAmount to zero", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 100,
            spentAmount: 10,
            leftAmount: 90,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            chai
              .request(server)
              .put(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send({ spentAmount: 0 })
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("spentAmount");
                res.body.data.should.have.property("leftAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(100);
                res.body.data.should.have.property("leftAmount").eql(100);
                res.body.data.should.have.property("spentAmount").eql(0);
                done();
              });
          });
        });
    });
    it("it should calculate leftAmount field when update spentAmount and expectedAmount", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 100,
            spentAmount: 10,
            leftAmount: 90,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            chai
              .request(server)
              .put(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send({ expectedAmount: 200, spentAmount: 20 })
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("spentAmount");
                res.body.data.should.have.property("leftAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(200);
                res.body.data.should.have.property("leftAmount").eql(180);
                res.body.data.should.have.property("spentAmount").eql(20);
                done();
              });
          });
        });
    });
    it("it should calculate leftAmount field when update spentAmount to zero and expectedAmount", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send({ email: EMAIL, password: PASSWORD })
        .end((err, res) => {
          let token = res.header["auth-token"];

          let aBudget = new Budget({
            name: "Extras",
            expectedAmount: 100,
            spentAmount: 10,
            leftAmount: 90,
            createdBy: res.body.id,
            updatedBy: res.body.id,
          });

          aBudget.save((err, budget) => {
            chai
              .request(server)
              .put(`/api/v1/budgets/${budget.id}`)
              .set("auth-token", token)
              .send({ expectedAmount: 200, spentAmount: 0 })
              .end((err, res) => {
                res.body.status.should.be.eql(200);
                res.body.should.be.a("object");
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("expectedAmount");
                res.body.data.should.have.property("spentAmount");
                res.body.data.should.have.property("leftAmount");
                res.body.data.should.have.property("name").eql("Extras");
                res.body.data.should.have.property("expectedAmount").eql(200);
                res.body.data.should.have.property("leftAmount").eql(200);
                res.body.data.should.have.property("spentAmount").eql(0);
                done();
              });
          });
        });
    });
    it("it should not UPDATE a budget by the given id if it not exists", (done) => {
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
            chai
              .request(server)
              .put(`/api/v1/budgets/${BAD_BUDGET_ID}`)
              .set("auth-token", token)
              .send({ expectedAmount: 5000 })
              .end((err, res) => {
                res.body.status.should.be.eql(404);
                res.body.isUpdated.should.be.eql(false);
                res.body.message.should.be.eql("Not found");
                done();
              });
          });
        });
    });
  });

  describe("/DELETE/:id budget soft delete", () => {
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
            chai
              .request(server)
              .delete(`/api/v1/budgets/${aBudget.id}`)
              .set("auth-token", token)
              .send(aBudget)
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
            chai
              .request(server)
              .delete(`/api/v1/budgets/${BAD_BUDGET_ID}`)
              .set("auth-token", token)
              .send(aBudget)
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
