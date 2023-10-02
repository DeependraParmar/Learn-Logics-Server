import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stats } from "../models/Stats.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";


export const contact = catchAsyncError(async(req,res,next) => {
    const {name,email,message} = req.body;

    if(!name || !email || !message){
        return next(new ErrorHandler("All fields are compulsory",400));
    }

    const to = process.env.MY_MAIL;
    const subject = "Contact from Learn Logics";
    const text = `I am ${name} and my email is ${email}. \n ${message}`;

    await sendEmail(to,subject,text);

    res.status(200).json({
        success: true,
        message: "We will get to you asap..."
    });
});

// controller to request the course 
export const requestCourse = catchAsyncError(async(req,res,next) => {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
        return next(new ErrorHandler("All fields are compulsory", 400));
    }

    const to = process.env.MY_MAIL;
    const subject = "Requesting for a course on Learn Logics";
    const text = `I am ${name} and my email is ${email}. \n I am requesting for ${course}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success: true,
        message: "We got your request. You'll get the course asap..."
    });
});


// controller for getting the admin dashboard stats 
export const getAdminStats = catchAsyncError(async(req,res,next) => {
    const stats = await Stats.find({});

    res.status(200).json({
        succes: true, 
    })
})