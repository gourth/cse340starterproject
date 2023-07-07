const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Deliver login view
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      const capitalizedFirstname = account_firstname.charAt(0).toUpperCase() + account_firstname.slice(1).toLowerCase();
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${capitalizedFirstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,        
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,        
      })
    }
  }
 


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 async function getAccountView(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "You're logged in.")
  res.render("account/accountView", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

//logout

async function logoutUser(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You're now logged out.")
  res.redirect("/")
}

//build the view to edit the account and password:
async function buildAccountEdit(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountByID(account_id)
  try {
    res.render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  } catch (error) {
    error.status = 500
    console.error(error.status)
    next(error)
  }
}

//to update the account based on the user's input
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  try{
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body
  const updatedAcctInfo = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  const accountData = await accountModel.getAccountByID(account_id)
  if (updatedAcctInfo) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash(
      "notice",
      `${account_firstname}, your account was successfully updated.`
    )
    res.redirect("/account")
  } else {
    req.flash(
      "error",
      `Sorry, ${account_firstname} the update failed. Please try again.`
    )
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }}catch(error){
        error.status = 500
    console.error(error.status)
    next(error)
  }
  }


//to update the password based on the user's input.
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  
  let hashedPassword
  try {
    
    hashedPassword = await bcrypt.hashSync(account_password, 10)

    const updatedPassword = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )
    if (updatedPassword) {
      req.flash("notice", `Your password was successfully updated.`)
      res.status(201).render("./account/accountView", {
        title: "Account Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("error", `Sorry, the update failed. Please try again.`)
      res.status(501).render("./account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
      })
    }
  } catch (error) {
    req.flash("error", "Sorry, there was an error. Please try again.")
    res.status(500).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, getAccountView, logoutUser, buildAccountEdit, updateAccount, updatePassword}