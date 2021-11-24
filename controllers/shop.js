const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");
const book = require("../models/book");

exports.getIndex = (req, res, next) => {
  Book.find({ quantity: { $gt: 0 } })
    .then((books) => {
      res.render("shop/index", {
        pageTitle: "Book Store",
        path: "/",
        books: books,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  User.findById(req.user)
    .select("cart")
    .populate("cart.items.productId")
    .then((userCart) => {
      res.render("shop/cart", {
        pageTitle: "Shopping Cart",
        path: "/cart",
        cartItems: userCart.cart.items,
        userId: userCart._id,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const bookId = req.body.bookId;
  const doDecrease = req.query.decrease === "true" ? true : false;

  req.user
    .addToCart(bookId, doDecrease)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  const bookId = req.body.bookId;

  req.user
    .removeFromCart(bookId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res, next) => {
  const message = req.query.message;
  Order.find({ userId: req.user._id })
    .then((orders) => {
      res.render("shop/order", {
        pageTitle: "Orders",
        path: "/order",
        orders: orders,
        message: message ? message : "",
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const userMessage =
    "Thank you, your books will be shipped in 2-3 business days";
  req.user.haveOrderRight((orderRight) => {
    if (!orderRight) {
      return res.redirect("/cart");
    }
    User.findById(req.user)
      .select("cart")
      .populate("cart.items.productId")
      .then((userCart) => {
        const orderItems = userCart.cart.items.map((item) => {
          return {
            product: { ...item.productId },
            quantity: item.quantity,
          };
        });
        const order = {
          items: orderItems,
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          userId: userCart._id,
        };

        if (order.items.length <= 0) {
          return res.redirect("/cart");
        }

        if (req.user.cart.items.length <= 0) {
          return res.redirect("/");
        }

        const newOrder = new Order(order);

        const bookIds = newOrder.items.map((item) => {
          return item.product._id;
        });

        Book.find({ _id: { $in: bookIds } })
          .then((books) => {
            for (const book of books) {
              for (const item of newOrder.items) {
                if (item.product._id.toString() === book._id.toString()) {
                  if (book.quantity < item.quantity) {
                    return res.redirect("/");
                  }
                }
              }
            }

            for (const item of newOrder.items) {
              Book.findById(item.product._id)
                .then((book) => {
                  book.quantity -= item.quantity;
                  book.save();
                })
                .catch((err) => console.log(err));
            }

            newOrder
              .save()
              .then((result) => {
                return req.user.clearCart();
              })
              .then((result) => {
                res.redirect(`/order?message=${userMessage}`);
              })
              .catch();
          })
          .catch((err) => console.log(err));
      });
  });
};
