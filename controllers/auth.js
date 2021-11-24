const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
};

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      user
        .comparePasswords(password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.userId = user._id;
            if (user.username === "admin") {
              req.session.isAdmin = true;
            }
            return req.session.save((err) => {
              if (err) console.log(err);
              res.redirect("/");
            });
          }
          return res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
  });
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }
      const newUser = new User({
        username: username,
        password: password,
        cart: {},
      });
      newUser
        .save()
        .then((newUser) => {
          res.redirect("/login");
        })
        .catch((err) => console.log());
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
