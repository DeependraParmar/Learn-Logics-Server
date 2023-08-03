import express from "express";
import {config} from "dotenv";
import ErrorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";

config({
    path: './config/config.env'
});

const app = express();

// using the middlewares for accessing data from the req.body 
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// using cookie parser in order to access token from the cookie to isAuthenticated middleware 
app.use(cookieParser());


// importing and using all the routes here 
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

app.use('/api/v1', courseRouter);
app.use('/api/v1',userRouter)


export default app;


// Using the Error Middleware at the last
app.use(ErrorMiddleware);