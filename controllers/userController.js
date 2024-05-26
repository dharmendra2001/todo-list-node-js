// Required modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { configDotenv } from 'dotenv';

configDotenv();

//function for generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, {
      expiresIn: '20m',
    });
  };

// Action for user signup
export const register = async (req, res) => {
    
    try {
        const {username, email, password} = req.body;
        // Check if user already exists
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            username: username,
            email: email,
            password: password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();
       
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
          });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Action for user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create and return JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '20m' }, (err, token) => {
            if (err) throw err;
            res.json({
                _id: user._id,
                username: user.username,
                token: token,
              });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Action for user profile
export const profile = async (req, res) => {
    let token = req.headers["authorization"];
    // Decode and verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // Get the user information
    let user = await User.findOne({_id: decodedToken.user.id});
    let profileInfo = {
        id: user._id,
        username: user.username,
        email: user.email
    };
    if(user){
        return res.status(200).json({ profileInfo });
    }else{
        return res.status(400).json({ message: 'Invalid Credentials' });
    }
};