const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Book.find({})
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
  Order.find({ userId: req.user._id })
    .then((orders) => {
      res.render("shop/order", {
        pageTitle: "Orders",
        path: "/order",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // https://stackoverflow.com/questions/32546909/how-to-prevent-double-submitting-forms-in-expressjs
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
          userId: userCart._id,
        };

        if (order.items.length <= 0) {
          return res.redirect("/cart");
        }

        const newOrder = new Order(order);
        newOrder
          .save()
          .then((result) => {
            return req.user.clearCart();
          })
          .then((result) => {
            res.redirect("/order");
          })
          .catch((err) => console.log(err));
      });
  });
};
