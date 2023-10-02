import express from "express";
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, login, logout, myProfile, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePicture, updateUserRole } from "../controllers/userController.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// creating a route for registering a user 
router.route('/register').post(singleUpload,register);

// to login a user
router.route('/login').post(login);


// to logout a user 
router.route("/logout").get(logout);

// to get my profile and delete my profile
router.route("/me").get(isAuthenticated,myProfile).delete(isAuthenticated, deleteMyProfile);

// to change the password
router.route("/changepassword").put(isAuthenticated,changePassword);

// to update the profile
router.route("/updateprofile").put(isAuthenticated,updateProfile);

// to update the profile picture
router.route("/updateprofilepicture").put(isAuthenticated,singleUpload, updateProfilePicture);


// forgot password
router.route("/forgetpassword").post(forgetPassword);

// reset password
router.route("/resetpassword/:token").put(resetPassword);

// add to playlist
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist);

// remove from playlist
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist);


// admin routes 
// route to get all the users in the dashboard 
router.route("/admin/users").get(isAuthenticated, authorizedAdmin, getAllUsers);

// updating the role of the user 
router.route("/admin/user/:id").put(isAuthenticated, authorizedAdmin, updateUserRole).delete(isAuthenticated, authorizedAdmin, deleteUser);

export default router;