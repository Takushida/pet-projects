const express = require("express");
const router = express.Router();
const Yup = require("yup");
const validateForm = require("../controllers/validateForm");

const authController = require("../controllers/authController");
const { rateLimiter } = require("../controllers/rateLimiter");

router
  .route("/login")
  .get(authController.handleLogin)
  .post(validateForm, rateLimiter, authController.handleAttemptLogin);

router
  .route("/register")
  .post(validateForm, rateLimiter, authController.handleRegister);

module.exports = router;
