import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {User} from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/errorHandler.js";

// controller to register a user 
export const register = catchAsyncError( async(req,res,next) => {
    const {name,email,password} = req.body;
    // const file = req.file; 

    if( !name || !email || !password)
        return (next(new ErrorHandler("All the fields are required",400)));

    let user = await User.findOne({email});

    if(user) 
        return next(new ErrorHandler("User Already Exists. Please go to Login",409));

    // upload file on cloudinary
    user = await User.create({
        name,email,password,
        avatar: {
            public_id: "temp",
            url: "temp",
        }
    });

    sendToken(res,user,"User Registered Successfully",201);
});



// controller to login a  user 
export const login = catchAsyncError(async(req,res,next)=> {
    const {email,password} = req.body;
    // const file = req.file; 

    if( !email || !password){
        return next(new ErrorHandler("All Fields are Required", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("User Doesn't Exist. Please Register First", 401));
    }

    console.log(user);
    const isMatched = await user.comparePassword(password);

    if(!isMatched)
        return next(new ErrorHandler("Incorrect Email or Password",401));


    sendToken(res,user,`Welcome back, ${user.name}`,200)
});



// logging a user out 
export const logout = catchAsyncError( async(req,res,next) => {
    res.status(200).cookie("token",null,{
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Logged Out Successfully"
    })
})