// deno-lint-ignore-file
import { Hono } from "https://deno.land/x/hono@v4.3.4/mod.ts";

const app = new Hono();

const urlData: any = [];

//randomUrlにクライアントは1つしかアクセスできないようにしてその一台とコネクションが確立されたらそのURLを削除する

app.use('/id/:id', async (c: any, next: any) => {
  const id = c.req.param("id");
  if (urlData.includes(id)) {
    urlData.splice(urlData.indexOf(id), 1);
    return next();
  } else {
    return c.status(403).text("403 Forbidden");
  }
});


app.get("/", (c: any) => {
  return c.text("Hello Hono!");
});

app.get("/redirect", async (c: any) => {
   const randomUrl = await [...Array(32)]
    .map(
      () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
          Math.floor(Math.random() * 62)
        ]
    )
    .join("")
    .match(/.{1,9}/g)!
    .join("-");
  urlData.push(randomUrl);
  console.log(randomUrl);
  console.log(urlData);
  return c.redirect(`/id/${randomUrl}`);
});

app.get("/id/:id", (c: any) => {
  const id = c.req.param("id");
  console.log(urlData)
  return c.text(`Hello Hono! ${id}`);
});

Deno.serve(app.fetch);
