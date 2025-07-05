import express, { query } from "express";
import { renderPlaygroundPage } from "@apollographql/graphql-playground-html";
import playgroundPkg from "@apollographql/graphql-playground-react/package.json";
import falsey from "falsey";
import { addDevQueryMiddlewares } from "./lib/devQuery";

class GraphQLPlaygroundApp {
  _apiPath: string;
  _graphiqlPath: string;

  constructor({
    apiPath = "/admin/api",
    graphiqlPath = "/admin/graphiql",
  } = {}) {
    this._apiPath = apiPath;
    this._graphiqlPath = graphiqlPath;
  }

  /**
   * @return Array<middlewares>
   */
  getMiddleware({ dev }: { dev: boolean }) {
    const graphiqlPath = this._graphiqlPath;
    const apiPath = this._apiPath;
    const app = express();
    if (dev && falsey(process.env.DISABLE_LOGGING)) {
      // NOTE: Must come before we setup the GraphQL API
      const devQueryPath = `${graphiqlPath}/go`;
      addDevQueryMiddlewares(app, apiPath, graphiqlPath, devQueryPath);
    }

    const endpoint = apiPath;
    app.get(graphiqlPath, (req, res) => {
      let tab: any = { endpoint };
      if (req?.query?.query) {
        tab.query = req.query.query;
        tab.variables = req.query.variables;
      }

      res.setHeader("Content-Type", "text/html");
      res.write(
        renderPlaygroundPage({
          endpoint,
          version: playgroundPkg.version,
          tabs: [tab],
          settings: { "request.credentials": "same-origin" },
        }),
      );
      res.end();
    });

    return app;
  }

  /**
   * @param Options { distDir }
   */
  build() {}
}

module.exports = {
  GraphQLPlaygroundApp,
};
