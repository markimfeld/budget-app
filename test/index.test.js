import { expect } from "chai";
import Sinon from "sinon";
import usersController from "../src/controllers/users.js";
import User from "../src/models/users.js";
import { userService } from "../src/services/users.js";

describe("User Service Unit Tests", function () {
  describe("Save User functionality", function () {
    it("should insert a user", async function (done) {
      const firstName = "John";
      const lastName = "Doe";
      const username = "jdoe";
      const password = "jdoe123";
      const email = "jdoe@test.com";

      Sinon.stub(User.prototype, "save").returns({
        firstName,
        lastName,
        username,
        password,
        email,
      });

      const storedUser = await usersController.store({
        firstName,
        lastName,
        username,
        password,
        email,
      });

      // const storedUser = await userService.store({
      // firstName,
      // lastName,
      // username,
      // password,
      // email,
      // });

      expect(storedUser.firstName).to.equal(firstName);
      expect(storedUser.lastName).to.equal(lastName);
      expect(storedUser.username).to.equal(username);
      expect(storedUser.password).to.equal(password);
      expect(storedUser.email).to.equal(email);

      // done();
    });
  });
});
