import { Hono } from "hono";
import { z } from "zod";
import rawURLs from "../urls.yaml";

const urls = z.record(z.string(), z.string().url()).parse(rawURLs);

const app = new Hono();

app.get("/:key", (c) => {
  const key = c.req.param("key");
  const url = urls[key];
  if (!url) {
    return c.notFound();
  }
  return c.redirect(url);
});

export default app;
