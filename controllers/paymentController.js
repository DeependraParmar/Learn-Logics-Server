import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";


export const buySubscription = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    if(!user){
        return next(new ErrorHandler("User Not Found",404));
    }
    if(user.role === "admin"){
        return next(new ErrorHandler("Admin need not to subscribe",400));
    }

    const subscription = await instance.subscriptions.create({
        plan_id: process.env.PLAN_ID,
        customer_notify: 1,
        total_count: 12,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({
        success: true,
        message: "Subscribed to Premium Successfully",
        subscriptionID: subscription.id,
    });
});


export const paymentVerification = catchAsyncError(async(req,res,next) => {
    const {razorpay_payment_id, razorpay_subscription_id, razorpay_signature} = req.body;
    const user = await User.findById(req.user._id);
    const subscription_id = user.subscription.id;

    const generated_signature = crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(razorpay_payment_id + '|' + subscription_id, "utf-8").digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if(!isAuthentic){
        res.redirect(`${process.env.FRONTEND_URL}/paymentfail`)
    }

    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id,
    });

    user.subscription.status = "active";
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`)
});

// controller to get the razorpay key 
export const getRazorPayKey = catchAsyncError(async(req,res,next) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_API_KEY,
    })
});

// controller to cancel the subscription 
export const cancelSubscription = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    const subscription_id = user.subscription.id;

    let refund = false;
    await instance.subscriptions.cancel(subscription_id);

    const payment = await Payment.findOne({
        razorpay_subscription_id: subscription_id,
    });

    const gap = Date.now() - payment.createdAt;
    const refund_time = process.env.REFUND_DAYS*24*60*60*1000;

    if(refund_time > gap){
        await instance.payments.refund(payment.razorpay_payment_id);
        refund = true;
    }
    await payment.remove();
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();
    
    res.status(200).json({
        success: true,
        message: refund ? "Subscription cancelled. You will get refund within 7 business days." : "Subscription cancelled. No refund initiated as per Refund Policies."
    })
})