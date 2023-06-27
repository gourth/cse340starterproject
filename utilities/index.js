const invModel = require("../models/inventory-model")
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

Util.getInventoryId = async function(data) {
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
    grid += '</div>'
    grid += '</div>'
  }
  return grid
}

Util.buildLogin = function(){
  let form = '<form>'
  form += '<div class="form-container">'
  form += '<div class="form-row">'
  form += '<label for="email">Email:</label>'
  form += '<input type="email" id="email" name="account_email" required>'
  form += '</div>'
  form += '<div class="form-row">'
  form += '<label for="password">Password:</label>'
  form += '<input type="password" id="password" name="account_password" required>'
  form += '</div>'
  form += '<input type="submit" value="Login">'
  form += '</form>'
  form += '<p>Don\'t have an account? <a href="#" id="registrationLink">Register here</a>.</p>'
  form += '</div>'
  
return form
}




/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util