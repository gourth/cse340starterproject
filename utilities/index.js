const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li id="border">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detailed inventory view HTML
* ************************************ */

Util.getInventoryId = async function(data, upgrade) {
  let grid
  if(data.length > 0){
    //grid += '<h1>' + data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model +'</h1>' 
    grid = '<div class="description-container">'
    grid += '<img src="' + data[0].inv_image
    +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
    +' on CSE Motors" />'
    grid += '<div class="description-column">'
    grid += '<h2 class="deets">' + data[0].inv_make + ' ' + data[0].inv_model + ' ' + 'Details' + '</h2>'
    grid += '<h2 class="price">' + 'Price:' + ' ' + '<span>$' 
    + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</span>' + '</h2>'
    grid += '<h2 class="describe">' + 'Description:' + ' ' + data[0].inv_description + '</h2>'
    grid += '<h2 class="color">' + 'Color:' + ' ' + data[0].inv_color + '</h2>'
    grid += '<h2 class="miles">' + 'Miles:' + ' ' + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</h2>'
    grid += upgrade
    grid += '</div>'
    grid += '</div>'
  }
  return grid
}


Util.getClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<select id='classificationList' name='classification_id'>"
  data.rows.forEach((row) => {
    list += "<option  value='" + row.classification_id + "' >" 
    
    list += row.classification_name 
      
    list += "</option>"
  })
  list += "</select>"
  return list
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin") {
    next()
  } else {
    req.flash("notice", "You must have employee or admin credentials to access.")
    return res.redirect("/account/login")
  }
 }

/* **************************************
* Build the upgrade view HTML
* ************************************ */
Util.buildUpgradeDropdown = async function () {
  let data = await invModel.getUpgradesByInventoryID()
  let list = "<select id='upgradeList' name='upgrade_id'>"
  let select = `<label for="upgrade_id">Upgrades:</label>
                <select id="upgrade_id" class="class-dropdown p-font" name="upgrade_id" required>`

  if (data.length > 0) {
    select += `<option value="" disabled selected>Select upgrade</option>`

    for (var i = 0; i < data.length; i++) {
      // const selected =
        // upgrade_id && data[i]?.upgrade_id === upgrade_id ? "selected" : ""
      select += `<option value="${data[i].upgrade_id}" >${data[i].upgrade_name}</option>`
    }
  } else {
    select += `<option value="" disabled selected>No upgrades available </option>`
  }

  select += `</select>`

  return select
}

Util.buildUpgradeInfo = async function (data) {
  let grid = '<div id="info-wrapper" class="info-wrapper">'
  if (data.length > 0) {
    grid +=
      '<img class="individual-image" src="' +
      data[0].upgrade_image +
      '" alt="Image of ' +
      data[0].upgrade_name +
      '"/>'

    grid += '<div class="details p-font">'
    grid += "<h2>" + data[0].upgrade_name + " Details:</h2>"
    grid += "<ul>"
    grid +=
      '<li> <span class="boldme">Price:</span> $' +
      new Intl.NumberFormat("en-US").format(data[0].upgrade_price) +
      "</li>"
    grid +=
      '<li> <span class="boldme">Description:</span> ' +
      data[0].upgrade_description +
      "</li>"
    grid += "</ul></div>"
  } else {
    grid +=
      '<p class="notice">Sorry, no matching upgrade could be found.</p>'
  }
  grid += "</div>"
  return grid
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util