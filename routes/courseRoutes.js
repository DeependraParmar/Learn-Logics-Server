import express from "express";
import { addCourseLectures, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeSubscribers, authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// creating all the routes related to the course section 

// getting all the courses without leactures 
router.route('/courses').get(getAllCourses);

// creating a new course only for admin 
router.route('/createcourse').post(isAuthenticated,authorizedAdmin,singleUpload, createCourse);

// adding, deleting the lectures and getting the course details 
router.route('/courses/:id').get(isAuthenticated,authorizeSubscribers , getCourseLectures).post(isAuthenticated,singleUpload,addCourseLectures).delete(isAuthenticated, authorizedAdmin, deleteCourse);

//deleting the lectures from the course
router.route("/lecture").delete(isAuthenticated, authorizedAdmin, deleteLecture);

export default router;