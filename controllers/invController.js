const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log(data)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.getInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const grid = await utilities.getInventoryId(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/itemDetail", {
    title: className,
    nav,
    grid,
  })
}

invCont.getManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const classResult = await invModel.addClassification(
    classification_name
    )
    
    if (classResult) {
    let nav = await utilities.getNav()
    const name = classification_name
    req.flash(
      "notice",
      `${name} classification has been added successfully.`
    )
    res.render("./inventory/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
    
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Please provide correct classification name.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,   
      errors: null,     
    })
  }

}




invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.getClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    list,
    errors: null,
  })
}


invCont.addInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, inv_image, inv_thumbnail } = req.body
  
  const invResult = await invModel.addInventory(
    classification_id,
    inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail
    )
    
    if (invResult) {
    let nav = await utilities.getNav()
    
    req.flash(
      "notice",
      `Successfully added.`
    )
    res.render("./inventory/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
    
  } else {
    let nav = await utilities.getNav()
    let list = await utilities.getClassificationList()
    req.flash("notice", "Please provide missing information name.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,   
      list,
      errors: null,     
    })
  }

}


module.exports = invCont