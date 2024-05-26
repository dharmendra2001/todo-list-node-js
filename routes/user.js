// Required modules
import express from 'express';
import {register , login} from '../controllers/userController.js';
import {verifyInputForSignUp, verifyInputForLogin} from '../middleware/auth.js';

// Initialize router
const router = express.Router();

// Route for user signup
router.post('/api/signup', verifyInputForSignUp, register);

// Route for user login
router.post('/api/login',verifyInputForLogin, login);


export default router;