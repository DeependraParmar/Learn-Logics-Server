import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { buySubscription, getRazorPayKey, paymentVerification } from "../controllers/paymentController.js";

const router = express.Router();

// Buy subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

// Verify the payment 
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

// To get the razorpay key 
router.route("/razorpaykey").get(getRazorPayKey);

// Cancel the subscription 
router.route("/subscription/cancel").delete(isAuthenticated, );

export default router;