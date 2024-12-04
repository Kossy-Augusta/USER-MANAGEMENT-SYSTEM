import dotenv from 'dotenv'
dotenv.config();
import { connectDB } from "./config/dbCon";
import mongoose from 'mongoose';
import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import envVars from './validators/env_validation';
import cookieParser from 'cookie-parser';
import authRoute from "./routes/auth.route"
import userManagemetRoute from "./routes/user.management.routes";

const app = express();
const PORT = envVars.PORT || 3600;

// connect DB
connectDB();
app.use(express.urlencoded({extended: false}));
// cross origin resource sharing
app.use(cors(corsOptions));
// json middleware
app.use(express.json());
app.use(cookieParser())

app.use('/user', authRoute);
app.use('/user', userManagemetRoute);

mongoose.connection.once('open', ()=>{
    console.log("connected to mongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

