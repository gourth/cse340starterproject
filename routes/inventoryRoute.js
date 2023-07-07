// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require("../utilities")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to get inventory ID
router.get("/detail/:inventoryId", invController.getInventoryId);

// Route to get Account Manamgement view
router.get("/", utilities.checkAccountType, invController.getManagement);

// Route to get New Classification view
router.get("/add-classification", utilities.checkAccountType, invController.buildClassification);

// Process adding new classification
router.post(
    "/add-classification",
    utilities.checkAccountType,
    regValidate.classificationRules(),
    regValidate.checkClassification,
    utilities.handleErrors(invController.addClassification)
    )
    

// Route to get New Vehicle view
router.get("/add-inventory", utilities.checkAccountType, invController.buildInventory);

// Process adding new inventory
router.post(
    "/add-inventory",
    utilities.checkAccountType,
    regValidate.inventoryRules(),
    regValidate.checkInventory,
    utilities.handleErrors(invController.addInventory)
    )
    
// Get inventory for AJAX Route
router.get(
    "/getInventory/:classification_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Modify existing vehicle info------CHANGE THIS TO ONLY BUILD THE VIEW
router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView))

// Process updating the vehicle info
router.post("/update", 
utilities.checkAccountType,
regValidate.updateInventoryRules(),
regValidate.checkUpdateInventory,
utilities.handleErrors(invController.editInventory))

// Build delete view
router.get("/delete/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView))

// Process deleting vehicle
router.post("/delete",
utilities.checkAccountType,
utilities.handleErrors(invController.deleteItem))

module.exports = router;