import { Hono } from "hono";
import { z } from "zod";
import rawURLs from "../urls.yaml";
import * as yaml from "yaml";
import { Env } from "./env";
import { env } from "hono/adapter";

const uncheckedUrlRecordSchema = z.record(z.string());
const urls = uncheckedUrlRecordSchema.parse(rawURLs);

const app = new Hono<Env>().get("/:key", async (c) => {
  const key = c.req.param("key");
  const remoteYamlUri = env(c).REDIRECT_YAML_URI;

  let uncheckedUrl = urls[key];

  if (!uncheckedUrl && remoteYamlUri) {
    const res = await fetch(remoteYamlUri, {
      cf: {
        cacheTtl: 30,
        cacheEverything: true,
      },
    });
    const rawYaml = await res.text();
    const parsedUriRecord = uncheckedUrlRecordSchema.parse(yaml.parse(rawYaml));
    uncheckedUrl = parsedUriRecord[key];
  }

  if (!uncheckedUrl) {
    return c.notFound();
  }
  const url = z.string().url().parse(uncheckedUrl);
  return c.redirect(url);
});

export default app;
