const express = require("express");

const authControllers = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// GET => /login
router.get("/login", authControllers.getLogin);

// Post => /login
router.post("/login", authControllers.postLogin);

// GET => /signup
router.get("/signup", authControllers.getSignup);

// POST => /signup
router.post("/signup", authControllers.postSignup);

// POST => /logout
router.get("/logout", isAuth, authControllers.postLogout);

module.exports = router;
