import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import { getDb } from '../helpers/db_client.ts';

interface Todo {
  id: string;
  text: string;
}

const router = new Router();

let todos: Todo[] = [];

router.get('/todos', (ctx, _) => {
  ctx.response.body = { todos: todos };
});

router.get('/todos/:todoId', (ctx, _) => {
  const todo = todos.find((todo) => todo.id === ctx.params.todoId);
  if (todo) {
    ctx.response.body = { todo: todo };
    return;
  }
  ctx.response.body = { message: 'Todo not found' };
  ctx.response.status = 404;
});

router.post('/todos', async (ctx, _) => {
  const data = await ctx.request.body().value;
  const todo: Todo = {
    id: Date.now().toString(),
    text: data.text,
  };
  todos.push(todo);
  ctx.response.body = { todo: todo };
  ctx.response.status = 201;
});

router.put('/todos/:todoId', async (ctx, _) => {
  const data = await ctx.request.body().value;
  const id = ctx.params.todoId!;
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex] = { id: id, text: data.text };
    ctx.response.body = { message: 'Updated', todos: todos };
    return;
  }
  ctx.response.body = { message: 'Todo not found' };
  ctx.response.status = 404;
});

router.delete('/todos/:todoId', (ctx, _) => {
  const todoIndex = todos.findIndex((todo) => todo.id === ctx.params.todoId);
  if (todoIndex !== -1) {
    console.log(todoIndex);
    todos.splice(todoIndex, 1);
    ctx.response.body = { message: 'Deleted', todos: todos };
    return;
  }
  ctx.response.body = { message: 'Todo not found' };
  ctx.response.status = 404;
});

export default router;
