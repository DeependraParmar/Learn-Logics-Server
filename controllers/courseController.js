import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import ErrorHandler from "../utils/errorHandler.js";



// to get all the courses
export const getAllCourses = catchAsyncError(async (req, res, next) => {
        const courses = await Course.find().select('-lectures');
        res.status(200).json({
            success: true,
            courses,
        });
});

// to create a new course 

export const createCourse = catchAsyncError(async (req, res, next) => {
    const {title,description,category,createdBy} = req.body;
    // const file = req.file;


    if(!title || !description || !category || !createdBy) 
        return next(new ErrorHandler('Please fill all the fields',400));

    await Course.create({
        title,description,category,createdBy,poster: {
            public_id: 'file.public_id',
            url: 'file.url',
        }
    })


    res.status(201).json({
        success: true,
        message: "Course created successfully. You can add lectures now",
    })


});