import express from "express";
import { addToPlaylist, changePassword, forgetPassword, login, logout, myProfile, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePicture } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// creating a route for registering a user 
router.route('/register').post(register);

// to login a user
router.route('/login').post(login);


// to logout a user 
router.route("/logout").get(logout);

// to get my profile 
router.route("/me").get(isAuthenticated,myProfile);

// to change the password
router.route("/changepassword").put(isAuthenticated,changePassword);

// to update the profile
router.route("/updateprofile").put(isAuthenticated,updateProfile);

// to update the profile picture
router.route("/updateprofilepicture").put(isAuthenticated, updateProfilePicture);


// forgot password
router.route("/forgetpassword").post(forgetPassword);

// reset password
router.route("/resetpassword/:token").put(resetPassword);

// add to playlist
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist);

// remove from playlist
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist);

export default router;