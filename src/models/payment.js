const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref : "User",
        required : true,
    },
    paymentId: {
        type: String, 
    },
    orderId: {
      type: String,
      required: true,
    },
    status : {
        type : String,
        required :  true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type : String,
      required: true,
    },
    isPremium : {
      type : Boolean,
      default : false,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      memberShipType: {
        type: String,
      },
      emailId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;