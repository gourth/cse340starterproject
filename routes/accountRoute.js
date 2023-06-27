const express = require("express")
const router = new express.Router()
const accountcontroller = require("../controllers/accountController")
const utilities = require("../utilities")

router.get("/login", utilities.handleErrors(accountcontroller.buildLogin))

module.exports = router