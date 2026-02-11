const crypto = require("node:crypto");
const request = require("supertest");
const app = require("../src/app");

const TEST_SECRET = "test-jwt-secret";

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signToken(payload, secret = TEST_SECRET) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${signingInput}.${signature}`;
}

describe("Component API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  test("GET /api/health returns ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test("POST /api/components requires auth", async () => {
    const response = await request(app).post("/api/components").send({
      framework: "react",
      component: "button"
    });

    expect(response.status).toBe(401);
    expect(response.body.ok).toBe(false);
  });

  test("POST /api/components enforces role", async () => {
    const viewerToken = signToken({ role: "viewer", exp: Math.floor(Date.now() / 1000) + 3600 });

    const response = await request(app)
      .post("/api/components")
      .set("Authorization", `Bearer ${viewerToken}`)
      .send({
        framework: "react",
        component: "button"
      });

    expect(response.status).toBe(403);
    expect(response.body.ok).toBe(false);
  });

  test("POST /api/components validates payload when authenticated", async () => {
    const editorToken = signToken({ role: "editor", exp: Math.floor(Date.now() / 1000) + 3600 });

    const response = await request(app)
      .post("/api/components")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({
        framework: "invalid-fw",
        component: "button"
      });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("GET /api/components/search validates query", async () => {
    const response = await request(app).get("/api/components/search");

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });
});
