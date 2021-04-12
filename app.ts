import { Application } from 'https://deno.land/x/oak@v6.5.0/mod.ts';

const app = new Application();

app.use((ctx, next) => {
  ctx.response.body = 'Hello, world'
})

await app.listen({ port: 3000 });
