const supertest = require("supertest");
const { GraphQLPlaygroundApp } = require("../dist");

describe("GraphQLPlaygroundApp", () => {
  let server = null;
  beforeAll(() => {
    const app = new GraphQLPlaygroundApp();
    const middleware = app.getMiddleware({ dev: true });
    server = supertest(middleware);
  });

  it("GET /admin/graphiql should show ", async () => {
    const res = await server.get("/admin/graphiql");
    expect(res.statusCode).toEqual(200);
  });
});
