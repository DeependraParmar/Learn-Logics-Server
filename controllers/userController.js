import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {User} from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {Course} from "../models/Course.js";

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
});


// controller to get my profile
export const myProfile = catchAsyncError( async(req,res,next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user, 
    })
});


// controller for changing the password of the user 
export const changePassword = catchAsyncError( async(req,res,next) => {
    const {oldPassword,newPassword} = req.body;

    if( !oldPassword || !newPassword){
        return next(new ErrorHandler("All Fields are Required",400));
    }
    const user = await User.findById(req.user._id).select("+password");

    const isMatched = await user.comparePassword(oldPassword);

    if(!isMatched){
        return next(new ErrorHandler("Incorrect Password",400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully"
    })
});


// controller for updating the user's profile information 
export const updateProfile = catchAsyncError( async(req,res,next) => {
    const {name,email} = req.body;
    const user = await User.findById(req.user._id);

    if(name){
        user.name = name;
    }
    if(email){
        user.email = email;
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    })
});


// controller for updating the profile picture 
export const updateProfilePicture = catchAsyncError( async(req,res,send) => {
    res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully",
    })
});


// controller for forget password 
export const forgetPassword = catchAsyncError( async(req,res,next) => {
    const {email} = req.body;
    if(!email){
        return next(new ErrorHandler("Email is Required",400));
    }
    
    const user = await User.findOne({email});

    if(!user){
        return next(new ErrorHandler("User not found with this email",404));
    }

    const resetToken = await user.getResetToken();

    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password: ${url}. If your have not requested then, please ignore.`

    // send token via email 
    await sendEmail(user.email,"Learn Logics: Forgot Password!! No Worries. Reset it",message);

    res.status(200).json({
        success: true,
        message: `Reset link has been sent to ${user.email}`
    })
});


// controller for reset password 
export const resetPassword = catchAsyncError( async(req,res,next) => {
    const {token} = req.params;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        }
    });

    if(!user){
        return next(new ErrorHandler("Token is invalid or been expired",401));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Reset Successful",
    })
});



// controller to add a playlist 
export const addToPlaylist = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.body.id);

    if(!course){
        return next(new ErrorHandler("Incorrect Course ID",404));
    }

    const playlistExist = user.playlist.find((playlist)=> {
        if(playlist.course.toString()===course._id.toString()){
            return true; 
        }
    });

    if(playlistExist){
        return next(new ErrorHandler("Playlist already exists",409));
    }

    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Course added to playlist. View Profile to see playlists",
    })
});



// controller to delete a playlist 
export const removeFromPlaylist = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.query.id);

    if(!course){
        return next(new ErrorHandler("Invalid Course ID",409));
    }

    const newPlaylist = user.playlist.filter((playlist)=> {
        if(playlist.course.toString() !== course._id){
            return playlist;
        }
    });

    user.playlist = newPlaylist;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Removed From Playlist",
    })
});