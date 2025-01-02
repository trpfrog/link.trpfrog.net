import { describe, test, expect } from "vitest";
import app from ".";

describe("app", () => {
  test("should redirect to the correct URL", async () => {
    const res = await app.request("/home");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://trpfrog.net");
  });

  test("should return 404 for unknown URLs", async () => {
    const res = await app.request("/unknown");
    expect(res.status).toBe(404);
  });

  test("should return 404 for invalid URLs", async () => {
    const res = await app.request("/home/home");
    expect(res.status).toBe(404);
  });
});
