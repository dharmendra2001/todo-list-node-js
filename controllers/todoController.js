// Required modules
import Todo from '../models/Todo.js';
import { configDotenv } from 'dotenv';
configDotenv();


// Action for create new todo
export const createTodo = async (req, res) => {
    
    const { title, description, isPinned, isFavorite,uid } = req.body;
    try {
      const todo = await Todo.create({
        user: uid,
        title,
        description,
        isPinned,
        isFavorite,
      });
  
      res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

// Action for get todo list
export const getTodos  = async (req, res) => {
    const page = Number(req.page) || 1;
  const pageSize = Number(req.pageSize) || 10;

  try {
    const count = await Todo.countDocuments({ user: req.body.uid });
    const todos = await Todo.find({ user: req.body.uid })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ todos, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Action for get todo by id
export const getTodoById  = async (req, res) => {
    
    try {
        
        const todo = await Todo.findById(req.body.id);
        
    
        if (todo && todo.user.toString() === req.body.uid) {
          res.json(todo);
        } else {
          res.status(404).json({ message: 'Todo not found' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
};

// Action for update existing todo 
export const updateTodo = async (req, res) => {
    const { title, description, isPinned, isFavorite, id, uid } = req.body;
  
    try {
      const todo = await Todo.findById(id);
      
  
      if (todo && todo.user.toString() === uid) {
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.isPinned = isPinned !== undefined ? isPinned : todo.isPinned;
        todo.isFavorite = isFavorite !== undefined ? isFavorite : todo.isFavorite;
  
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

//   Action for delete todo
  export const deleteTodo = async (req, res) => {
    try {
      const todo = await Todo.findById(req.body.id);
  
      if (todo && todo.user.toString() === req.body.uid.toString()) {
        await todo.deleteOne();
        res.json({ message: 'Todo removed' });
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  export const searchTodos = async (req, res) => {
    try {
      const todos = await Todo.find({
        
        $or: [
        { title: { $regex: req.body.key} },
        { description: { $regex: req.body.key} },
        ],
      });
  
      res.json(todos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };