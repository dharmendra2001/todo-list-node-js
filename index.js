// Required modules
import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import userRoute from './routes/user.js';
import todoRoute from './routes/todo.js';

configDotenv();


// Initialize Express app
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// route for user
app.use('/user', userRoute);

// route for todo 
app.use('/todo', todoRoute);

// MongoDB connection
mongoose.connect(process.env.DB_HOST, {
    dbName: process.env.DB_NAME,
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
