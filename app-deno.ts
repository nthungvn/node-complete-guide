import { Application } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import todoRoutes from './routes/todos-deno.ts';

const app = new Application();

app.use(async (ctx, next) => {
  console.log('Middleware');
  await next();
});
app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  ctx.response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, PUT, POST, DELETE, OPTIONS',
  );
  await next();
});
app.use(todoRoutes.routes());
app.use(todoRoutes.allowedMethods());

await app.listen({ port: 8080 });
