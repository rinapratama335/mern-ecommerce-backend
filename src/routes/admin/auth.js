const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  requireSignIn,
} = require("../../controller/admin/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth");

router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);

module.exports = router;
