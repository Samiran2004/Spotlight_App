import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import createUserController from "./controllers/users/createUser.controller.js";
import postController from './controllers/posts/posts.controller.js';

dotenv.config();

const app = express();

app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Connect database...
mongoose.connect(process.env.DB_URI)
    .then((data) => console.log("Database connected", data.connection.name))
    .catch(() => console.log("Database connection error"));

app.use('/api/auth', createUserController);

app.use('/api/post', postController);

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Server connection error...");
    } else {
        console.log(`Server connected on port: ${process.env.PORT}`);
    }
});