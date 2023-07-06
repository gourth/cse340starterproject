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
router.get("/", invController.getManagement);

// Route to get New Classification view
router.get("/add-classification", invController.buildClassification);

// Process adding new classification
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassification,
    utilities.handleErrors(invController.addClassification)
    )
    

// Route to get New Vehicle view
router.get("/add-inventory", invController.buildInventory);

// Process adding new inventory
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInventory,
    utilities.handleErrors(invController.addInventory)
    )
    
// Get inventory for AJAX Route
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

// Modify existing vehicle info------CHANGE THIS TO ONLY BUILD THE VIEW
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryView))

// Process updating the vehicle info
router.post("/update", 
regValidate.updateInventoryRules(),
regValidate.checkUpdateInventory,
utilities.handleErrors(invController.editInventory))

// Build delete view
router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteView))

// Process deleting vehicle
router.post("/delete",
utilities.handleErrors(invController.deleteItem))

module.exports = router;