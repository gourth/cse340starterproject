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
  const upgrade = await utilities.buildUpgradeDropdown()
  const grid = await utilities.getInventoryId(data, upgrade)
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
  const classificationSelect = await utilities.getClassificationList()
  res.render("./inventory/management", {
    title: "Account Management",
    nav,
    errors: null,
    classificationSelect
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
    res.redirect("/inv")
    
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.getUpgradeJSON = async (req, res, next) => {
  const upgrade_id = parseInt(req.params.upgrade_id)
  const invData = await invModel.getUpgradeByID(upgrade_id)
  if (invData[0].upgrade_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


// Build edit inventory view
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.getClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  console.log(itemName)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    list: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body
  const updateResult = await invModel.editInventory( 
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    list: classificationSelect,
    errors: null,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
    })
  }
}


// Build delete inventory view
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteItem(inv_id)
console.log(deleteResult)
  if (deleteResult) {
    req.flash("notice", 'The deletion was succesful.')
    res.redirect('/inv')
    
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect(`/delete/${inv_id}`)
  }
  }

  invCont.buildUpgrade = async function (req, res, next) {
    try {
      const upgrade_id = req.params.upgrade_id
      const inv_id = req.params.inv_id
      const itemData = await invModel.getInventoryByInventoryId(inv_id)
      const data = await invModel.getUpgradeByID(upgrade_id)
      const grid= await utilities.buildUpgradeInfo(data)
      let nav = await utilities.getNav()
  
      const upgradeName = data[0].upgrade_name 
      res.render("./inventory/upgrade", {
        title: upgradeName,
        nav,
        itemData,
        grid,
      })
    } catch (error) {
      error.status = 500
      console.error(error.status)
      next(error)
    }
  }


module.exports = invCont