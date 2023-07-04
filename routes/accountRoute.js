const express = require("express")
const router = new express.Router()
const accountcontroller = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

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

//Get account view
router.get('/', utilities.checkLogin, utilities.handleErrors(accountcontroller.getAccountView))




// router.post(
//     "/login",
//     regValidate.loginRules(),
//     regValidate.checkLogingData,
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

module.exports = router