const request = require("supertest");
const app = require("../src/app");

describe("Component API", () => {
  test("GET /api/health returns ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test("POST /api/components validates payload", async () => {
    const response = await request(app).post("/api/components").send({
      framework: "invalid-fw",
      component: "button"
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });
});
