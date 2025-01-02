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

  if (remoteYamlUri) {
    const res = await fetch(remoteYamlUri, {
      cf: {
        cacheTtl: 30,
        cacheEverything: true,
      },
    });
    const rawYaml = await res.text();
    const parsedUriRecord = uncheckedUrlRecordSchema.parse(yaml.parse(rawYaml));
    Object.assign(urls, parsedUriRecord);
  }

  const uncheckedUrl = urls[key];
  const url = z.string().url().parse(uncheckedUrl);
  if (!url) {
    return c.notFound();
  }
  return c.redirect(url);
});

export default app;
