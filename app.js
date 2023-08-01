import express from "express";
import {config} from "dotenv";

config({
    path: './config/config.env'
});

const app = express();



// importing and using all the routes here 
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

app.use('/api/v1', courseRouter);
app.use('api/v1',userRouter)


export default app;