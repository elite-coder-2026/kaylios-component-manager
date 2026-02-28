const request = require("supertest");
const app = require("../src/app");

describe("Component API", () => {
  test("GET /api/health returns ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test("POST /api/components validates payload without auth", async () => {
    const response = await request(app).post("/api/components").send({
      framework: "invalid-fw",
      component: "button"
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("POST /api/components validates component naming without auth", async () => {
    const response = await request(app).post("/api/components").send({
      framework: "react",
      component: "Bad Name"
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("POST /api/components requires component", async () => {
    const response = await request(app).post("/api/components").send({
      framework: "react"
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
