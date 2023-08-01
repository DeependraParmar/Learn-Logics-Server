import express from "express";
import { getAllCourses } from "../controllers/courseController.js";

const router = express.Router();

// creating all the routes related to the course section 
router.route('/courses').get(getAllCourses);

export default router;