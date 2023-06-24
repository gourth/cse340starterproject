

const express = require('express');
const router = new express.Router();
const intError = require("../controllers/HomeController")


// Intentional error route
router.get("/", intError.triggerError);

module.exports = router;
