const express = require("express");

const shopControllers = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// GET =>  /
router.get("/", shopControllers.getIndex);

// GET => /cart
router.get("/cart", isAuth, shopControllers.getCart);

// POST => /cart
router.post("/cart", isAuth, shopControllers.postCart);

// POST => /delete-cart-item
router.post("/delete-cart-item", isAuth, shopControllers.postDeleteCartItem);

// GET => /order
router.get("/order", isAuth, shopControllers.getOrder);

// POST => /order
router.post("/order", isAuth, shopControllers.postOrder);

module.exports = router;
