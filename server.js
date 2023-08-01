import app from "./app.js";
import { connectDB } from "./config/database.js";

connectDB();   // connecting to the database


app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on http://localhost:${process.env.PORT}`); 
});