const fileHelper = require("../util/file");

const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");

exports.getBooks = (req, res, next) => {
  Book.find({})
    .sort({ _id: -1 })
    .then((books) => {
      res.render("admin/books", {
        pageTitle: "Admin Books",
        path: "/admin/books",
        books: books,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddBook = (req, res, next) => {
  res.render("admin/add-book", {
    pageTitle: "Add book",
    path: "/admin/add-book",
    editMode: false,
  });
};

exports.postAddBook = (req, res, next) => {
  const image = req.file;

  if (!image) {
    return res.redirect("/admin/books");
  }

  const imageUrl = `/${image.path}`;

  const book = {
    title: req.body.title,
    image: imageUrl,
    description: req.body.description,
    quantity: req.body.quantity,
  };

  const newBook = new Book(book);
  newBook
    .save()
    .then((result) => {
      res.redirect("/admin/books");
    })
    .catch((err) => console.log(err));
};

exports.getEditBook = (req, res, next) => {
  const bookId = req.params.bookId;

  Book.findById(bookId)
    .then((book) => {
      res.render("admin/add-book", {
        pageTitle: "Add book",
        path: "/admin/books",
        editMode: true,
        book: book,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditBook = (req, res, next) => {
  const bookId = req.body.bookId;

  const image = req.file;
  if (!image) {
    return res.redirect("/admin/books");
  }

  const updatedTitle = req.body.title;
  const updatedImage = image.path;
  const updatedDescription = req.body.description;
  const updatedQuantity = req.body.quantity;

  Book.findById(bookId)
    .then((book) => {
      book.title = updatedTitle;
      if (image) {
        book.image = `/${image.path}`;
      }
      book.image = updatedImage;
      book.description = updatedDescription;
      book.quantity = updatedQuantity;
      return book.save();
    })
    .then((result) => {
      res.redirect("/admin/books");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteBook = (req, res, next) => {
  const bookId = req.body.bookId;

  Book.findByIdAndRemove(bookId)
    .then((result) => {
      res.redirect("/admin/books");
    })
    .catch((err) => console.log(err));
};

exports.getUsers = (req, res, next) => {
  User.find({})
    .select("username")
    .then((users) => {
      res.render("admin/users", {
        pageTitle: "Admin Users",
        path: "/admin/users",
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const userId = req.query.userId;

  Order.find({ userId: userId })
    .populate("userId")
    .then((orders) => {
      res.render("admin/orders", {
        pageTitle: "Admin Orders",
        path: "/admin/users",
        orders: orders,
        userId: orders[0].userId._id,
        username: orders[0].userId.username,
      });
    })
    .catch((err) => {
      res.redirect("/admin/users");
    });
};

exports.postDeleteOrder = (req, res, next) => {
  const orderId = req.body.orderId;
  const userId = req.body.userId;

  Order.findByIdAndRemove(orderId)
    .then((order) => {
      Order.find({ userId: userId }).count((err, count) => {
        if (err || count <= 0) {
          return res.redirect("/admin/users");
        }
        res.redirect(`/admin/orders?userId=${userId}`);
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;

  User.findByIdAndRemove(userId)
    .then((deleteUser) => {
      console.log(deleteUser);

      res.redirect("/admin/users");
    })
    .catch((err) => console.log(err));
};

exports.getAddUser = (req, res, next) => {
  res.render("admin/add-user", {
    pageTitle: "Add User",
    path: "/admin/add-user",
    editMode: false,
  });
};

exports.postAddUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        return res.redirect("/admin/add-user");
      }
      const newUser = new User({
        username: username,
        password: password,
        cart: {},
      });
      return newUser
        .save()
        .then((result) => {
          res.redirect("/admin/users");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getEditUser = (req, res, next) => {
  const userId = req.query.userId;
  User.findById(userId)
    .select("username")
    .then((user) => {
      console.log(user);
      res.render("admin/add-user", {
        pageTitle: "Edit User",
        path: "/admin/add-user",
        editMode: true,
        user: user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const userId = req.body.userId;

  User.findById(userId).then((user) => {
    console.log(user);
    if (!user) {
      return res.redirect("/admin/users");
    }
    user.username = username;
    user.password = password;
    user
      .save()
      .then((result) => {
        console.log(result);
        res.redirect("/admin/users");
      })
      .catch((err) => console.log(err));
  });
};
