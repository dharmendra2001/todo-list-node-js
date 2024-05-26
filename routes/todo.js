// Required modules
import express from 'express';
import { createTodo,getTodos,getTodoById,updateTodo,deleteTodo,searchTodos,} from '../controllers/todoController.js';
import {verifyToken} from '../middleware/auth.js';

// Initialize router
const router = express.Router();

// Route for user create new todo
router.post('/create', verifyToken, createTodo);

// Route for update existing todo
router.put('/update',verifyToken, updateTodo);

// Route for delete todo
router.delete('/delete',verifyToken, deleteTodo);

// Route for show todo list
router.get('/list',verifyToken, getTodos);

// Route for find todo by id
router.get('/getTodo',verifyToken, getTodoById);

// Route for search todo by title, description
router.get('/search',verifyToken, searchTodos);


export default router;