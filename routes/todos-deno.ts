import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import { ObjectId } from 'https://deno.land/x/mongo@v0.13.0/mod.ts';

import { getDb } from '../helpers/db_client.ts';

interface Todo {
  id?: string;
  text: string;
}

const router = new Router();

router.get('/todos', async (ctx, _) => {
  try {
    const todos = await getDb().collection('todos').find();
    ctx.response.body = {
      todos: todos.map((todo: any) => {
        return { id: todo._id.toString(), text: todo.text };
      }),
    };
  } catch (error) {
    console.log(error);
  }
});

router.get('/todos/:todoId', async (ctx, _) => {
  try {
    const todo = await getDb()
      .collection('todos')
      .findOne({ _id: ObjectId(ctx.params.todoId!) });
    if (todo) {
      ctx.response.body = { todo: todo };
      return;
    }
    ctx.response.body = { message: 'Todo not found' };
    ctx.response.status = 404;
  } catch (error) {
    console.log(error);
  }
});

router.post('/todos', async (ctx, _) => {
  try {
    const data = await ctx.request.body().value;
    const todo: Todo = {
      text: data.text,
    };
    const createdId = await getDb().collection('todos').insertOne(todo);
    todo.id = createdId.toString();
    ctx.response.body = { todo: { id: createdId.toString(), text: todo.text } };
    ctx.response.status = 201;
  } catch (error) {
    console.log(error);
  }
});

// router.put('/todos/:todoId', async (ctx, _) => {
//   const data = await ctx.request.body().value;
//   const id = ctx.params.todoId!;
//   const todoIndex = todos.findIndex((todo) => todo.id === id);
//   if (todoIndex !== -1) {
//     todos[todoIndex] = { id: id, text: data.text };
//     ctx.response.body = { message: 'Updated', todos: todos };
//     return;
//   }
//   ctx.response.body = { message: 'Todo not found' };
//   ctx.response.status = 404;
// });

// router.delete('/todos/:todoId', (ctx, _) => {
//   const todoIndex = todos.findIndex((todo) => todo.id === ctx.params.todoId);
//   if (todoIndex !== -1) {
//     console.log(todoIndex);
//     todos.splice(todoIndex, 1);
//     ctx.response.body = { message: 'Deleted', todos: todos };
//     return;
//   }
//   ctx.response.body = { message: 'Todo not found' };
//   ctx.response.status = 404;
// });

export default router;
