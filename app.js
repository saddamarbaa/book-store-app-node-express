const express = require("express");

const shopRoutes = require("./routes/shop");

const app = express();
// Setting up Application's PORT
const PORT = 8080;

// Setting up EJS templating engine and the views folder
app.set("view engine", "ejs");
app.set("views", "views");

// Serve static files from public folder
app.use(express.static("public"));

app.use(shopRoutes);

app.listen(PORT, () => {
  console.log(`The app is running at http://localhost:${PORT}`);
});
