const { Router } = require('express');

const router = Router();

let todos = [];

router.get('/', (req, res, next) => {
  res.json({ todos: todos });
});

router.get('/:todoId', (req, res, next) => {
  console.log(req.params.todoId);
  const todo = todos.find((todo) => todo.id === req.params.todoId);
  if (todo) {
    return res.json({ todo: todo });
  }
  return res.status(404).json({ message: 'Todo not found' });
});

router.post('/', (req, res, next) => {
  const content = req.body.content;
  const todo = {
    id: Date.now().toString(),
    content: content,
  };
  todos.push(todo);
  return res.status(201).json({ todo: todo });
});

router.put('/:todoId', (req, res, next) => {
  const content = req.body.content;
  const todoIndex = todos.findIndex((todo) => todo.id === req.params.todoId);
  if (todoIndex !== -1) {
    todos[todoIndex] = { id: req.params.todoId, content: content };
    return res.json({ message: 'Updated', todos: todos });
  }
  return res.status(404).json({ message: 'Todo not found' });
});

router.delete('/:todoId', (req, res, next) => {
  const todoIndex = todos.findIndex((todo) => todo.id === req.params.todoId);
  if (todoIndex !== -1) {
    console.log(todoIndex);
    todos.splice(todoIndex, 1);
    return res.json({ message: 'Deleted', todos: todos });
  }
  return res.status(404).json({ message: 'Todo not found' });
});

module.exports = router;
