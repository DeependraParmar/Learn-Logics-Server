import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";


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
    const file = req.file;
    const fileUri = getDataUri(file);

    // uploading the file to the cloud (cloudinary)
    const cloud = await cloudinary.v2.uploader.upload(fileUri.content);

    if(!title || !description || !category || !createdBy) 
        return next(new ErrorHandler('Please fill all the fields',400));

    await Course.create({
        title,description,category,createdBy,poster: {
            public_id: cloud.public_id,
            url: cloud.secure_url,
        }
    })


    res.status(201).json({
        success: true,
        message: "Course created successfully. You can add lectures now",
    })

});



// to get all the courses
export const getCourseLectures = catchAsyncError(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorHandler("Course Not Found",404));
    }
    course.views += 1;
    await course.save();

    res.status(200).json({
        success: true,
        lectures: course.lectures,
    });
});

// to add new lectures to the courses
export const addCourseLectures = catchAsyncError(async (req, res, next) => {
    const {title,description} = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorHandler("Course Not Found", 404));
    }

    const file = req.file;
    const fileUri = getDataUri(file);

    // uploading the file to the cloud (cloudinary)
    const cloud = await cloudinary.v2.uploader.upload(fileUri.content,{
        resource_type: "video" // size of video cannot excceed 100mb due to the free cloudinary plan
    });

    course.lectures.push({
        title,
        description,
        video: {
            public_id: cloud.public_id,
            url: cloud.secure_url,
        }
    })
    course.numOfVideos = course.lectures.length;
    await course.save();

    res.status(200).json({
        success: true,
        message: "Lecture added successfully",
    });
});


// api to delete the course from the database 
export const deleteCourse = catchAsyncError(async(req,res,next) => {
    const {id} = req.params;
    const course = await Course.findById(id);

    if(!course){
        return next(new ErrorHandler("Course Not Found",404));
    }

    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for (let i = 0; i < course.lectures.length; i++) {
        const element = course.lectures[i];
        await cloudinary.v2.uploader.destroy(element.video.public_id,{
            resource_type: "video"
        });
    }
    await course.remove();
    

    res.status(200).json({
        success: true,
        message: "Course deleted successfully"
    })
})

export const deleteLecture = catchAsyncError(async(req,res,next) => {
    const {courseID, lectureID} = req.query;
    const course = await Course.findById(courseID);

    if(!course){
        return next(new ErrorHandler("Course Not Found",404));
    }

    const lecture = await course.lectures.find((item) => {
        if(item._id.toString() === lectureID.toString()) return item;
    });
    await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
        resource_type: "video"
    });
    course.lectures = course.lectures.filter((item) => {
        if(item._id.toString() !== lectureID.toString()) return item;
    });

    course.numOfVideos = course.lectures.length;
    await course.save();

    res.status(200).json({
        success: true,
        message: "Lecture deleted successfullly"
    })
});