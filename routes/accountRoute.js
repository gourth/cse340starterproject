const express = require("express")
const router = new express.Router()
const accountcontroller = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const invCont = require("../controllers/invController")

router.get("/register", utilities.handleErrors(accountcontroller.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountcontroller.registerAccount)
  )
  
  
router.get("/login", utilities.handleErrors(accountcontroller.buildLogin))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogingData,
  utilities.handleErrors(accountcontroller.accountLogin)
)

// Get account view
router.get('/', utilities.checkLogin, utilities.handleErrors(accountcontroller.getAccountView))

// Logout
router.get("/logout", utilities.handleErrors(accountcontroller.logoutUser))


// Get account update view
router.get('/edit/:account_id', utilities.checkLogin, utilities.handleErrors(accountcontroller.buildAccountEdit))

// Process updating the account info
router.post("/updateaccount", 
regValidate.updateAcctRules(), 
regValidate.checkRegData, 
utilities.handleErrors(accountcontroller.updateAccount))

// Process updating the password
router.post("/updatepassword", 
regValidate.updatePassRules(),
utilities.handleErrors(accountcontroller.updatePassword))


module.exports = router