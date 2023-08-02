import express from "express";
import { createCourse, getAllCourses } from "../controllers/courseController.js";

const router = express.Router();

// creating all the routes related to the course section 
router.route('/courses').get(getAllCourses);
router.route('/createcourse').post(createCourse);

export default router;