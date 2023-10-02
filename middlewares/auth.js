import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";


// ensuring that the user is authenticated 
export const isAuthenticated = catchAsyncError( async(req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Login Required",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData._id);
    next();
});

// authorising the admin for accessing the dashboard 
export const authorizedAdmin = (req,res,next) => {
     if(req.user.role!=="admin"){
        return next(new ErrorHandler("Unauthorized Access",403));
     }
     next();
}

// authorising the subscribers to access the premium content 
export const authorizeSubscribers = (req,res,next) => {
    if(req.user.subscription.status !== "active" && req.user.role !== "admin"){
        return next(new ErrorHandler("Only Subscribers can access this",403));
    }

    next();
}