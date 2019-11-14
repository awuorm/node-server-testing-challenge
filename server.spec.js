const server = require("./server");
const request = require("supertest");

describe("server", () => {
    describe("register endpoint", () => {
        test("environment is testing", () => {
            expect(process.env.DB_ENV).toBe("testing");
        });

        test("should return 200 ok", async () => {
            const response = await request(server).get("/");
            expect(response.status).toBe(200);
        })
    })
})