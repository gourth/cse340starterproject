const utilities = require("../utilities/")

// Deliver login view
async function buildLogin(req, res, next) {
    const form = utilities.buildLogin()
    req.flash("notice", "This is a flash message.")
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        form,
    })
}

 
  

module.exports = { buildLogin }