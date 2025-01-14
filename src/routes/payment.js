const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const {memberShipAmount} = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/users");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const {memberShipType} = req.body;
    const {firstName, lastName, emailId} = req.user;
    const order = await razorPayInstance.orders.create({
      amount: memberShipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        memberShipType : memberShipType,
      },
    });

    const {amount, currency, receipt, notes, id: orderId, status: status} = order;
    const user_id = req.user._id;

    const payment = new Payment({
      userId : user_id,
      orderId,
      status,
      receipt,
      amount,
      notes,
      currency,
      memberShipType : memberShipType,
    });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), KeyID : process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", express.raw({type : "application/json"}), async (req,res) => {
  try{
    const webhookSignature = req.get('X-Razorpay-Signature');
    const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
    if(!isWebhookValid){
      return res.status(400).json({msg : "webhook is Invalid"})
    }

    console.log(isWebhookValid);

    // update the status in DB
    const paymentDeatails = req.body.payload.payment.entity;
    console.log(paymentDeatails);

    const payment = await Payment.findOne({orderId : paymentDeatails.order_id});
    console.log(payment);
    payment.status = paymentDeatails.status;
    await payment.save();

    const user = await User.findOne({_id : payment.userId});
    user.isPremium = true;
    // user.memberShipType = payment.notes.memberShipType;
    await user.save();
  }catch(err){
    res.status(500).json({msg : err.message});
  }
})

module.exports = paymentRouter;
