import express from "express";
import { login, logout, register } from "../controllers/userController.js";

const router = express.Router();

// creating a route for registering a user 
router.route('/register').post(register);

// to login a user
router.route('/login').post(login);


// to logout a user 
router.route("/logout").get(logout);

// to change the password
// to update the profile
// to update the profile picture

// forgot password
// update password

// add to playlist
// remove from playlist

export default router;