import express from "express";
import { contact, getAdminStats, requestCourse } from "../controllers/otherControllers.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// contact form
router.route("/contact").post(contact);

// request form 
router.route("/requestcourse").post(requestCourse);

// get the admin stats 
router.route("/admin/stats").get(isAuthenticated, authorizedAdmin, getAdminStats);

export default router;