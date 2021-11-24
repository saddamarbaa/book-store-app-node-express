const express = require("express");

const adminControllers = require("../controllers/admin");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// GET => /admin/books
router.get("/books", isAdmin, adminControllers.getBooks);

// GET => /admin/add-book
router.get("/add-book", isAdmin, adminControllers.getAddBook);

// POST => /admin/add-book
router.post("/add-book", isAdmin, adminControllers.postAddBook);

// GET => /admin/edit-book/:bookId
router.get("/edit-book/:bookId", isAdmin, adminControllers.getEditBook);

// POST => /admin/edit-book
router.post("/edit-book", isAdmin, adminControllers.postEditBook);

// POST => /admin/delete-book
router.post("/delete-book", isAdmin, adminControllers.postDeleteBook);

// GET => /admin/users
router.get("/users", isAdmin, adminControllers.getUsers);

// POST => /admin/delete-user
router.post("/delete-user", adminControllers.postDeleteUser);

// GET => /admin/edit-user
router.get("/edit-user", isAdmin, adminControllers.getEditUser);

// POST => /admin/edit-user
router.post("/edit-user", isAdmin, adminControllers.postEditUser);

// GET => /admin/orders
router.get("/orders", isAdmin, adminControllers.getOrders);

// POST => /admin/delete-order
router.post("/delete-order", isAdmin, adminControllers.postDeleteOrder);

// GET => /admin/add-user
router.get("/add-user", isAdmin, adminControllers.getAddUser);

// POST => /admin/add-user
router.post("/add-user", isAdmin, adminControllers.postAddUser);

module.exports = router;
