const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Add New Classification Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .matches(/^[^\s]+$/)
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Please provide correct classification."), // on error this message is sent.

    ]
  }


/* ******************************
 * Check data and return errors or continue adding classification
 * ***************************** */
validate.checkClassification = async (req, res, next) => {
    const { classifcation_name } = req.body
    let errors = []
    errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classifcation_name,
      })
      return
    }
    next()
  }


  /*  **********************************
 *  Add New Inventory Rules
 * ********************************* */

  validate.inventoryRules = () => {
    return [
      // make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // model is required and must be string
      body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a model."), // on error this message is sent.
  
      
      // description is required and must be string
      body("inv_description")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a description."), // on error this message is sent.
  
      // price is required and must be string
      body("inv_price")
      .trim()
      .isLength({ min: 2 })
      .isNumeric()
      .withMessage("Please provide a price."), // on error this message is sent.
     
      // year is required and must be string
      body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Please provide a year."), // on error this message is sent.

      // miles is required and must be string
      body("inv_miles")
      .trim()
      .isLength({ min: 1})
      .isNumeric()
      .withMessage("Please provide miles."), // on error this message is sent.

      // color is required and must be string
      body("inv_color")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a color."), // on error this message is sent.
   ]

  }

/* ******************************
 * Check data and return errors or continue adding inventory
 * ***************************** */
validate.checkInventory = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color} = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let list = await utilities.getClassificationList()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      list,
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}


/*  **********************************
 *  Add Update Inventory Rules
 * ********************************* */

validate.updateInventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."), // on error this message is sent.

    
    // description is required and must be string
    body("inv_description")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a description."), // on error this message is sent.

    // price is required and must be string
    body("inv_price")
    .trim()
    .isLength({ min: 2 })
    .isNumeric()
    .withMessage("Please provide a price."), // on error this message is sent.
   
    // year is required and must be string
    body("inv_year")
    .trim()
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage("Please provide a year."), // on error this message is sent.

    // miles is required and must be string
    body("inv_miles")
    .trim()
    .isLength({ min: 1})
    .isNumeric()
    .withMessage("Please provide miles."), // on error this message is sent.

    // color is required and must be string
    body("inv_color")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a color."), // on error this message is sent.
 ]

}


/* ******************************
 * Check data and return errors or continue updating inventory
 * ***************************** */
validate.checkUpdateInventory = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let list = await utilities.getClassificationList()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      list,
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id
    })
    return
  }
  next()
}

module.exports = validate