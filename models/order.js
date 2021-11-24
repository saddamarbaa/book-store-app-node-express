const mongoose = require("mongoose");
const { Schema } = mongoose;

const order = new Schema({
  items: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Order", order);
