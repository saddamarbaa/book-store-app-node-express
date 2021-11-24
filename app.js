const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const {
  mongoDBConnectionString,
  port,
  sessionSecretString,
} = require("./util/config");

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const app = express();

const store = new MongoDBStore({
  uri: mongoDBConnectionString,
  collection: "sessions",
});

// Setting up EJS templating engine and the views folder
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: sessionSecretString,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.isAdmin;
  next();
});

app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);

mongoose
  .connect(mongoDBConnectionString)
  .then((connectionResult) => {
    User.findOne({})
      .then((user) => {
        if (!user) {
          return User.create({
            username: "Saddam",
            password: "123123",
            cart: {},
          });
        }
        return Promise.resolve("Success");
      })
      .then((result) => {
        app.listen(port, () => {
          console.log(`The app is running at http://localhost:${port}`);
        });
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
