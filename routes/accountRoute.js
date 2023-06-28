const express = require("express")
const router = new express.Router()
const accountcontroller = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountcontroller.buildLogin))

router.get("/register", utilities.handleErrors(accountcontroller.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountcontroller.registerAccount)
  )

module.exports = router