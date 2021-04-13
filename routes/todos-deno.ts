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
        return { id: todo._id.$oid, text: todo.text };
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
    todo.id = createdId.$oid;
    ctx.response.body = { todo: { id: createdId.$oid, text: todo.text } };
    ctx.response.status = 201;
  } catch (error) {
    console.log(error);
  }
});

router.put('/todos/:todoId', async (ctx, _) => {
  try {
    const data = await ctx.request.body().value;
    const id = ctx.params.todoId!;
    const result = await getDb()
      .collection('todos')
      .updateOne({ _id: ObjectId(id) }, { $set: { text: data.text } });
    console.log(result.modifiedCount);
    if (result.modifiedCount > 0) {
      ctx.response.body = { message: 'Updated' };
      return;
    }
    ctx.response.body = { message: 'Todo not found' };
    ctx.response.status = 404;
  } catch (error) {
    console.log(error);
  }
});

router.delete('/todos/:todoId', async (ctx, _) => {
  const affectedResult = await getDb()
    .collection('todos')
    .deleteOne({ _id: ObjectId(ctx.params.todoId!) });
  console.log(affectedResult);
  if (affectedResult > 0) {
    ctx.response.body = { message: 'Deleted' };
    return;
  }
  ctx.response.body = { message: 'Todo not found' };
  ctx.response.status = 404;
});

export default router;
