const express = require("express");

const shopControllers = require("../controllers/shop");

const router = express.Router();

// Get -> Home Page => /
router.get("/", shopControllers.getIndex);

module.exports = router;
