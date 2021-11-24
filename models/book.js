const mongoose = require("mongoose");
const { Schema } = mongoose;

const book = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Book", book);

book.methods.isAvailable = function (wantedQuantity) {
  let isAvailable = true;
  if (this.quantity < wantedQuantity) isAvailable = false;
  return isAvailable;
};
