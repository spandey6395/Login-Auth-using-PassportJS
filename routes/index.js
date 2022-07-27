const express = require("express");
const router = express.Router();
const passport = require("passport");

const homeController = require("../controllers/home_controller");
const UsersController = require("../controllers/users_controller");

router.get("/", passport.checkAuthentication, homeController.home);
router.use("/users", require("./api/users"));

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/users/login" }),
    UsersController.createSession
  );
  

module.exports = router;
