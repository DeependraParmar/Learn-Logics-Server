import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"],
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minLength: [6,"Password must be at least 6 characters long"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user",
    },
    subscription: {
        id: String,
        status: String,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true,
        },
    },
    playlist: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
            poster: {
                type: String
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,

    },
    resetPasswordToken: String,
    resetPasswordExpire: String,

});



export const User = mongoose.model('User', schema);